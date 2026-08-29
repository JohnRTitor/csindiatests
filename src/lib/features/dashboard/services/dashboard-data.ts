import { userStatsRepo } from '$lib/features/progress/repositories/user-stats';
import { testHistoryRepo } from '$lib/features/tests/repositories/test-history';
import type { UserStats } from '$lib/infrastructure/storage/db.types';
import type { ActivityItem } from '$lib/features/progress/types';

export const dashboardDataService = {
  async getStats(): Promise<UserStats> {
    return await userStatsRepo.get();
  },

  async getRecentActivity(limit: number = 5): Promise<ActivityItem[]> {
    const sessions = await testHistoryRepo.list({ limit });
    
    return sessions.map(session => {
      // Determine score string
      let scoreStr = undefined;
      if (session.status === 'completed') {
        scoreStr = `${Math.round(session.percentage)}% (${session.score}/${session.totalQuestions})`;
      } else if (session.status === 'in_progress') {
        scoreStr = 'In Progress';
      }

      return {
        id: session.id,
        type: session.mode === 'practice' ? 'practice' : session.mode === 'timed' ? 'test' : 'mixed',
        title: session.title,
        timestamp: session.startedAt,
        score: scoreStr
      };
    });
  }
};
