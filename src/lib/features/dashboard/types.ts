export interface QuickPracticeOption {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  isTimed: boolean;
  durationMinutes?: number;
}
