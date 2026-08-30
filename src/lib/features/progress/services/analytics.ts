import type { QuestionAttempt } from '$lib/infrastructure/storage/db.types';

export type PerformanceStatus = 'Strong' | 'Good' | 'Needs Practice' | 'Needs Attention' | 'Not Enough Data';

export interface BaseStats {
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number; // 0-100
  status: PerformanceStatus;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    difference: number; // absolute percentage difference
  };
}

export interface SubjectStats extends BaseStats {
  subjectId: string;
}

export interface ConceptStats extends BaseStats {
  subjectId: string;
  topicId: string;
}

export const MIN_ATTEMPTS_FOR_SIGNAL = 5;

/**
 * Classify performance based on accuracy and sample size.
 */
export function classifyPerformance(accuracy: number, totalAttempts: number): PerformanceStatus {
  if (totalAttempts < MIN_ATTEMPTS_FOR_SIGNAL) {
    return 'Not Enough Data';
  }
  
  if (accuracy < 50) return 'Needs Attention';
  if (accuracy < 70) return 'Needs Practice';
  if (accuracy < 85) return 'Good';
  return 'Strong';
}

/**
 * Calculate trend by splitting attempts into an older half and a recent half.
 * Requires at least 10 attempts to be meaningful (5 older, 5 recent).
 */
export function calculateTrend(attempts: QuestionAttempt[]): BaseStats['trend'] | undefined {
  if (attempts.length < MIN_ATTEMPTS_FOR_SIGNAL * 2) {
    return undefined;
  }

  // Sort by attemptedAt ascending (oldest first)
  const sorted = [...attempts].sort((a, b) => 
    new Date(a.attemptedAt).getTime() - new Date(b.attemptedAt).getTime()
  );

  const mid = Math.floor(sorted.length / 2);
  const older = sorted.slice(0, mid);
  const recent = sorted.slice(mid);

  const oldAccuracy = older.length > 0 ? (older.filter(a => a.isCorrect).length / older.length) * 100 : 0;
  const recentAccuracy = recent.length > 0 ? (recent.filter(a => a.isCorrect).length / recent.length) * 100 : 0;

  const diff = recentAccuracy - oldAccuracy;
  
  // Consider a difference of less than 5% as stable
  if (Math.abs(diff) < 5) {
    return { direction: 'stable', difference: Math.abs(diff) };
  }

  return {
    direction: diff > 0 ? 'up' : 'down',
    difference: Math.abs(diff)
  };
}

/**
 * Calculate basic stats for an array of attempts.
 */
function calculateBaseStats(attempts: QuestionAttempt[]): BaseStats {
  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter(a => a.isCorrect).length;
  const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
  
  return {
    totalAttempts,
    correctAttempts,
    accuracy,
    status: classifyPerformance(accuracy, totalAttempts),
    trend: calculateTrend(attempts)
  };
}

/**
 * Aggregate attempts by subject.
 */
export function aggregateBySubject(attempts: QuestionAttempt[]): SubjectStats[] {
  const bySubject: Record<string, QuestionAttempt[]> = {};
  
  for (const attempt of attempts) {
    if (!attempt.subjectId) continue;
    if (!bySubject[attempt.subjectId]) {
      bySubject[attempt.subjectId] = [];
    }
    bySubject[attempt.subjectId].push(attempt);
  }

  return Object.entries(bySubject).map(([subjectId, subjAttempts]) => ({
    subjectId,
    ...calculateBaseStats(subjAttempts)
  }));
}

/**
 * Aggregate attempts by concept (topic).
 */
export function aggregateByConcept(attempts: QuestionAttempt[]): ConceptStats[] {
  const byConcept: Record<string, QuestionAttempt[]> = {};
  
  for (const attempt of attempts) {
    if (!attempt.subjectId || !attempt.topicId) continue;
    
    // Create a composite key to group topics under their subjects
    const key = `${attempt.subjectId}::${attempt.topicId}`;
    if (!byConcept[key]) {
      byConcept[key] = [];
    }
    byConcept[key].push(attempt);
  }

  return Object.entries(byConcept).map(([key, conceptAttempts]) => {
    const [subjectId, topicId] = key.split('::');
    return {
      subjectId,
      topicId,
      ...calculateBaseStats(conceptAttempts)
    };
  });
}

/**
 * Generate a ranked list of concepts that need attention or practice.
 */
export function getRecommendedPractice(conceptStats: ConceptStats[]): ConceptStats[] {
  return conceptStats
    .filter(c => c.status === 'Needs Attention' || c.status === 'Needs Practice')
    .sort((a, b) => {
      // Primary sort: needs attention first
      if (a.status === 'Needs Attention' && b.status !== 'Needs Attention') return -1;
      if (a.status !== 'Needs Attention' && b.status === 'Needs Attention') return 1;
      
      // Secondary sort: lower accuracy first
      if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy;
      
      // Tertiary sort: higher attempt count (more confident weakness) first
      return b.totalAttempts - a.totalAttempts;
    });
}

/**
 * Generate a ranked list of strong concepts.
 */
export function getStrongConcepts(conceptStats: ConceptStats[]): ConceptStats[] {
  return conceptStats
    .filter(c => c.status === 'Strong' || c.status === 'Good')
    .sort((a, b) => {
      // Primary sort: higher accuracy first
      if (a.accuracy !== b.accuracy) return b.accuracy - a.accuracy;
      
      // Secondary sort: higher attempt count first
      return b.totalAttempts - a.totalAttempts;
    });
}
