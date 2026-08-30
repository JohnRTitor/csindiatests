export interface QuickPracticeOption {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  isTimed: boolean;
  durationMinutes?: number;
}

export interface PracticeMode {
  title: string;
  description: string;
  content: string;
  href: string;
  buttonText: string;
  icon: any; // Lucide icon component
  iconColor: string;
  isExamMode: boolean;
}
