import { db } from '$lib/infrastructure/storage/database';
import type { TestSession, ListTestSessionsOptions, TestSessionStatus } from '$lib/infrastructure/storage/db.types';

export const testHistoryRepo = {
  async create(session: TestSession): Promise<void> {
    await db.testSessions.add(session);
  },

  async update(id: string, updates: Partial<TestSession>): Promise<void> {
    await db.testSessions.update(id, updates);
  },

  async get(id: string): Promise<TestSession | undefined> {
    return await db.testSessions.get(id);
  },

  async list(options?: ListTestSessionsOptions): Promise<TestSession[]> {
    let collection = db.testSessions.toCollection();

    if (options?.status) {
      collection = db.testSessions.where('status').equals(options.status);
    }

    if (options?.offset) {
      collection = collection.offset(options.offset);
    }
    
    if (options?.limit) {
      collection = collection.limit(options.limit);
    }

    // Default reverse chronological by startedAt
    return await collection.reverse().sortBy('startedAt');
  },

  async listInProgress(): Promise<TestSession[]> {
    return await db.testSessions
      .where('status')
      .equals('in_progress')
      .reverse()
      .sortBy('startedAt');
  }
};
