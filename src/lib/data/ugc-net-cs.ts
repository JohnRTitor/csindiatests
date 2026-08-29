import type { ExamConfig, Question } from "$lib/types";

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

export const ugcNetQuestions: Question[] = [
  {
    id: "ugc1",
    examId: "ugc-net-cs",
    subjectId: "os",
    topic: "CPU Scheduling",
    difficulty: "Medium",
    text: "Which of the following scheduling algorithms can result in starvation?",
    options: [
      { id: "A", text: "First-Come, First-Served (FCFS)" },
      { id: "B", text: "Shortest Job First (SJF)" },
      { id: "C", text: "Round Robin (RR)" },
      { id: "D", text: "Both SJF and Priority Scheduling" }
    ],
    correctOptionId: "D",
    explanation: "Priority scheduling and Shortest Job First (SJF) can lead to starvation. In Priority scheduling, low-priority processes may wait indefinitely if higher-priority processes keep arriving. SJF can cause starvation for longer processes if short processes continue to arrive. Round Robin and FCFS are starvation-free."
  },
  {
    id: "ugc2",
    examId: "ugc-net-cs",
    subjectId: "cn",
    topic: "OSI Model",
    difficulty: "Easy",
    text: "In the OSI model, which layer is responsible for routing the packets from the source to the destination?",
    options: [
      { id: "A", text: "Data Link Layer" },
      { id: "B", text: "Network Layer" },
      { id: "C", text: "Transport Layer" },
      { id: "D", text: "Session Layer" }
    ],
    correctOptionId: "B",
    explanation: "The Network layer (Layer 3) is responsible for routing packets from source to destination across multiple networks. IP (Internet Protocol) operates at this layer. The Data Link layer handles node-to-node delivery, while the Transport layer deals with end-to-end communication and reliability."
  },
  {
    id: "ugc3",
    examId: "ugc-net-cs",
    subjectId: "dbms",
    topic: "Normalization",
    difficulty: "Hard",
    text: "A relation R(A,B,C,D,E) has the following functional dependencies: {A → B, BC → D, E → C, D → A}. What is the candidate key?",
    options: [
      { id: "A", text: "A, E" },
      { id: "B", text: "AE, BE, DE" },
      { id: "C", text: "B, C, D" },
      { id: "D", text: "AE" }
    ],
    correctOptionId: "B",
    explanation: "To find the candidate keys, we compute closures. Notice that 'E' does not appear on the right side of any dependency, so 'E' must be in every candidate key. Let's find closures of combinations with E:\n- (AE)+ = AEBCDA = ABCDE (AE is a candidate key)\n- Since A → B is not fully reducing to B, let's check BE: (BE)+ = BECDA = ABCDE (BE is a candidate key)\n- Check CE: (CE)+ = CE (not a candidate key)\n- Check DE: (DE)+ = DEABC = ABCDE (DE is a candidate key)\nThus, AE, BE, and DE are candidate keys."
  },
  {
    id: "ugc4",
    examId: "ugc-net-cs",
    subjectId: "algo",
    topic: "Complexity",
    difficulty: "Medium",
    text: "What is the worst-case time complexity of QuickSort?",
    options: [
      { id: "A", text: "O(n)" },
      { id: "B", text: "O(n log n)" },
      { id: "C", text: "O(n²)" },
      { id: "D", text: "O(log n)" }
    ],
    correctOptionId: "C",
    explanation: "The worst-case time complexity of QuickSort is O(n²), which occurs when the pivot element picked is always the greatest or smallest element, leading to highly unbalanced partitions (e.g., when the array is already sorted and we pick the first or last element as pivot)."
  },
  {
    id: "ugc5",
    examId: "ugc-net-cs",
    subjectId: "se",
    topic: "Software Models",
    difficulty: "Easy",
    text: "Which software engineering model is most suitable for a project where requirements are well understood and unlikely to change?",
    options: [
      { id: "A", text: "Spiral Model" },
      { id: "B", text: "Waterfall Model" },
      { id: "C", text: "Agile Model" },
      { id: "D", text: "RAD Model" }
    ],
    correctOptionId: "B",
    explanation: "The Waterfall model is a linear sequential approach that assumes requirements are clear, well-understood, and stable at the beginning of the project."
  },
  {
    id: "ugc6",
    examId: "ugc-net-cs",
    subjectId: "ai",
    topic: "Search Algorithms",
    difficulty: "Medium",
    text: "Which of the following search algorithms is guaranteed to find the optimal solution if it exists?",
    options: [
      { id: "A", text: "Depth-First Search (DFS)" },
      { id: "B", text: "Hill Climbing" },
      { id: "C", text: "A* Search (with an admissible heuristic)" },
      { id: "D", text: "Greedy Best-First Search" }
    ],
    correctOptionId: "C",
    explanation: "A* Search is guaranteed to be optimal (and complete) if the heuristic function used is admissible, meaning it never overestimates the actual cost to reach the goal."
  },
  {
    id: "ugc7",
    examId: "ugc-net-cs",
    subjectId: "ds",
    topic: "Set Theory",
    difficulty: "Easy",
    text: "If set A has m elements and set B has n elements, how many relations can be defined from A to B?",
    options: [
      { id: "A", text: "m * n" },
      { id: "B", text: "2^(m+n)" },
      { id: "C", text: "2^(mn)" },
      { id: "D", text: "m^n" }
    ],
    correctOptionId: "C",
    explanation: "A relation from set A to set B is a subset of the Cartesian product A × B. The Cartesian product has m * n elements. Since a set with k elements has 2^k subsets, there are 2^(mn) possible relations."
  },
  {
    id: "ugc8",
    examId: "ugc-net-cs",
    subjectId: "toc",
    topic: "Regular Languages",
    difficulty: "Medium",
    text: "Which of the following is closed under intersection?",
    options: [
      { id: "A", text: "Context-Free Languages" },
      { id: "B", text: "Regular Languages" },
      { id: "C", text: "Both A and B" },
      { id: "D", text: "None of the above" }
    ],
    correctOptionId: "B",
    explanation: "Regular languages are closed under intersection. Context-Free Languages (CFLs) are not closed under intersection, although the intersection of a CFL and a Regular Language is always a CFL."
  },
  {
    id: "ugc9",
    examId: "ugc-net-cs",
    subjectId: "cd",
    topic: "Parsing",
    difficulty: "Hard",
    text: "Which of the following parsing techniques is the most powerful?",
    options: [
      { id: "A", text: "LL(1)" },
      { id: "B", text: "SLR(1)" },
      { id: "C", text: "LALR(1)" },
      { id: "D", text: "LR(1)" }
    ],
    correctOptionId: "D",
    explanation: "LR(1) is the most powerful parsing technique among the given options. The hierarchy of parsing power is LL(1) < SLR(1) < LALR(1) < LR(1). LR(1) parsers can recognize the largest class of deterministic context-free languages."
  },
  {
    id: "ugc10",
    examId: "ugc-net-cs",
    subjectId: "ca",
    topic: "Memory Hierarchy",
    difficulty: "Medium",
    text: "Cache memory works on the principle of:",
    options: [
      { id: "A", text: "Locality of Data" },
      { id: "B", text: "Locality of Memory" },
      { id: "C", text: "Locality of Reference" },
      { id: "D", text: "Locality of Space" }
    ],
    correctOptionId: "C",
    explanation: "Cache memory operates on the principle of Locality of Reference. This includes spatial locality (accessing data near recently accessed data) and temporal locality (re-accessing recently accessed data)."
  }
];
