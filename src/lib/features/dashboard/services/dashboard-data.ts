import { userStatsRepo } from '$lib/features/progress/repositories/user-stats';
import { testHistoryRepo } from '$lib/features/tests/repositories/test-history';
import type { UserStats } from '$lib/infrastructure/storage/db.types';
import type { ActivityItem } from '$lib/features/progress/types';

export const dashboardDataService = {
  async getStats(): Promise<UserStats> {
    return await userStatsRepo.get();
  },

  async getRecentActivity(limit: number = 5): Promise<ActivityItem[]> {
    const sessions = await testHistoryRepo.list();
    // Sort by lastActiveAt descending
    const sortedSessions = sessions.sort((a, b) => {
      const timeA = new Date(a.lastActiveAt || a.startedAt).getTime();
      const timeB = new Date(b.lastActiveAt || b.startedAt).getTime();
      return timeB - timeA;
    });

    return sortedSessions.slice(0, limit).map(session => {
      let scoreStr = undefined;
      if (session.status === 'completed') {
        scoreStr = `${Math.round(session.percentage)}% (${session.score}/${session.totalQuestions})`;
      }

      // Map exam short names
      let examNameStr = session.examId === 'gate-cs' ? 'GATE Computer Science' : 
                        session.examId === 'ugc-net-cs' ? 'UGC NET Computer Science' : session.title;
      
      let modeNameStr = session.mode === 'practice' ? 'Practice' :
                        session.mode === 'timed' ? 'Mock Test' : 'Test';
      if (session.title.toLowerCase().includes('quick')) modeNameStr = 'Quick Practice';
      if (session.title.toLowerCase().includes('focused')) modeNameStr = 'Focused Practice';
      if (session.title.toLowerCase().includes('full')) modeNameStr = 'Full Practice';
      
      // Determine resumeHref based on title parsing or mode
      let resumeHref = `/${session.examId}/practice/focused?session=${session.id}`;
      if (session.title.toLowerCase().includes('quick')) resumeHref = `/${session.examId}/practice/quick?session=${session.id}`;
      if (session.title.toLowerCase().includes('full')) resumeHref = `/${session.examId}/practice/full?session=${session.id}`;
      if (session.mode === 'timed') resumeHref = `/${session.examId}/mock-test?session=${session.id}`;

      let resultHref = `/${session.examId}/results/${session.id}`; // generic result route fallback
      
      let progressPercent = session.totalQuestions > 0 ? Math.round((session.answeredQuestions / session.totalQuestions) * 100) : 0;

      return {
        id: session.id,
        type: session.mode === 'practice' ? 'practice' : session.mode === 'timed' ? 'test' : 'mixed',
        examName: examNameStr,
        modeName: modeNameStr,
        subjectName: session.subjectName,
        topicName: session.topicName,
        title: session.title,
        answeredCount: session.answeredQuestions,
        totalQuestions: session.totalQuestions,
        progressPercent: progressPercent,
        status: session.status,
        timestamp: session.startedAt,
        lastActiveAt: session.lastActiveAt || session.startedAt,
        score: scoreStr,
        resumeHref: session.status === 'in_progress' ? resumeHref : undefined,
        resultHref: session.status === 'completed' ? resultHref : undefined
      };
    });
  },

  async getRecentActivityPaginated(page: number, pageSize: number): Promise<{ items: ActivityItem[], totalCount: number }> {
    const sessions = await testHistoryRepo.list();
    const totalCount = sessions.length;
    
    // Sort by lastActiveAt descending
    const sortedSessions = sessions.sort((a, b) => {
      const timeA = new Date(a.lastActiveAt || a.startedAt).getTime();
      const timeB = new Date(b.lastActiveAt || b.startedAt).getTime();
      return timeB - timeA;
    });

    const startIndex = (page - 1) * pageSize;
    const paginatedSessions = sortedSessions.slice(startIndex, startIndex + pageSize);

    const items: ActivityItem[] = paginatedSessions.map(session => {
      let scoreStr = undefined;
      if (session.status === 'completed') {
        scoreStr = `${Math.round(session.percentage)}% (${session.score}/${session.totalQuestions})`;
      }

      // Map exam short names
      let examNameStr = session.examId === 'gate-cs' ? 'GATE Computer Science' : 
                        session.examId === 'ugc-net-cs' ? 'UGC NET Computer Science' : session.title;
      
      let modeNameStr = session.mode === 'practice' ? 'Practice' :
                        session.mode === 'timed' ? 'Mock Test' : 'Test';
      if (session.title.toLowerCase().includes('quick')) modeNameStr = 'Quick Practice';
      if (session.title.toLowerCase().includes('focused')) modeNameStr = 'Focused Practice';
      if (session.title.toLowerCase().includes('full')) modeNameStr = 'Full Practice';
      
      // Determine resumeHref based on title parsing or mode
      let resumeHref = `/${session.examId}/practice/focused?session=${session.id}`;
      if (session.title.toLowerCase().includes('quick')) resumeHref = `/${session.examId}/practice/quick?session=${session.id}`;
      if (session.title.toLowerCase().includes('full')) resumeHref = `/${session.examId}/practice/full?session=${session.id}`;
      if (session.mode === 'timed') resumeHref = `/${session.examId}/mock-test?session=${session.id}`;

      let resultHref = `/${session.examId}/results/${session.id}`; // generic result route fallback
      
      let progressPercent = session.totalQuestions > 0 ? Math.round((session.answeredQuestions / session.totalQuestions) * 100) : 0;

      return {
        id: session.id,
        type: session.mode === 'practice' ? 'practice' : session.mode === 'timed' ? 'test' : 'mixed',
        examName: examNameStr,
        modeName: modeNameStr,
        subjectName: session.subjectName,
        topicName: session.topicName,
        title: session.title,
        answeredCount: session.answeredQuestions,
        totalQuestions: session.totalQuestions,
        progressPercent: progressPercent,
        status: session.status,
        timestamp: session.startedAt,
        lastActiveAt: session.lastActiveAt || session.startedAt,
        score: scoreStr,
        resumeHref: session.status === 'in_progress' ? resumeHref : undefined,
        resultHref: session.status === 'completed' ? resultHref : undefined
      };
    });

    return { items, totalCount };
  }
};
