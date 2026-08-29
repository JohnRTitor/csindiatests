export interface Preference {
  key: string;
  value: string;
  updated_at: string;
}

export type TestSessionStatus = 'in_progress' | 'completed' | 'abandoned' | 'expired';

export interface TestSession {
  id: string;
  exam_id: string;
  title: string;
  mode: string;
  started_at: string;
  completed_at: string | null;
  duration_seconds: number | null;
  total_questions: number;
  answered_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  skipped_questions: number;
  score: number;
  percentage: number;
  status: TestSessionStatus;
  metadata: string | null;
}

export interface TestAnswer {
  id: string;
  test_session_id: string;
  question_id: string;
  selected_answer: string | null;
  correct_answer: string;
  is_correct: number | null; // 0 or 1, or null if unassessed
  answered_at: string | null;
  time_spent_seconds: number;
  marked_for_review: number; // 0 or 1
  explanation_seen: number; // 0 or 1
  metadata: string | null;
}

export interface QuestionProgress {
  question_id: string;
  attempts: number;
  correct_attempts: number;
  incorrect_attempts: number;
  last_answered_at: string | null;
  last_result: number | null; // 0 or 1
  best_time_seconds: number | null;
  total_time_seconds: number;
  marked_for_review: number; // 0 or 1
  confidence: number;
  metadata: string | null;
}

export interface UserStats {
  id: number;
  questions_attempted: number;
  questions_correct: number;
  questions_incorrect: number;
  tests_started: number;
  tests_completed: number;
  total_study_seconds: number;
  current_streak: number;
  longest_streak: number;
  last_activity_at: string | null;
  updated_at: string;
}

export interface WorkerRequest {
  id: string;
  action: string;
  payload?: unknown;
}

export interface WorkerResponse {
  id: string;
  ok: boolean;
  data?: unknown;
  error?: {
    message: string;
    code: string;
  };
}

export interface RecordAnswerPayload {
  answer: TestAnswer;
  // Options for updating related records
  updateSession?: boolean;
  updateProgress?: boolean;
  updateStats?: boolean;
}

export interface ListTestSessionsOptions {
  limit?: number;
  offset?: number;
  status?: TestSessionStatus;
  orderBy?: string; // e.g. "started_at DESC"
}
