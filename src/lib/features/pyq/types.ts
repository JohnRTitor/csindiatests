export interface PyqSource {
  file: string;
  page: number;
  year: number;
  paper: string; // e.g., "Paper II"
  shift: string; // e.g., "Shift 1"
}

export type RichContent = 
  | { type: "text"; value: string }
  | { type: "math"; value: string }
  | { type: "code"; language: string; value: string }
  | { type: "image"; path: string; sourcePage?: number };

export interface PyqQuestion {
  id: string;
  examId: string;
  subjectId?: string;
  topic?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  year: number;
  paper: string;
  shift: string;
  questionNumber: number;
  questionType: "mcq";
  
  content: RichContent[]; 
  
  options: {
    id: string;
    label: string;
    content: RichContent[];
  }[];
  
  answer: string | null;
  explanation: string | RichContent[] | null;
  source: PyqSource;
}

export interface PyqPaperManifest {
  year: number;
  paper: string;
  shift: string;
  questionCount: number;
  file: string;
  title: string;
}
