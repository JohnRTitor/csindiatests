export interface SubjectDefinition {
  id: string;
  name: string;
  shortName: string;
  description?: string;
  color?: string; // Tailwind color class or hex
}

export const UGC_NET_CS_SUBJECTS: SubjectDefinition[] = [
  { id: "discrete-structures", name: "Discrete Structures and Optimization", shortName: "Discrete Math", color: "bg-purple-900/40 text-purple-200 border-purple-500/30" },
  { id: "computer-architecture", name: "Computer System Architecture", shortName: "Architecture", color: "bg-blue-900/40 text-blue-200 border-blue-500/30" },
  { id: "programming-data-structures", name: "Programming and Data Structures", shortName: "Programming & DS", color: "bg-emerald-900/40 text-emerald-200 border-emerald-500/30" },
  { id: "algorithms", name: "Algorithms", shortName: "Algorithms", color: "bg-teal-900/40 text-teal-200 border-teal-500/30" },
  { id: "theory-of-computation", name: "Theory of Computation and Compilers", shortName: "TOC & Compilers", color: "bg-orange-900/40 text-orange-200 border-orange-500/30" },
  { id: "compiler-design", name: "Compiler Design", shortName: "Compilers", color: "bg-amber-900/40 text-amber-200 border-amber-500/30" },
  { id: "operating-systems", name: "Operating Systems", shortName: "OS", color: "bg-red-900/40 text-red-200 border-red-500/30" },
  { id: "databases", name: "Database Management Systems", shortName: "DBMS", color: "bg-cyan-900/40 text-cyan-200 border-cyan-500/30" },
  { id: "computer-networks", name: "Data Communication and Computer Networks", shortName: "Networks", color: "bg-indigo-900/40 text-indigo-200 border-indigo-500/30" },
  { id: "software-engineering", name: "Software Engineering", shortName: "Software Eng", color: "bg-pink-900/40 text-pink-200 border-pink-500/30" },
  { id: "artificial-intelligence", name: "Artificial Intelligence", shortName: "AI", color: "bg-violet-900/40 text-violet-200 border-violet-500/30" },
  { id: "other", name: "Miscellaneous", shortName: "Misc", color: "bg-gray-800 text-gray-300 border-gray-600" }
];

export function getSubjectById(id: string): SubjectDefinition | undefined {
  return UGC_NET_CS_SUBJECTS.find(s => s.id === id);
}
