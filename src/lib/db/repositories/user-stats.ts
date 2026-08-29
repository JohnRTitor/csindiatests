import { db } from '../database';
import type { UserStats } from '../db.types';

const SINGLETON_ID = 1;

export const userStatsRepo = {
  async get(): Promise<UserStats> {
    let stats = await db.userStats.get(SINGLETON_ID);
    if (!stats) {
      stats = {
        id: SINGLETON_ID,
        questionsAttempted: 0,
        questionsCorrect: 0,
        questionsIncorrect: 0,
        testsStarted: 0,
        testsCompleted: 0,
        totalStudySeconds: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityAt: null,
        updatedAt: new Date().toISOString()
      };
      await db.userStats.put(stats);
    }
    return stats;
  },

  async update(updates: Partial<UserStats>): Promise<UserStats> {
    const current = await this.get();
    const updated = {
      ...current,
      ...updates,
      id: SINGLETON_ID,
      updatedAt: new Date().toISOString()
    };
    await db.userStats.put(updated);
    return updated;
  }
};
