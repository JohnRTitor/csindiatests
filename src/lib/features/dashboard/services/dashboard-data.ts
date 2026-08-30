import { userStatsRepo } from '$lib/features/progress/repositories/user-stats';
import { testHistoryRepo } from '$lib/features/tests/repositories/test-history';
import type { UserStats, TestSession } from '$lib/infrastructure/storage/db.types';
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

    return sortedSessions.slice(0, limit).map(mapSessionToActivity);
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

    const items: ActivityItem[] = paginatedSessions.map(mapSessionToActivity);

    return { items, totalCount };
  },

  async getQuestionsSolvedToday(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();
    
    // Using Dexie's db object imported locally or from repo
    // Wait, testAnswersRepo doesn't export db directly, but dashboard-data does not import db.
    // Let's import it
    return await (await import('$lib/infrastructure/storage/database')).db.testAnswers
      .filter(a => a.answeredAt ? new Date(a.answeredAt).getTime() >= todayMs : false)
      .count();
  }
};

function mapSessionToActivity(session: TestSession): ActivityItem {
  let scoreStr = undefined;
  if (session.status === 'completed') {
    scoreStr = `${Math.round(session.percentage)}% (${session.score}/${session.totalQuestions})`;
  }

  let examNameStr = session.examId === 'gate-cs' ? 'GATE Computer Science' : 
                    session.examId === 'ugc-net-cs' ? 'UGC NET Computer Science' : session.title;
  
  const testType = session.testType;
  const scope = session.scope;

  let modeNameStr = 'Practice';
  if (testType === 'mock-test') modeNameStr = 'Mock Test';
  else if (testType === 'pyq') modeNameStr = 'PYQ Paper';
  else if (testType === 'practice') {
    if (session.title.toLowerCase().includes('quick')) modeNameStr = 'Quick Practice';
    else if (session.title.toLowerCase().includes('focused')) modeNameStr = 'Focused Practice';
    else if (session.title.toLowerCase().includes('full')) modeNameStr = 'Full Practice';
    else if (scope === 'subject') modeNameStr = 'Subject Practice';
    else modeNameStr = 'Practice';
  }
  
  let resumeHref = `/${session.examId}/practice/focused?session=${session.id}`;
  if (testType === 'pyq' && session.paperId) {
    resumeHref = `/${session.examId}/pyq/${session.paperId}?session=${session.id}`;
  } else if (testType === 'mock-test') {
    resumeHref = `/${session.examId}/mock-test?session=${session.id}`;
  } else if (scope === 'subject' && session.subjectId) {
    resumeHref = `/${session.examId}/subjects/${session.subjectId}?session=${session.id}`;
  } else if (scope === 'mixed') {
    if (session.title.toLowerCase().includes('quick')) resumeHref = `/${session.examId}/practice/quick?session=${session.id}`;
    else if (session.title.toLowerCase().includes('full')) resumeHref = `/${session.examId}/practice/full?session=${session.id}`;
    else resumeHref = `/${session.examId}/practice/focused?session=${session.id}`;
  }

  let resultHref = `/${session.examId}/results/${session.id}`;
  
  let progressPercent = session.totalQuestions > 0 ? Math.round((session.answeredQuestions / session.totalQuestions) * 100) : 0;

  let activityType: "test" | "practice" | "mixed" = 'mixed';
  if (testType === 'mock-test' || testType === 'pyq') activityType = 'test';
  else if (testType === 'practice') activityType = 'practice';

  return {
    id: session.id,
    type: activityType,
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
}
