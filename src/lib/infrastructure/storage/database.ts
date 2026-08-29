import Dexie, { type Table } from 'dexie';
import type { 
  Preference, 
  TestSession, 
  TestAnswer, 
  QuestionProgress, 
  UserStats 
} from './db.types';

export class CsIndiaTestsDB extends Dexie {
  preferences!: Table<Preference, string>;
  testSessions!: Table<TestSession, string>;
  testAnswers!: Table<TestAnswer, string>;
  questionProgress!: Table<QuestionProgress, string>;
  userStats!: Table<UserStats, number>;

  constructor() {
    super('csindiatests-db');
    
    this.version(1).stores({
      preferences: 'key',
      testSessions: 'id, examId, status, startedAt',
      testAnswers: 'id, [testSessionId+questionId], testSessionId',
      questionProgress: 'questionId, lastAnsweredAt',
      userStats: 'id'
    });
  }
}

export const db = new CsIndiaTestsDB();
