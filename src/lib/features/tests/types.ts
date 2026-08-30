export type TestType = 'practice' | 'mock-test' | 'pyq';
export type PracticeScope = 'mixed' | 'subject' | 'topic' | 'paper';

export interface TestContext {
  examId: string;
  testType: TestType;
  scope: PracticeScope;
  subjectId?: string;
  topicId?: string;
  paperId?: string;
  title: string;
  mode?: string; // e.g., 'practice' or 'timed'
}
