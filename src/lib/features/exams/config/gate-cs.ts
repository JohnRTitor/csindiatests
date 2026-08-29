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

export const gateQuestions: Question[] = [
  {
    id: "gate1",
    examId: "gate-cs",
    subjectId: "os",
    topic: "Deadlocks",
    difficulty: "Hard",
    text: "A system has 3 processes sharing 4 resources. If each process needs a maximum of 2 units, then:",
    options: [
      { id: "A", text: "Deadlock can never occur" },
      { id: "B", text: "Deadlock may occur" },
      { id: "C", text: "Deadlock will always occur" },
      { id: "D", text: "System is in unsafe state" }
    ],
    correctOptionId: "A",
    explanation: "For deadlock to be impossible, the condition is: Total Resources ≥ (Sum of max needs of all processes) - (Number of processes) + 1. Here, 4 ≥ (3 * 2) - 3 + 1, which means 4 ≥ 6 - 3 + 1, or 4 ≥ 4. Since the condition holds true, deadlock can never occur."
  },
  {
    id: "gate2",
    examId: "gate-cs",
    subjectId: "algo",
    topic: "Asymptotic Analysis",
    difficulty: "Medium",
    text: "Let f(n) = n and g(n) = n^(1+sin n). Which of the following is true?",
    options: [
      { id: "A", text: "f(n) = O(g(n))" },
      { id: "B", text: "f(n) = Ω(g(n))" },
      { id: "C", text: "f(n) = Θ(g(n))" },
      { id: "D", text: "None of the above" }
    ],
    correctOptionId: "D",
    explanation: "Since sin(n) oscillates between -1 and 1, the exponent of n in g(n) oscillates between 0 and 2. Thus, for some n, g(n) = n^0 = 1, and for some other n, g(n) = n^2. Because it oscillates, we cannot establish a definitive O or Ω relationship between f(n) = n and g(n)."
  },
  {
    id: "gate3",
    examId: "gate-cs",
    subjectId: "dbms",
    topic: "Transactions",
    difficulty: "Hard",
    text: "Consider a schedule S with transactions T1, T2, T3. If the schedule is conflict serializable, which of the following must be true?",
    options: [
      { id: "A", text: "The precedence graph has no cycles" },
      { id: "B", text: "The schedule is also view serializable" },
      { id: "C", text: "Both A and B" },
      { id: "D", text: "Neither A nor B" }
    ],
    correctOptionId: "C",
    explanation: "A schedule is conflict serializable if and only if its precedence graph (serialization graph) has no cycles. Furthermore, every conflict serializable schedule is also view serializable (though the reverse is not always true)."
  },
  {
    id: "gate4",
    examId: "gate-cs",
    subjectId: "toc",
    topic: "Decidability",
    difficulty: "Hard",
    text: "Which of the following problems is undecidable?",
    options: [
      { id: "A", text: "Membership problem for CFLs" },
      { id: "B", text: "Emptiness problem for Regular Languages" },
      { id: "C", text: "Equivalence problem for Turing Machines" },
      { id: "D", text: "Finiteness problem for CFLs" }
    ],
    correctOptionId: "C",
    explanation: "The equivalence problem for Turing Machines (whether two TMs accept the same language) is undecidable by Rice's Theorem. The membership and finiteness problems for CFLs, and the emptiness problem for Regular Languages are all decidable."
  },
  {
    id: "gate5",
    examId: "gate-cs",
    subjectId: "p-ds",
    topic: "Pointers in C",
    difficulty: "Medium",
    text: "What is the output of the following C code snippet?\n\nint a[5] = {1, 2, 3, 4, 5};\nint *p = a;\nprintf(\"%d\", *(p+2));",
    options: [
      { id: "A", text: "1" },
      { id: "B", text: "2" },
      { id: "C", text: "3" },
      { id: "D", text: "4" }
    ],
    correctOptionId: "C",
    explanation: "The array `a` holds {1, 2, 3, 4, 5}. `p` points to the first element `a[0]`, which is 1. `*(p+2)` increments the pointer by 2 integers, pointing to `a[2]`, and then dereferences it, which yields 3."
  },
  {
    id: "gate6",
    examId: "gate-cs",
    subjectId: "cn",
    topic: "Subnetting",
    difficulty: "Hard",
    text: "A network has a subnet mask of 255.255.255.224. How many usable host addresses are available per subnet?",
    options: [
      { id: "A", text: "32" },
      { id: "B", text: "30" },
      { id: "C", text: "64" },
      { id: "D", text: "62" }
    ],
    correctOptionId: "B",
    explanation: "The mask 255.255.255.224 corresponds to /27. This leaves 32 - 27 = 5 bits for the host ID. The total number of addresses per subnet is 2^5 = 32. Subtracting the network address and the broadcast address leaves 32 - 2 = 30 usable host addresses."
  },
  {
    id: "gate7",
    examId: "gate-cs",
    subjectId: "ca",
    topic: "Pipelining",
    difficulty: "Hard",
    text: "In a 5-stage pipeline, if the clock cycle time is 10 ns and 20% of instructions incur a 2-cycle branch penalty, what is the average instruction execution time?",
    options: [
      { id: "A", text: "10 ns" },
      { id: "B", text: "12 ns" },
      { id: "C", text: "14 ns" },
      { id: "D", text: "20 ns" }
    ],
    correctOptionId: "C",
    explanation: "Average Instruction Execution Time = Base CPI + Stall Cycles per Instruction. Base CPI in ideal pipeline = 1. Stall cycles = 0.20 * 2 = 0.4. Total CPI = 1.4. Average Execution Time = CPI * Clock Cycle Time = 1.4 * 10 ns = 14 ns."
  },
  {
    id: "gate8",
    examId: "gate-cs",
    subjectId: "dl",
    topic: "Multiplexers",
    difficulty: "Medium",
    text: "How many 2x1 multiplexers are required to construct a 16x1 multiplexer?",
    options: [
      { id: "A", text: "15" },
      { id: "B", text: "16" },
      { id: "C", text: "8" },
      { id: "D", text: "31" }
    ],
    correctOptionId: "A",
    explanation: "To build an N x 1 MUX using 2x1 MUXes, we need (N - 1) 2x1 MUXes. So, for a 16x1 MUX, we need 16 - 1 = 15 multiplexers (organized in levels: 8 + 4 + 2 + 1 = 15)."
  },
  {
    id: "gate9",
    examId: "gate-cs",
    subjectId: "cd",
    topic: "Code Generation",
    difficulty: "Medium",
    text: "Which of the following is an intermediate code form?",
    options: [
      { id: "A", text: "Three-address code" },
      { id: "B", text: "Syntax tree" },
      { id: "C", text: "Postfix notation" },
      { id: "D", text: "All of the above" }
    ],
    correctOptionId: "D",
    explanation: "Intermediate code can be represented in various forms. Common forms include syntax trees (and DAGs), postfix notation, and three-address code (such as quadruples or triples)."
  },
  {
    id: "gate10",
    examId: "gate-cs",
    subjectId: "dm",
    topic: "Combinatorics",
    difficulty: "Easy",
    text: "How many different bit strings of length 8 start with a '1' or end with a '00'?",
    options: [
      { id: "A", text: "128" },
      { id: "B", text: "64" },
      { id: "C", text: "160" },
      { id: "D", text: "192" }
    ],
    correctOptionId: "C",
    explanation: "Let A = strings starting with '1'. |A| = 2^7 = 128. Let B = strings ending with '00'. |B| = 2^6 = 64. A ∩ B = strings starting with '1' AND ending with '00'. |A ∩ B| = 2^5 = 32. By inclusion-exclusion: |A ∪ B| = |A| + |B| - |A ∩ B| = 128 + 64 - 32 = 160."
  }
];
