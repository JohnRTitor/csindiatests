import { DatabaseError, ErrorCodes } from './db.errors';
import type { 
  WorkerRequest, 
  WorkerResponse, 
  TestSession, 
  TestAnswer, 
  QuestionProgress, 
  UserStats, 
  RecordAnswerPayload,
  ListTestSessionsOptions
} from './db.types';

type PendingRequest = {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  timeoutId: number;
};

class DatabaseClient {
  private worker: Worker | null = null;
  private pendingRequests = new Map<string, PendingRequest>();
  private defaultTimeoutMs = 30000; // 30 seconds

  constructor() {
    // Only initialize in browser environment
    if (typeof window !== 'undefined' && typeof Worker !== 'undefined') {
      this.initWorker();
    }
  }

  private initWorker() {
    if (this.worker) return;
    
    // Import worker with ?worker query for Vite
    this.worker = new Worker(new URL('./db.worker.ts', import.meta.url), { type: 'module' });
    
    this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const { id, ok, data, error } = event.data;
      
      const pending = this.pendingRequests.get(id);
      if (pending) {
        clearTimeout(pending.timeoutId);
        this.pendingRequests.delete(id);
        
        if (ok) {
          pending.resolve(data);
        } else {
          pending.reject(new DatabaseError(error?.message || 'Unknown error', error?.code || ErrorCodes.UNKNOWN));
        }
      }
    };

    this.worker.onerror = (error) => {
      console.error('Database worker error:', error);
      // Reject all pending requests
      const errorObj = new DatabaseError('Worker encountered an error', ErrorCodes.WORKER_TERMINATED);
      for (const [id, pending] of this.pendingRequests.entries()) {
        clearTimeout(pending.timeoutId);
        pending.reject(errorObj);
      }
      this.pendingRequests.clear();
    };
  }

  private request<T>(action: string, payload?: any, timeoutMs: number = this.defaultTimeoutMs): Promise<T> {
    if (!this.worker) {
      return Promise.reject(new DatabaseError('Worker not initialized', ErrorCodes.WORKER_TERMINATED));
    }

    return new Promise((resolve, reject) => {
      const id = crypto.randomUUID();
      
      const timeoutId = window.setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new DatabaseError(`Request ${action} timed out after ${timeoutMs}ms`, ErrorCodes.TIMEOUT));
        }
      }, timeoutMs);

      this.pendingRequests.set(id, { resolve, reject, timeoutId });

      const req: WorkerRequest = { id, action, payload };
      this.worker!.postMessage(req);
    });
  }

  // Lifecycle
  async init(): Promise<void> {
    await this.request<void>('init');
  }

  destroy(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      
      const errorObj = new DatabaseError('Worker destroyed', ErrorCodes.WORKER_TERMINATED);
      for (const [id, pending] of this.pendingRequests.entries()) {
        clearTimeout(pending.timeoutId);
        pending.reject(errorObj);
      }
      this.pendingRequests.clear();
    }
  }

  // Preferences API
  async getPreferences(): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>('getPreferences');
  }

  async getPreference<T = unknown>(key: string): Promise<T | null> {
    return this.request<T | null>('getPreference', { key });
  }

  async setPreference(key: string, value: unknown): Promise<void> {
    await this.request<void>('setPreference', { key, value });
  }

  async setPreferences(values: Record<string, unknown>): Promise<void> {
    await this.request<void>('setPreferences', values);
  }

  async deletePreference(key: string): Promise<void> {
    await this.request<void>('deletePreference', { key });
  }

  // Test Sessions API
  async createTestSession(session: Omit<TestSession, 'id'>): Promise<string> {
    return this.request<string>('createTestSession', session);
  }

  async updateTestSession(id: string, updates: Partial<TestSession>): Promise<void> {
    await this.request<void>('updateTestSession', { id, updates });
  }

  async getTestSession(id: string): Promise<TestSession | null> {
    return this.request<TestSession | null>('getTestSession', { id });
  }

  async listTestSessions(options?: ListTestSessionsOptions): Promise<TestSession[]> {
    return this.request<TestSession[]>('listTestSessions', options);
  }

  async listInProgressTests(): Promise<TestSession[]> {
    return this.request<TestSession[]>('listInProgressTests');
  }

  // Test Answers API
  async saveTestAnswer(answer: TestAnswer): Promise<void> {
    await this.request<void>('saveTestAnswer', answer);
  }

  async getTestAnswers(testSessionId: string): Promise<TestAnswer[]> {
    return this.request<TestAnswer[]>('getTestAnswers', { testSessionId });
  }

  // Question Progress API
  async getQuestionProgress(questionId: string): Promise<QuestionProgress | null> {
    return this.request<QuestionProgress | null>('getQuestionProgress', { questionId });
  }

  async upsertQuestionProgress(progress: QuestionProgress): Promise<void> {
    await this.request<void>('upsertQuestionProgress', progress);
  }

  // User Stats API
  async getUserStats(): Promise<UserStats | null> {
    return this.request<UserStats | null>('getUserStats');
  }

  async updateUserStats(updates: Partial<UserStats>): Promise<void> {
    await this.request<void>('updateUserStats', updates);
  }

  // Transactional flows
  async recordAnswer(payload: RecordAnswerPayload): Promise<void> {
    await this.request<void>('recordAnswer', payload);
  }
}

// Singleton instance
let dbInstance: DatabaseClient | null = null;

export function getDatabase(): DatabaseClient {
  if (!dbInstance) {
    dbInstance = new DatabaseClient();
  }
  return dbInstance;
}
