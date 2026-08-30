import { db } from '$lib/infrastructure/storage/database';
import type { QuestionAttempt } from '$lib/infrastructure/storage/db.types';

export const questionAttemptsRepo = {
  async save(attempt: QuestionAttempt): Promise<void> {
    await db.questionAttempts.put(attempt);
  },

  async bulkSave(attempts: QuestionAttempt[]): Promise<void> {
    await db.questionAttempts.bulkPut(attempts);
  },

  async getForSession(sessionId: string): Promise<QuestionAttempt[]> {
    return await db.questionAttempts
      .where('sessionId')
      .equals(sessionId)
      .toArray();
  },

  async getForExam(examId: string): Promise<QuestionAttempt[]> {
    return await db.questionAttempts
      .where('examId')
      .equals(examId)
      .toArray();
  },
  
  async getForSubject(subjectId: string): Promise<QuestionAttempt[]> {
    return await db.questionAttempts
      .where('subjectId')
      .equals(subjectId)
      .toArray();
  },

  async getAll(): Promise<QuestionAttempt[]> {
    return await db.questionAttempts.toArray();
  },

  async deleteForSession(sessionId: string): Promise<void> {
    const attempts = await this.getForSession(sessionId);
    await db.questionAttempts.bulkDelete(attempts.map(a => a.id));
  },

  async deleteAll(): Promise<void> {
    await db.questionAttempts.clear();
  }
};
