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
