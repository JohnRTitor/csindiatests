import type { RichContent } from "$lib/features/pyq/types";

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
  text?: string;
  content?: RichContent[];
  options: {
    id: string;
    text?: string;
    content?: RichContent[];
  }[];
  correctOptionId: string | null;
  explanation: string | RichContent[] | null;
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
