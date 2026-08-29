import type { ExamConfig, Question } from "$lib/features/exams/types";

export const ugcNetConfig: ExamConfig = {
  id: "ugc-net-cs",
  name: "UGC NET Computer Science",
  shortName: "UGC NET",
  description: "Practice Computer Science questions, strengthen fundamentals, and prepare for UGC NET.",
  defaultQuestionCount: 50,
  defaultDuration: 60,
  subjects: [
    { id: "ds", name: "Discrete Structures", totalQuestions: 150, attemptedQuestions: 0, accuracy: 0, progress: 0 },
    { id: "ca", name: "Computer Architecture", totalQuestions: 120, attemptedQuestions: 0, accuracy: 0, progress: 0 },
    { id: "p-ds", name: "Programming & Data Structures", totalQuestions: 200, attemptedQuestions: 0, accuracy: 0, progress: 0 },
    { id: "algo", name: "Algorithms", totalQuestions: 180, attemptedQuestions: 0, accuracy: 0, progress: 0 },
    { id: "toc", name: "Theory of Computation", totalQuestions: 160, attemptedQuestions: 0, accuracy: 0, progress: 0 },
    { id: "cd", name: "Compiler Design", totalQuestions: 110, attemptedQuestions: 0, accuracy: 0, progress: 0 },
    { id: "os", name: "Operating Systems", totalQuestions: 190, attemptedQuestions: 0, accuracy: 0, progress: 0 },
    { id: "dbms", name: "Databases", totalQuestions: 170, attemptedQuestions: 0, accuracy: 0, progress: 0 },
    { id: "cn", name: "Computer Networks", totalQuestions: 180, attemptedQuestions: 0, accuracy: 0, progress: 0 },
    { id: "se", name: "Software Engineering", totalQuestions: 130, attemptedQuestions: 0, accuracy: 0, progress: 0 },
    { id: "ai", name: "Artificial Intelligence", totalQuestions: 140, attemptedQuestions: 0, accuracy: 0, progress: 0 }
  ]
};

