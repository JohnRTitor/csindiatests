import { db } from '$lib/infrastructure/storage/database';
import type { TestAnswer, TestSession } from '$lib/infrastructure/storage/db.types';
import { testHistoryRepo } from '$lib/features/tests/repositories/test-history';
import { testAnswersRepo } from '$lib/features/tests/repositories/test-answers';
import { progressRepo } from '$lib/features/progress/repositories/progress';
import { userStatsRepo } from '$lib/features/progress/repositories/user-stats';

interface RecordAnswerOptions {
  updateSession?: boolean;
  updateProgress?: boolean;
  updateStats?: boolean;
}

export const quizPersistenceService = {
  async recordAnswer(
    answer: TestAnswer, 
    options: RecordAnswerOptions = { updateSession: true, updateProgress: true, updateStats: true }
  ): Promise<void> {
    await db.transaction('rw', [db.testAnswers, db.testSessions, db.questionProgress, db.userStats], async () => {
      
      // 1. Save the answer
      await testAnswersRepo.save(answer);

      // 2. Update session if requested
      if (options.updateSession) {
        const session = await testHistoryRepo.get(answer.testSessionId);
        if (session) {
          const updates: Partial<TestSession> = {
            answeredQuestions: session.answeredQuestions + 1,
            score: answer.isCorrect ? session.score + 1 : session.score,
            lastActiveAt: answer.answeredAt || new Date().toISOString()
          };
          if (answer.isCorrect === true) {
            updates.correctAnswers = session.correctAnswers + 1;
          } else if (answer.isCorrect === false) {
            updates.incorrectAnswers = session.incorrectAnswers + 1;
          }
          
          await testHistoryRepo.update(session.id, updates);
        }
      }

      // 3. Update question progress if requested
      if (options.updateProgress) {
        const progress = await progressRepo.get(answer.questionId) || {
          questionId: answer.questionId,
          attempts: 0,
          correctAttempts: 0,
          incorrectAttempts: 0,
          lastAnsweredAt: null,
          lastResult: null,
          bestTimeSeconds: null,
          totalTimeSeconds: 0,
          markedForReview: false,
          confidence: 0,
          metadata: null
        };

        progress.attempts += 1;
        if (answer.isCorrect === true) {
          progress.correctAttempts += 1;
          if (progress.bestTimeSeconds === null || answer.timeSpentSeconds < progress.bestTimeSeconds) {
            progress.bestTimeSeconds = answer.timeSpentSeconds;
          }
        } else if (answer.isCorrect === false) {
          progress.incorrectAttempts += 1;
        }

        progress.lastAnsweredAt = answer.answeredAt;
        progress.lastResult = answer.isCorrect;
        progress.totalTimeSeconds += answer.timeSpentSeconds;
        progress.markedForReview = answer.markedForReview;

        await progressRepo.upsert(progress);
      }

      // 4. Update user stats if requested
      if (options.updateStats && answer.isCorrect !== null) {
        const stats = await userStatsRepo.get();
        await userStatsRepo.update({
          questionsAttempted: stats.questionsAttempted + 1,
          questionsCorrect: answer.isCorrect ? stats.questionsCorrect + 1 : stats.questionsCorrect,
          questionsIncorrect: !answer.isCorrect ? stats.questionsIncorrect + 1 : stats.questionsIncorrect,
          lastActivityAt: new Date().toISOString()
        });
      }
    });
  }
};
