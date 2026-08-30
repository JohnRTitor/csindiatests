export interface PyqSource {
  file?: string;
  files?: string[];
  page?: number;
  pages?: number[];
  type?: string; // e.g. "answer-key" or "solution"
}

export type RichContent = 
  | { type: "text"; value: string }
  | { type: "math"; value: string; display?: boolean }
  | { type: "code"; language: string; value: string }
  | { type: "image"; path: string; sourcePage?: number };

export interface PyqQuestion {
  id: string;
  questionNumber: number;
  type: "single_choice" | "multiple_choice" | "numerical" | "descriptive";
  
  content: RichContent[]; 
  
  options: {
    id: string;
    content: RichContent[];
  }[];
  
  answer: string | null;
  explanation: RichContent[] | null;

  answerSource?: PyqSource | null;
  explanationSource?: PyqSource | null;
  
  subjectId?: string | null;
  topicId?: string | null;
  
  assets: any[];
  source: any;
  extraction: any;
  classification: {
    subjectConfidence: string;
    topicConfidence: string;
    reviewRequired: boolean;
  };
}

export interface PyqPaperMetadata {
  year: number;
  session: string;
  paperNumber: number | string;
  paperName: string;
  shift: string;
  title: string;
  questionCount: number;
}

export interface PyqDataset {
  schemaVersion: string;
  id: string;
  examId: string;
  metadata: PyqPaperMetadata;
  source: {
    files: string[];
    pageCount: number;
    answerKeyDetected?: boolean;
    answerKeyPages?: number[];
    solutionsDetected?: boolean;
    solutionPages?: number[];
  };
  extraction: any;
  questions: PyqQuestion[];
}

export interface PyqPaperManifest {
  year: number;
  paper: string;
  shift: string;
  slug?: string;
  questionCount: number;
  file: string;
  title: string;
}
