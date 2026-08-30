import type { TestContext } from '../types';
import { testHistoryRepo } from '../repositories/test-history';
import type { TestSession } from '$lib/infrastructure/storage/db.types';

export const sessionManager = {
  areSameTestContext(a: TestContext, b: TestSession | TestContext): boolean {
    if (a.examId !== b.examId) return false;
    
    if (a.testType !== b.testType) return false;
    if (a.scope !== b.scope) return false;

    if (a.scope === 'subject') {
      return a.subjectId === b.subjectId;
    }
    
    if (a.scope === 'topic') {
      return a.subjectId === b.subjectId && a.topicId === b.topicId;
    }
    
    if (a.scope === 'paper') {
      return a.paperId === b.paperId;
    }
    
    // scope === 'mixed'
    return true;
  },

  async findActiveSession(context: TestContext): Promise<TestSession | undefined> {
    const inProgress = await testHistoryRepo.listInProgress();
    return inProgress.find(session => this.areSameTestContext(context, session));
  }
};
