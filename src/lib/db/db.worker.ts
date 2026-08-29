import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
import { migrations } from './db.schema.js';
import { ErrorCodes } from './db.errors.js';
import type { TestSession, TestAnswer, QuestionProgress, UserStats, RecordAnswerPayload, ListTestSessionsOptions } from './db.types.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any = null;
let initPromise: Promise<void> | null = null;
let initStatus: 'UNINITIALIZED' | 'INITIALIZING' | 'READY' | 'FAILED' = 'UNINITIALIZED';

// Helpers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowsToObjects(columns: string[], values: any[][]): Record<string, any>[] {
  return values.map(row => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj: Record<string, any> = {};
    columns.forEach((col, idx) => {
      obj[col] = row[idx];
    });
    return obj;
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deserializePreferenceValue(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    return text; // Fallback if somehow not JSON
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializePreferenceValue(value: any): string {
  return JSON.stringify(value);
}

// Initialization using SAH Pool VFS (no sub-worker needed, uses OPFS sync access handles directly)
async function initializeDB(): Promise<void> {
  if (initStatus === 'READY') return;
  if (initStatus === 'FAILED') throw new Error(ErrorCodes.INIT_FAILED);

  if (initStatus === 'INITIALIZING' && initPromise) {
    return initPromise;
  }

  initStatus = 'INITIALIZING';

  initPromise = (async () => {
    try {
      const sqlite3 = await sqlite3InitModule();

      // Use the SAH Pool VFS — it provides OPFS-backed persistent storage
      // without needing a separate async proxy sub-worker.
      // This is the recommended approach for bundler-based setups (Vite, Webpack, etc.)
      if (!sqlite3.installOpfsSAHPoolVfs) {
        throw new Error(ErrorCodes.OPFS_UNAVAILABLE);
      }

      const poolUtil = await sqlite3.installOpfsSAHPoolVfs({});
      const PoolDb = poolUtil.OpfsSAHPoolDb;

      db = new PoolDb('/csnetschool.sqlite3');

      db.exec('PRAGMA foreign_keys = ON;');

      // Run migrations
      let currentVersion = 0;
      db.exec({
        sql: 'PRAGMA user_version;',
        callback: (row: number[]) => {
          currentVersion = row[0];
        }
      });

      for (const migration of migrations) {
        if (migration.version > currentVersion) {
          db.exec('BEGIN TRANSACTION;');
          try {
            // Split multi-statement SQL and execute each statement
            const statements = migration.up
              .split(';')
              .map((s: string) => s.trim())
              .filter((s: string) => s.length > 0);

            for (const stmt of statements) {
              db.exec(stmt + ';');
            }

            db.exec(`PRAGMA user_version = ${migration.version};`);
            db.exec('COMMIT;');
          } catch (migrationError) {
            db.exec('ROLLBACK;');
            throw migrationError;
          }
        }
      }

      initStatus = 'READY';
    } catch (error) {
      initStatus = 'FAILED';
      console.error('SQLite initialization failed:', error);
      throw error;
    }
  })();

  return initPromise;
}

// Message Handler
self.onmessage = async (event: MessageEvent) => {
  const { id, action, payload } = event.data;

  if (!id || !action) {
    self.postMessage({ id: id || 'unknown', ok: false, error: { code: ErrorCodes.INVALID_PAYLOAD, message: 'Missing id or action' } });
    return;
  }

  try {
    if (action === 'init') {
      await initializeDB();
      self.postMessage({ id, ok: true });
      return;
    }

    // Ensure DB is ready for all other actions
    await initializeDB();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any = null;

    switch (action) {
      case 'getPreferences': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rows: any[][] = [];
        const cols: string[] = [];
        db.exec({
          sql: 'SELECT key, value FROM preferences',
          columnNames: cols,
          resultRows: rows
        });

        const prefs = rowsToObjects(cols, rows);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        result = {} as Record<string, any>;
        for (const pref of prefs) {
          result[pref.key] = deserializePreferenceValue(pref.value);
        }
        break;
      }

      case 'getPreference': {
        const { key } = payload;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rows: any[][] = [];
        const cols: string[] = [];
        db.exec({
          sql: 'SELECT value FROM preferences WHERE key = ?',
          bind: [key],
          columnNames: cols,
          resultRows: rows
        });

        if (rows.length > 0) {
          result = deserializePreferenceValue(rows[0][0]);
        }
        break;
      }

      case 'setPreference': {
        const { key, value } = payload;
        const strValue = serializePreferenceValue(value);
        db.exec({
          sql: `INSERT INTO preferences (key, value, updated_at)
                VALUES (?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(key) DO UPDATE SET
                  value = excluded.value,
                  updated_at = CURRENT_TIMESTAMP`,
          bind: [key, strValue]
        });
        result = true;
        break;
      }

      case 'setPreferences': {
        const values = payload;
        db.exec('BEGIN TRANSACTION;');
        try {
          for (const [key, value] of Object.entries(values)) {
            const strValue = serializePreferenceValue(value);
            db.exec({
              sql: `INSERT INTO preferences (key, value, updated_at)
                    VALUES (?, ?, CURRENT_TIMESTAMP)
                    ON CONFLICT(key) DO UPDATE SET
                      value = excluded.value,
                      updated_at = CURRENT_TIMESTAMP`,
              bind: [key, strValue]
            });
          }
          db.exec('COMMIT;');
        } catch (e) {
          db.exec('ROLLBACK;');
          throw e;
        }
        result = true;
        break;
      }

      case 'deletePreference': {
        const { key } = payload;
        db.exec({
          sql: 'DELETE FROM preferences WHERE key = ?',
          bind: [key]
        });
        result = true;
        break;
      }

      case 'createTestSession': {
        const session = payload as Omit<TestSession, 'id'>;
        const sessionId = crypto.randomUUID();
        db.exec({
          sql: `INSERT INTO test_sessions (
                  id, exam_id, title, mode, started_at, total_questions, status, metadata
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          bind: [
            sessionId, session.exam_id, session.title, session.mode, session.started_at,
            session.total_questions, session.status, session.metadata ? JSON.stringify(session.metadata) : null
          ]
        });
        result = sessionId;
        break;
      }

      case 'updateTestSession': {
        const { id: updateId, updates } = payload;
        const sets: string[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bind: any[] = [];

        for (const [k, v] of Object.entries(updates)) {
          sets.push(`${k} = ?`);
          bind.push(k === 'metadata' && v !== null ? JSON.stringify(v) : v);
        }

        if (sets.length > 0) {
          bind.push(updateId);
          db.exec({
            sql: `UPDATE test_sessions SET ${sets.join(', ')} WHERE id = ?`,
            bind
          });
        }
        result = true;
        break;
      }

      case 'getTestSession': {
        const { id: sessionId } = payload;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rows: any[][] = [];
        const cols: string[] = [];
        db.exec({
          sql: 'SELECT * FROM test_sessions WHERE id = ?',
          bind: [sessionId],
          columnNames: cols,
          resultRows: rows
        });

        if (rows.length > 0) {
          result = rowsToObjects(cols, rows)[0];
          if (result.metadata) result.metadata = JSON.parse(result.metadata);
        }
        break;
      }

      case 'listTestSessions': {
        const options = payload as ListTestSessionsOptions;
        let sql = 'SELECT * FROM test_sessions';
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bind: any[] = [];

        if (options?.status) {
          sql += ' WHERE status = ?';
          bind.push(options.status);
        }

        // Only allow known column names for ordering
        const allowedOrderBy = ['started_at', 'completed_at', 'score', 'percentage'];
        if (options?.orderBy) {
          const parts = options.orderBy.split(' ');
          if (allowedOrderBy.includes(parts[0])) {
            sql += ` ORDER BY ${parts[0]} ${parts[1] === 'ASC' ? 'ASC' : 'DESC'}`;
          } else {
            sql += ` ORDER BY started_at DESC`;
          }
        } else {
          sql += ` ORDER BY started_at DESC`;
        }

        if (options?.limit) {
          sql += ' LIMIT ?';
          bind.push(options.limit);

          if (options?.offset) {
            sql += ' OFFSET ?';
            bind.push(options.offset);
          }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rows: any[][] = [];
        const cols: string[] = [];
        db.exec({ sql, bind, columnNames: cols, resultRows: rows });

        result = rowsToObjects(cols, rows).map(r => {
          if (r.metadata) r.metadata = JSON.parse(r.metadata);
          return r;
        });
        break;
      }

      case 'listInProgressTests': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rows: any[][] = [];
        const cols: string[] = [];
        db.exec({
          sql: 'SELECT * FROM test_sessions WHERE status = ? ORDER BY started_at DESC',
          bind: ['in_progress'],
          columnNames: cols,
          resultRows: rows
        });

        result = rowsToObjects(cols, rows).map(r => {
          if (r.metadata) r.metadata = JSON.parse(r.metadata);
          return r;
        });
        break;
      }

      case 'saveTestAnswer': {
        const answer = payload as TestAnswer;
        db.exec({
          sql: `INSERT INTO test_answers (
                  id, test_session_id, question_id, selected_answer, correct_answer,
                  is_correct, answered_at, time_spent_seconds, marked_for_review,
                  explanation_seen, metadata
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(test_session_id, question_id) DO UPDATE SET
                  selected_answer = excluded.selected_answer,
                  is_correct = excluded.is_correct,
                  answered_at = excluded.answered_at,
                  time_spent_seconds = test_answers.time_spent_seconds + excluded.time_spent_seconds,
                  marked_for_review = excluded.marked_for_review,
                  explanation_seen = excluded.explanation_seen,
                  metadata = excluded.metadata`,
          bind: [
            answer.id, answer.test_session_id, answer.question_id, answer.selected_answer, answer.correct_answer,
            answer.is_correct, answer.answered_at, answer.time_spent_seconds, answer.marked_for_review,
            answer.explanation_seen, answer.metadata ? JSON.stringify(answer.metadata) : null
          ]
        });
        result = true;
        break;
      }

      case 'getTestAnswers': {
        const { testSessionId } = payload;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rows: any[][] = [];
        const cols: string[] = [];
        db.exec({
          sql: 'SELECT * FROM test_answers WHERE test_session_id = ?',
          bind: [testSessionId],
          columnNames: cols,
          resultRows: rows
        });

        result = rowsToObjects(cols, rows).map(r => {
          if (r.metadata) r.metadata = JSON.parse(r.metadata);
          return r;
        });
        break;
      }

      case 'getQuestionProgress': {
        const { questionId } = payload;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rows: any[][] = [];
        const cols: string[] = [];
        db.exec({
          sql: 'SELECT * FROM question_progress WHERE question_id = ?',
          bind: [questionId],
          columnNames: cols,
          resultRows: rows
        });

        if (rows.length > 0) {
          result = rowsToObjects(cols, rows)[0];
          if (result.metadata) result.metadata = JSON.parse(result.metadata);
        }
        break;
      }

      case 'upsertQuestionProgress': {
        const progress = payload as QuestionProgress;
        db.exec({
          sql: `INSERT INTO question_progress (
                  question_id, attempts, correct_attempts, incorrect_attempts,
                  last_answered_at, last_result, best_time_seconds, total_time_seconds,
                  marked_for_review, confidence, metadata
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(question_id) DO UPDATE SET
                  attempts = question_progress.attempts + 1,
                  correct_attempts = question_progress.correct_attempts + excluded.correct_attempts,
                  incorrect_attempts = question_progress.incorrect_attempts + excluded.incorrect_attempts,
                  last_answered_at = excluded.last_answered_at,
                  last_result = excluded.last_result,
                  best_time_seconds = CASE
                    WHEN excluded.best_time_seconds IS NOT NULL AND (question_progress.best_time_seconds IS NULL OR excluded.best_time_seconds < question_progress.best_time_seconds)
                    THEN excluded.best_time_seconds
                    ELSE question_progress.best_time_seconds
                  END,
                  total_time_seconds = question_progress.total_time_seconds + excluded.total_time_seconds,
                  marked_for_review = excluded.marked_for_review,
                  confidence = excluded.confidence,
                  metadata = excluded.metadata`,
          bind: [
            progress.question_id, progress.attempts, progress.correct_attempts, progress.incorrect_attempts,
            progress.last_answered_at, progress.last_result, progress.best_time_seconds, progress.total_time_seconds,
            progress.marked_for_review, progress.confidence, progress.metadata ? JSON.stringify(progress.metadata) : null
          ]
        });
        result = true;
        break;
      }

      case 'getUserStats': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rows: any[][] = [];
        const cols: string[] = [];
        db.exec({
          sql: 'SELECT * FROM user_stats WHERE id = 1',
          columnNames: cols,
          resultRows: rows
        });

        if (rows.length > 0) {
          result = rowsToObjects(cols, rows)[0];
        } else {
          result = null;
        }
        break;
      }

      case 'updateUserStats': {
        const updates = payload as Partial<UserStats>;
        const sets: string[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bind: any[] = [];

        for (const [k, v] of Object.entries(updates)) {
          if (k === 'id' || k === 'updated_at') continue;
          sets.push(`${k} = ?`);
          bind.push(v);
        }

        if (sets.length > 0) {
          sets.push('updated_at = CURRENT_TIMESTAMP');
          db.exec({
            sql: `UPDATE user_stats SET ${sets.join(', ')} WHERE id = 1`,
            bind
          });
        }
        result = true;
        break;
      }

      case 'recordAnswer': {
        const { answer, updateSession, updateProgress, updateStats } = payload as RecordAnswerPayload;

        db.exec('BEGIN TRANSACTION;');
        try {
          // 1. Save answer
          db.exec({
            sql: `INSERT INTO test_answers (
                    id, test_session_id, question_id, selected_answer, correct_answer,
                    is_correct, answered_at, time_spent_seconds, marked_for_review,
                    explanation_seen, metadata
                  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                  ON CONFLICT(test_session_id, question_id) DO UPDATE SET
                    selected_answer = excluded.selected_answer,
                    is_correct = excluded.is_correct,
                    answered_at = excluded.answered_at,
                    time_spent_seconds = test_answers.time_spent_seconds + excluded.time_spent_seconds,
                    marked_for_review = excluded.marked_for_review,
                    explanation_seen = excluded.explanation_seen,
                    metadata = excluded.metadata`,
            bind: [
              answer.id, answer.test_session_id, answer.question_id, answer.selected_answer, answer.correct_answer,
              answer.is_correct, answer.answered_at, answer.time_spent_seconds, answer.marked_for_review,
              answer.explanation_seen, answer.metadata ? JSON.stringify(answer.metadata) : null
            ]
          });

          // 2. Update Session if requested
          if (updateSession) {
            db.exec({
              sql: `UPDATE test_sessions SET
                      answered_questions = answered_questions + 1,
                      correct_answers = correct_answers + ?,
                      incorrect_answers = incorrect_answers + ?
                    WHERE id = ?`,
              bind: [
                answer.is_correct === 1 ? 1 : 0,
                answer.is_correct === 0 ? 1 : 0,
                answer.test_session_id
              ]
            });
          }

          // 3. Update Progress if requested
          if (updateProgress) {
            db.exec({
              sql: `INSERT INTO question_progress (
                      question_id, attempts, correct_attempts, incorrect_attempts,
                      last_answered_at, last_result, best_time_seconds, total_time_seconds,
                      marked_for_review, confidence
                    ) VALUES (?, 1, ?, ?, ?, ?, ?, ?, ?, 0)
                    ON CONFLICT(question_id) DO UPDATE SET
                      attempts = question_progress.attempts + 1,
                      correct_attempts = question_progress.correct_attempts + excluded.correct_attempts,
                      incorrect_attempts = question_progress.incorrect_attempts + excluded.incorrect_attempts,
                      last_answered_at = excluded.last_answered_at,
                      last_result = excluded.last_result,
                      best_time_seconds = CASE
                        WHEN excluded.best_time_seconds IS NOT NULL AND (question_progress.best_time_seconds IS NULL OR excluded.best_time_seconds < question_progress.best_time_seconds)
                        THEN excluded.best_time_seconds
                        ELSE question_progress.best_time_seconds
                      END,
                      total_time_seconds = question_progress.total_time_seconds + excluded.total_time_seconds,
                      marked_for_review = excluded.marked_for_review`,
              bind: [
                answer.question_id,
                answer.is_correct === 1 ? 1 : 0,
                answer.is_correct === 0 ? 1 : 0,
                answer.answered_at,
                answer.is_correct,
                answer.is_correct === 1 ? answer.time_spent_seconds : null,
                answer.time_spent_seconds,
                answer.marked_for_review
              ]
            });
          }

          // 4. Update Stats if requested
          if (updateStats) {
            db.exec({
              sql: `UPDATE user_stats SET
                      questions_attempted = questions_attempted + 1,
                      questions_correct = questions_correct + ?,
                      questions_incorrect = questions_incorrect + ?,
                      total_study_seconds = total_study_seconds + ?,
                      last_activity_at = ?,
                      updated_at = CURRENT_TIMESTAMP
                    WHERE id = 1`,
              bind: [
                answer.is_correct === 1 ? 1 : 0,
                answer.is_correct === 0 ? 1 : 0,
                answer.time_spent_seconds,
                answer.answered_at
              ]
            });
          }

          db.exec('COMMIT;');
        } catch (e) {
          db.exec('ROLLBACK;');
          throw e;
        }
        result = true;
        break;
      }

      default:
        throw new Error(ErrorCodes.INVALID_ACTION);
    }

    self.postMessage({ id, ok: true, data: result });
  } catch (error: unknown) {
    const err = error as Error;
    let errorCode: string = ErrorCodes.UNKNOWN;
    if (err.message && err.message in ErrorCodes) {
      errorCode = err.message;
    } else if (err.message?.includes('SQLITE_')) {
      errorCode = ErrorCodes.QUERY_ERROR;
    }

    self.postMessage({
      id,
      ok: false,
      error: { code: errorCode, message: err.message || 'Unknown error' }
    });
  }
};
