export interface UserProgress {
  totalQuestionsSolved: number;
  overallAccuracy: number;
  currentStreak: number;
  testsCompleted: number;
  questionsSolvedThisWeek: number;
}

export interface ActivityItem {
  id: string;
  type: "test" | "practice" | "mixed";
  examName: string;
  modeName: string;
  subjectName?: string;
  topicName?: string;
  title: string;
  answeredCount: number;
  totalQuestions: number;
  progressPercent: number;
  status: 'in_progress' | 'completed' | 'abandoned' | 'expired';
  timestamp: string; // ISO date string
  lastActiveAt: string; // ISO date string
  score?: string; // e.g., "82%"
  resumeHref?: string;
  resultHref?: string;
}
