import type { UserProgress, ActivityItem } from "$lib/features/progress/types";
import type { QuickPracticeOption } from "$lib/features/dashboard/types";
import { mockSubjects } from "$lib/features/exams/config/subjects";

export const mockUserProgress: UserProgress = {
  totalQuestionsSolved: 842,
  overallAccuracy: 76,
  currentStreak: 12,
  testsCompleted: 8,
  questionsSolvedThisWeek: 154,
};

export const mockActivityFeed: ActivityItem[] = [];

export const mockQuickPracticeOptions: QuickPracticeOption[] = [
  {
    id: "warmup",
    title: "10 Questions",
    description: "Quick warm-up",
    questionCount: 10,
    isTimed: false,
  },
  {
    id: "focused",
    title: "25 Questions",
    description: "Focused practice",
    questionCount: 25,
    isTimed: false,
  },
  {
    id: "deep",
    title: "50 Questions",
    description: "Deep practice",
    questionCount: 50,
    isTimed: false,
  },
  {
    id: "test",
    title: "Timed Test",
    description: "60 min",
    questionCount: 50,
    isTimed: true,
    durationMinutes: 60,
  },
];

// Helper to get active subjects for "Continue Studying"
export const getActiveSubjects = () => {
  return mockSubjects
    .filter(s => s.attemptedQuestions > 0 && s.attemptedQuestions < s.totalQuestions)
    .sort((a, b) => {
      // Sort by recently practiced (mocking it by just picking a few)
      return (b.progress || 0) - (a.progress || 0);
    })
    .slice(0, 4);
};
