export const migrations = [
  {
    version: 1,
    up: `
      CREATE TABLE IF NOT EXISTS preferences (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS test_sessions (
          id TEXT PRIMARY KEY,
          exam_id TEXT NOT NULL,
          title TEXT NOT NULL,
          mode TEXT NOT NULL,
          started_at DATETIME NOT NULL,
          completed_at DATETIME,
          duration_seconds INTEGER,
          total_questions INTEGER NOT NULL,
          answered_questions INTEGER DEFAULT 0,
          correct_answers INTEGER DEFAULT 0,
          incorrect_answers INTEGER DEFAULT 0,
          skipped_questions INTEGER DEFAULT 0,
          score REAL DEFAULT 0,
          percentage REAL DEFAULT 0,
          status TEXT NOT NULL,
          metadata TEXT
      );

      CREATE TABLE IF NOT EXISTS test_answers (
          id TEXT PRIMARY KEY,
          test_session_id TEXT NOT NULL,
          question_id TEXT NOT NULL,
          selected_answer TEXT,
          correct_answer TEXT NOT NULL,
          is_correct INTEGER,
          answered_at DATETIME,
          time_spent_seconds INTEGER DEFAULT 0,
          marked_for_review INTEGER DEFAULT 0,
          explanation_seen INTEGER DEFAULT 0,
          metadata TEXT,
          UNIQUE(test_session_id, question_id),
          FOREIGN KEY(test_session_id)
              REFERENCES test_sessions(id)
              ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS question_progress (
          question_id TEXT PRIMARY KEY,
          attempts INTEGER NOT NULL DEFAULT 0,
          correct_attempts INTEGER NOT NULL DEFAULT 0,
          incorrect_attempts INTEGER NOT NULL DEFAULT 0,
          last_answered_at DATETIME,
          last_result INTEGER,
          best_time_seconds INTEGER,
          total_time_seconds INTEGER DEFAULT 0,
          marked_for_review INTEGER DEFAULT 0,
          confidence REAL DEFAULT 0,
          metadata TEXT
      );

      CREATE TABLE IF NOT EXISTS user_stats (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          questions_attempted INTEGER NOT NULL DEFAULT 0,
          questions_correct INTEGER NOT NULL DEFAULT 0,
          questions_incorrect INTEGER NOT NULL DEFAULT 0,
          tests_started INTEGER NOT NULL DEFAULT 0,
          tests_completed INTEGER NOT NULL DEFAULT 0,
          total_study_seconds INTEGER NOT NULL DEFAULT 0,
          current_streak INTEGER NOT NULL DEFAULT 0,
          longest_streak INTEGER NOT NULL DEFAULT 0,
          last_activity_at DATETIME,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Indexes for performance
      CREATE INDEX IF NOT EXISTS idx_test_sessions_started_at ON test_sessions(started_at);
      CREATE INDEX IF NOT EXISTS idx_test_sessions_status ON test_sessions(status);
      CREATE INDEX IF NOT EXISTS idx_test_answers_session ON test_answers(test_session_id);
      CREATE INDEX IF NOT EXISTS idx_test_answers_question ON test_answers(question_id);
      CREATE INDEX IF NOT EXISTS idx_question_progress_last_answered ON question_progress(last_answered_at);

      -- Bootstrap singleton row for user_stats
      INSERT OR IGNORE INTO user_stats (id) VALUES (1);
    `
  }
];
