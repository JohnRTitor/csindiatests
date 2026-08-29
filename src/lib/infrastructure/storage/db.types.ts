export interface Preference {
  key: string;
  value: unknown;
  updatedAt: string;
}

export type TestSessionStatus = 'in_progress' | 'completed' | 'abandoned' | 'expired';

export interface TestSession {
  id: string;
  examId: string;
  title: string;
  mode: string;
  startedAt: string;
  lastActiveAt: string | null;
  questionIds: string[];
  subjectName?: string;
  topicName?: string;
  completedAt: string | null;
  durationSeconds: number | null;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  score: number;
  percentage: number;
  status: TestSessionStatus;
  metadata: Record<string, unknown> | null;
}

export interface TestAnswer {
  id: string;
  testSessionId: string;
  questionId: string;
  selectedAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean | null;
  answeredAt: string | null;
  timeSpentSeconds: number;
  markedForReview: boolean;
  explanationSeen: boolean;
  metadata: Record<string, unknown> | null;
}

export interface QuestionProgress {
  questionId: string;
  attempts: number;
  correctAttempts: number;
  incorrectAttempts: number;
  lastAnsweredAt: string | null;
  lastResult: boolean | null;
  bestTimeSeconds: number | null;
  totalTimeSeconds: number;
  markedForReview: boolean;
  confidence: number;
  metadata: Record<string, unknown> | null;
}

export interface UserStats {
  id: number;
  questionsAttempted: number;
  questionsCorrect: number;
  questionsIncorrect: number;
  testsStarted: number;
  testsCompleted: number;
  totalStudySeconds: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityAt: string | null;
  updatedAt: string;
}

export interface ListTestSessionsOptions {
  limit?: number;
  offset?: number;
  status?: TestSessionStatus;
}
