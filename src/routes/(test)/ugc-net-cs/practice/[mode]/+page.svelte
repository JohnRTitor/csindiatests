<script lang="ts">
  import SEO from "$lib/components/SEO.svelte";
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { ugcNetConfig } from "$lib/features/exams/config/ugc-net-cs";
  import type { QuizMode } from "$lib/features/quiz/types";
  import type { Question } from "$lib/features/exams/types";
  import type { TestSession } from "$lib/infrastructure/storage/db.types";
  import QuizShell from "$lib/features/quiz/components/QuizShell.svelte";
  import SessionConflictDialog from "$lib/features/tests/components/session-conflict-dialog.svelte";
  import { testHistoryRepo } from "$lib/features/tests/repositories/test-history";
  import { sessionManager } from "$lib/features/tests/services/session-manager";
  import type { TestContext } from "$lib/features/tests/types";
  import { pyqService } from "$lib/features/pyq/services/pyq-service";

  // Derive mode and count from route params and config
  let modeParam = $derived(page.params.mode);
  
  // Map mode param to quiz mode and question count
  let modeData = $derived(() => {
    switch(modeParam) {
      case 'quick': return { mode: 'practice' as QuizMode, count: 10 };
      case 'focused': return { mode: 'practice' as QuizMode, count: 25 };
      case 'full': return { mode: 'practice' as QuizMode, count: 50 };
      default: return null;
    }
  });

  let sessionId = $derived(page.url.searchParams.get('session'));
  let selectedQuestions = $state<Question[]>([]);
  let isLoading = $state(true);
  
  let currentContext = $derived<TestContext>({
    examId: "ugc-net-cs",
    testType: "practice",
    scope: "mixed",
    title: "UGC NET Practice"
  });
  
  let conflictSession = $state<TestSession | null>(null);
  let showConflict = $state(false);

  import { settingsState } from "$lib/features/preferences";
  import { questionAttemptsRepo } from "$lib/features/progress/repositories/question-attempts";

  async function loadQuestions(id: string | null) {
    const data = modeData();
    if (!data) return;

    if (id) {
      // Resume existing session
      const session = await testHistoryRepo.get(id);
      if (session && session.questionIds) {
        selectedQuestions = await pyqService.getQuestionsByIds("ugc-net-cs", session.questionIds);
      } else {
        // Fallback if invalid
        selectedQuestions = await pyqService.getRandomQuestions("ugc-net-cs", data.count);
      }
    } else {
      // New session: generate questions
      if (settingsState.values.reviewIncorrect) {
        const attempts = await questionAttemptsRepo.getForExam("ugc-net-cs");
        // Sort by attemptedAt descending to get the latest attempt per question
        attempts.sort((a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime());
        
        const latestAttempts = new Map<string, typeof attempts[0]>();
        for (const attempt of attempts) {
          if (!latestAttempts.has(attempt.questionId)) {
            latestAttempts.set(attempt.questionId, attempt);
          }
        }
        
        const incorrectQuestionIds = Array.from(latestAttempts.values())
          .filter(a => a.isAnswered && !a.isCorrect)
          .map(a => a.questionId);
          
        if (incorrectQuestionIds.length > 0) {
          const shuffledIncorrect = incorrectQuestionIds.sort(() => 0.5 - Math.random());
          const incorrectToFetch = shuffledIncorrect.slice(0, data.count);
          
          const incorrectQuestions = await pyqService.getQuestionsByIds("ugc-net-cs", incorrectToFetch);
          
          if (incorrectQuestions.length < data.count) {
            const remaining = data.count - incorrectQuestions.length;
            const randomQuestions = await pyqService.getRandomQuestions("ugc-net-cs", remaining, undefined, incorrectToFetch);
            selectedQuestions = [...incorrectQuestions, ...randomQuestions];
          } else {
            selectedQuestions = incorrectQuestions;
          }
        } else {
          selectedQuestions = await pyqService.getRandomQuestions("ugc-net-cs", data.count);
        }
      } else {
        selectedQuestions = await pyqService.getRandomQuestions("ugc-net-cs", data.count);
      }
    }
  }

  onMount(async () => {
    const data = modeData();
    if (!data) {
      isLoading = false;
      return;
    }

    if (!sessionId) {
      const conflict = await sessionManager.findActiveSession(currentContext);
      if (conflict) {
        conflictSession = conflict;
        showConflict = true;
        isLoading = false;
        return;
      }
    }

    await loadQuestions(sessionId);
    isLoading = false;
  });

  async function handleResume() {
    if (!conflictSession) return;
    const url = new URL(page.url.href);
    url.searchParams.set('session', conflictSession.id);
    goto(url, { replaceState: true, keepFocus: true });
    
    showConflict = false;
    isLoading = true;
    await loadQuestions(conflictSession.id);
    isLoading = false;
  }

  async function handleDiscard() {
    if (!conflictSession) return;
    await testHistoryRepo.update(conflictSession.id, { status: 'abandoned' });
    showConflict = false;
    isLoading = true;
    await loadQuestions(null);
    isLoading = false;
  }

  function handleExit() {
    goto('/ugc-net-cs');
  }
</script>

<SEO title="Practice {modeParam} | UGC NET CS" />

{#if showConflict && conflictSession}
  <SessionConflictDialog 
    session={conflictSession}
    onResume={handleResume}
    onDiscard={handleDiscard}
    onCancel={handleExit}
  />
{:else if isLoading}
  <div class="min-h-screen flex items-center justify-center bg-muted/20">
    <div class="text-muted-foreground animate-pulse">Loading practice session...</div>
  </div>
{:else if modeData()}
  <QuizShell 
    examConfig={ugcNetConfig} 
    questions={selectedQuestions} 
    mode={modeData()!.mode} 
    context={currentContext}
    {sessionId}
    onExit={handleExit} 
  />
{:else}
  <div class="min-h-screen flex items-center justify-center bg-muted/20">
    <div class="text-center">
      <h1 class="text-2xl font-bold mb-4">Invalid Practice Mode</h1>
      <button class="text-primary hover:underline" onclick={() => goto('/ugc-net-cs')}>
        Return to UGC NET CS
      </button>
    </div>
  </div>
{/if}
