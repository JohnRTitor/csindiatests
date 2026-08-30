import type { MatchInfo } from 'minisearch';

export interface SearchResult {
  id: string;
  year: number;
  session: string;
  paper: number;
  shift: string;
  subjectId: string;
  topicId: string;
  questionNumber: number;
  subject: string;
  topic: string;
  question: string;
  
  // MiniSearch specific fields returned on search
  score: number;
  match: MatchInfo;
  terms: string[];
}
