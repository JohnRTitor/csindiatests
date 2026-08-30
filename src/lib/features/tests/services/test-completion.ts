import { testHistoryRepo } from '$lib/features/tests/repositories/test-history';
import { questionAttemptsRepo } from '$lib/features/progress/repositories/question-attempts';
import type { QuestionAttempt } from '$lib/infrastructure/storage/db.types';
import type { Question } from '$lib/features/exams/types';

export const testCompletionService = {
  async completeTest(
    sessionId: string,
    questions: Question[],
    answers: Record<string, string>,
    score: number,
    startTime: number,
    testType: string,
    examId?: string
  ): Promise<void> {
    try {
      // 1. Update Test History
      const duration = Math.floor((Date.now() - startTime) / 1000);
      const percentage = questions.length > 0 ? (score / questions.length) * 100 : 0;
      
      await testHistoryRepo.update(sessionId, {
        status: 'completed',
        completedAt: new Date().toISOString(),
        durationSeconds: duration,
        score,
        percentage
      });

      // 2. Determine if attempts already exist to avoid duplication
      const existingAttempts = await questionAttemptsRepo.getForSession(sessionId);
      if (existingAttempts.length > 0) {
        // Attempts already recorded (e.g. from a prior completion of the same session)
        return;
      }

      // 3. Save Question Attempts
      const attemptedAt = new Date().toISOString();
      const attemptsToSave: QuestionAttempt[] = questions.map((q) => {
        const selectedAnswerId = answers[q.id];
        const isAnswered = selectedAnswerId !== undefined && selectedAnswerId !== null;
        const isCorrect = isAnswered && selectedAnswerId === q.correctOptionId;

        return {
          id: `${sessionId}_${q.id}`, // composite ID ensures idempotency
          sessionId,
          questionId: q.id,
          testType,
          examId: q.examId || examId,
          subjectId: q.subjectId,
          topicId: q.topic,
          isCorrect,
          isAnswered,
          attemptedAt
        };
      });

      // Only save if there are questions (e.g., handles empty states)
      if (attemptsToSave.length > 0) {
        await questionAttemptsRepo.bulkSave(attemptsToSave);
      }
    } catch (error) {
      console.error('Failed to complete test and save analytics:', error);
      // Let the caller handle or swallow the error, but we should not fail silently if the caller expects to know.
      throw error;
    }
  }
};
