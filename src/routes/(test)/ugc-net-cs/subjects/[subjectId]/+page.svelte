<script lang="ts">
  import SEO from "$lib/components/SEO.svelte";
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import type { PageData } from "./$types";
  import type { TestSession } from "$lib/infrastructure/storage/db.types";
  import QuizShell from "$lib/features/quiz/components/QuizShell.svelte";
  import SessionConflictDialog from "$lib/features/tests/components/session-conflict-dialog.svelte";
  import { testHistoryRepo } from "$lib/features/tests/repositories/test-history";
  import { sessionManager } from "$lib/features/tests/services/session-manager";
  import type { TestContext } from "$lib/features/tests/types";
  import { pyqService } from "$lib/features/pyq/services/pyq-service";

  let { data }: { data: PageData } = $props();

  let sessionId = $derived(page.url.searchParams.get('session'));
  let isLoading = $state(true);
  let selectedQuestions = $state<typeof data.questions>([]);
  
  let currentContext = $derived<TestContext>({
    examId: data.examConfig.id,
    testType: "practice",
    scope: "subject",
    subjectId: data.subject.id,
    title: `${data.subject.name} Practice`
  });
  
  let conflictSession = $state<TestSession | null>(null);
  let showConflict = $state(false);

  import { settingsState } from "$lib/features/preferences";
  import { questionAttemptsRepo } from "$lib/features/progress/repositories/question-attempts";

  async function loadQuestions(id: string | null) {
    if (id) {
      const session = await testHistoryRepo.get(id);
      if (session && session.questionIds) {
        selectedQuestions = await pyqService.getQuestionsByIds(data.examConfig.id, session.questionIds);
      } else {
        selectedQuestions = data.questions;
      }
    } else {
      if (settingsState.values.reviewIncorrect) {
        const attempts = await questionAttemptsRepo.getForExam(data.examConfig.id);
        attempts.sort((a, b) => new Date(b.attemptedAt).getTime() - new Date(a.attemptedAt).getTime());
        
        const latestAttempts = new Map<string, typeof attempts[0]>();
        for (const attempt of attempts) {
          if (!latestAttempts.has(attempt.questionId)) {
            latestAttempts.set(attempt.questionId, attempt);
          }
        }
        
        const incorrectQuestionIds = new Set(Array.from(latestAttempts.values())
          .filter(a => a.isAnswered && !a.isCorrect)
          .map(a => a.questionId));
          
        if (incorrectQuestionIds.size > 0) {
          const incorrect = data.questions.filter(q => incorrectQuestionIds.has(q.id));
          const others = data.questions.filter(q => !incorrectQuestionIds.has(q.id));
          // Shuffle others so they aren't always the same order
          const shuffledOthers = others.sort(() => 0.5 - Math.random());
          selectedQuestions = [...incorrect, ...shuffledOthers];
        } else {
          selectedQuestions = [...data.questions].sort(() => 0.5 - Math.random());
        }
      } else {
        // Just shuffle them if no prioritization
        selectedQuestions = [...data.questions].sort(() => 0.5 - Math.random());
      }
    }
  }

  onMount(async () => {
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

  const handleExit = () => {
    window.location.href = `/${data.examConfig.id}/subjects`;
  };
</script>

<SEO 
  title="{data.subject.name} | {data.examConfig.shortName}" 
  description="Practice questions and view statistics for {data.subject.name} in {data.examConfig.name}."
/>

{#if showConflict && conflictSession}
  <SessionConflictDialog 
    session={conflictSession}
    onResume={handleResume}
    onDiscard={handleDiscard}
    onCancel={handleExit}
  />
{:else if isLoading}
  <div class="min-h-screen flex items-center justify-center bg-muted/20">
    <div class="text-muted-foreground animate-pulse">Loading subject practice session...</div>
  </div>
{:else}
  <QuizShell 
    examConfig={data.examConfig} 
    questions={selectedQuestions} 
    mode="practice"
    context={currentContext}
    {sessionId}
    onExit={handleExit} 
  />
{/if}
