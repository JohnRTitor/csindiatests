export type QuizMode = "practice" | "timed" | "review";

export interface ExamConfig {
  id: string;
  name: string;
  shortName: string;
  description: string;
  subjects: Subject[];
  defaultQuestionCount: number;
  defaultDuration?: number; // in minutes
}

export interface Question {
  id: string;
  examId?: string;
  subjectId: string;
  topic?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  explanation: string;
  tags?: string[];
}

export interface Subject {
  id: string;
  name: string;
  totalQuestions: number;
  attemptedQuestions: number;
  accuracy: number;
  progress: number; // 0-100
  lastPracticed?: string; // ISO date string
}

export interface QuizState {
  questions: Question[];
  currentIndex: number;
  answers: Record<string, string>; // questionId -> selectedOptionId
  status: "idle" | "in-progress" | "completed";
  mode: QuizMode;
  timeRemaining: number | null; // null if untimed, seconds otherwise
  isTimerPaused: boolean;
  score: number;
  startTime: number;
  endTime: number | null;
}

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

export interface QuickPracticeOption {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  isTimed: boolean;
  durationMinutes?: number;
}
