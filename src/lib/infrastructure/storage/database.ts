import Dexie, { type Table } from 'dexie';
import type { 
  Preference, 
  TestSession, 
  TestAnswer, 
  QuestionProgress, 
  UserStats,
  QuestionAttempt
} from './db.types';

export class CsIndiaTestsDB extends Dexie {
  preferences!: Table<Preference, string>;
  testSessions!: Table<TestSession, string>;
  testAnswers!: Table<TestAnswer, string>;
  questionProgress!: Table<QuestionProgress, string>;
  userStats!: Table<UserStats, number>;
  questionAttempts!: Table<QuestionAttempt, string>;

  constructor() {
    super('csindiatests-db');
    
    this.version(1).stores({
      preferences: 'key',
      testSessions: 'id, examId, status, startedAt',
      testAnswers: 'id, [testSessionId+questionId], testSessionId',
      questionProgress: 'questionId, lastAnsweredAt',
      userStats: 'id'
    });

    this.version(2).stores({
      questionAttempts: 'id, sessionId, questionId, examId, subjectId, topicId, attemptedAt, [sessionId+questionId]'
    });
  }
}

export const db = new CsIndiaTestsDB();
