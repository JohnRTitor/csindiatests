import type { Question } from "$lib/features/exams/types";

export const mockQuestions: Question[] = [
  {
    id: "q1",
    subjectId: "os",
    topic: "CPU Scheduling",
    difficulty: "Medium",
    text: "Which of the following scheduling algorithms can result in starvation?",
    options: [
      { id: "A", text: "First-Come, First-Served (FCFS)" },
      { id: "B", text: "Shortest Job First (SJF)" },
      { id: "C", text: "Round Robin (RR)" },
      { id: "D", text: "Both B and Priority Scheduling" }
    ],
    correctOptionId: "D",
    explanation: "Priority scheduling and Shortest Job First (SJF) can lead to starvation. In Priority scheduling, low-priority processes may wait indefinitely if higher-priority processes keep arriving. SJF can cause starvation for longer processes if short processes continue to arrive. Round Robin and FCFS are starvation-free."
  },
  {
    id: "q2",
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
    id: "q3",
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
    id: "q4",
    subjectId: "algo",
    topic: "Graph Algorithms",
    difficulty: "Medium",
    text: "Dijkstra's algorithm is not guaranteed to work correctly if the graph contains:",
    options: [
      { id: "A", text: "Cycles" },
      { id: "B", text: "Negative weight edges" },
      { id: "C", text: "Multiple connected components" },
      { id: "D", text: "Self-loops" }
    ],
    correctOptionId: "B",
    explanation: "Dijkstra's algorithm assumes that edge weights are non-negative. If a graph contains negative weight edges, it might prematurely mark a node as having its shortest path found, leading to incorrect results. Bellman-Ford should be used for graphs with negative weights."
  },
  {
    id: "q5",
    subjectId: "p-ds",
    topic: "Data Structures",
    difficulty: "Easy",
    text: "What is the time complexity of pushing an element onto a stack implemented using an array?",
    options: [
      { id: "A", text: "O(1)" },
      { id: "B", text: "O(log n)" },
      { id: "C", text: "O(n)" },
      { id: "D", text: "O(n log n)" }
    ],
    correctOptionId: "A",
    explanation: "Pushing an element onto an array-based stack takes constant time, O(1), because the element is simply placed at the index indicated by the top pointer, and the top pointer is incremented. (Amortized O(1) if dynamic resizing is considered)."
  },
  {
    id: "q6",
    subjectId: "cd",
    topic: "Parsing",
    difficulty: "Hard",
    text: "Which of the following is true regarding LL(1) grammars?",
    options: [
      { id: "A", text: "They can be ambiguous." },
      { id: "B", text: "They can contain left recursion." },
      { id: "C", text: "They must not be left-factored." },
      { id: "D", text: "They parse input from left to right, constructing a leftmost derivation." }
    ],
    correctOptionId: "D",
    explanation: "LL(1) parsers read the input from Left to right, and construct a Leftmost derivation using 1 lookahead symbol. An LL(1) grammar cannot be ambiguous, cannot have left recursion, and must be left-factored to avoid predictive parsing conflicts."
  },
  {
    id: "q7",
    subjectId: "ca",
    topic: "Cache Memory",
    difficulty: "Medium",
    text: "If the hit ratio is 0.8, the cache access time is 10 ns, and the main memory access time is 100 ns, what is the average memory access time (AMAT)?",
    options: [
      { id: "A", text: "28 ns" },
      { id: "B", text: "30 ns" },
      { id: "C", text: "90 ns" },
      { id: "D", text: "18 ns" }
    ],
    correctOptionId: "B",
    explanation: "AMAT = Hit Time + (Miss Rate × Miss Penalty)\nHere, Hit Time = 10 ns\nMiss Rate = 1 - Hit Ratio = 1 - 0.8 = 0.2\nMiss Penalty = Main Memory Access Time = 100 ns\nAMAT = 10 + (0.2 × 100) = 10 + 20 = 30 ns."
  }
];
