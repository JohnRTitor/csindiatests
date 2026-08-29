import type { UserProgress, ActivityItem, QuickPracticeOption } from "$lib/types";
import { mockSubjects } from "./subjects";

export const mockUserProgress: UserProgress = {
  totalQuestionsSolved: 842,
  overallAccuracy: 76,
  currentStreak: 12,
  testsCompleted: 8,
  questionsSolvedThisWeek: 154,
};

export const mockActivityFeed: ActivityItem[] = [
  {
    id: "act-1",
    type: "practice",
    title: "Completed Algorithms practice",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act-2",
    type: "test",
    title: "Scored 82% on Operating Systems test",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    score: "82%",
  },
  {
    id: "act-3",
    type: "practice",
    title: "Practiced Computer Networks",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act-4",
    type: "mixed",
    title: "Completed 25-question mixed quiz",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

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
