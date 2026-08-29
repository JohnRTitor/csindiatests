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
  title: string;
  timestamp: string; // ISO date string
  score?: string; // e.g., "82%"
}
