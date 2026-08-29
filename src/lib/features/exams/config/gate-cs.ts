import type { ExamConfig, Question } from "$lib/features/exams/types";

export const gateConfig: ExamConfig = {
  id: "gate-cs",
  name: "GATE Computer Science & IT",
  shortName: "GATE CS",
  description: "Solve GATE-level problems, understand the reasoning, and improve your technical accuracy.",
  defaultQuestionCount: 65,
  defaultDuration: 180,
  subjects: [
    { id: "em", name: "Engineering Mathematics", totalQuestions: 150, attemptedQuestions: 0, accuracy: 0, progress: 0 },
    { id: "dm", name: "Discrete Mathematics", totalQuestions: 200, attemptedQuestions: 0, accuracy: 0, progress: 0 },
    { id: "dl", name: "Digital Logic", totalQuestions: 150, attemptedQuestions: 0, accuracy: 0, progress: 0 },
    { id: "coa", name: "Computer Organization & Architecture", totalQuestions: 180, attemptedQuestions: 0, accuracy: 0, progress: 0 },
    { id: "p-ds", name: "Programming & Data Structures", totalQuestions: 250, attemptedQuestions: 0, accuracy: 0, progress: 0 },
    { id: "algo", name: "Algorithms", totalQuestions: 220, attemptedQuestions: 0, accuracy: 0, progress: 0 },
    { id: "toc", name: "Theory of Computation", totalQuestions: 190, attemptedQuestions: 0, accuracy: 0, progress: 0 },
    { id: "cd", name: "Compiler Design", totalQuestions: 160, attemptedQuestions: 0, accuracy: 0, progress: 0 },
    { id: "os", name: "Operating Systems", totalQuestions: 200, attemptedQuestions: 0, accuracy: 0, progress: 0 },
    { id: "dbms", name: "Databases", totalQuestions: 190, attemptedQuestions: 0, accuracy: 0, progress: 0 },
    { id: "cn", name: "Computer Networks", totalQuestions: 210, attemptedQuestions: 0, accuracy: 0, progress: 0 }
  ]
};

