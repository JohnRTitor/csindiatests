import { db } from '$lib/infrastructure/storage/database';
import type { QuestionProgress } from '$lib/infrastructure/storage/db.types';

export const progressRepo = {
  async get(questionId: string): Promise<QuestionProgress | undefined> {
    return await db.questionProgress.get(questionId);
  },

  async upsert(progress: QuestionProgress): Promise<void> {
    await db.questionProgress.put(progress);
  },

  async listMarkedForReview(): Promise<QuestionProgress[]> {
    return await db.questionProgress
      .filter(p => p.markedForReview)
      .toArray();
  }
};
