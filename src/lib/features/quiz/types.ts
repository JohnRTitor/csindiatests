import type { Question } from "$lib/features/exams/types";

export type QuizMode = "practice" | "timed" | "review";

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
