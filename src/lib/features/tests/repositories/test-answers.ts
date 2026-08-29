import { db } from '$lib/infrastructure/storage/database';
import type { TestAnswer } from '$lib/infrastructure/storage/db.types';

export const testAnswersRepo = {
  async save(answer: TestAnswer): Promise<void> {
    await db.testAnswers.put(answer);
  },

  async getForTest(testSessionId: string): Promise<TestAnswer[]> {
    return await db.testAnswers
      .where('testSessionId')
      .equals(testSessionId)
      .toArray();
  },
  
  async getByQuestion(testSessionId: string, questionId: string): Promise<TestAnswer | undefined> {
    return await db.testAnswers.get({ testSessionId, questionId });
  },

  async deleteForTest(testSessionId: string): Promise<void> {
    const answers = await this.getForTest(testSessionId);
    await db.testAnswers.bulkDelete(answers.map(a => a.id));
  }
};
