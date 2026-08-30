<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { ugcNetConfig } from "$lib/features/exams/config/ugc-net-cs";
  import QuizShell from "$lib/features/quiz/components/QuizShell.svelte";
  import SessionConflictDialog from "$lib/features/tests/components/session-conflict-dialog.svelte";
  import { pyqService } from "$lib/features/pyq/services/pyq-service";
  import type { Question } from "$lib/features/exams/types";
  import type { TestSession } from "$lib/infrastructure/storage/db.types";

  import { page } from "$app/state";
  import { testHistoryRepo } from "$lib/features/tests/repositories/test-history";
  import { sessionManager } from "$lib/features/tests/services/session-manager";
  import type { TestContext } from "$lib/features/tests/types";

  let sessionId = $derived(page.url.searchParams.get('session'));
  let selectedQuestions = $state<Question[]>([]);
  let isLoading = $state(true);

  let currentContext = $derived<TestContext>({
    examId: "ugc-net-cs",
    testType: "mock-test",
    scope: "mixed",
    title: "UGC NET Mock Test"
  });

  let conflictSession = $state<TestSession | null>(null);
  let showConflict = $state(false);

  async function loadQuestions(id: string | null) {
    if (id) {
      // Resume existing session
      const session = await testHistoryRepo.get(id);
      if (session && session.questionIds) {
        selectedQuestions = await pyqService.getQuestionsByIds("ugc-net-cs", session.questionIds);
      } else {
        selectedQuestions = await pyqService.getRandomQuestions("ugc-net-cs", 50);
      }
    } else {
      // Take 50 questions for UGC NET mock test
      selectedQuestions = await pyqService.getRandomQuestions("ugc-net-cs", 50);
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
  
  // Clone config and set duration to 60 mins
  const activeConfig = { ...ugcNetConfig, defaultDuration: 60 };

  function handleExit() {
    goto('/ugc-net-cs');
  }
</script>

<svelte:head>
  <title>Mock Test | UGC NET CS</title>
</svelte:head>

{#if showConflict && conflictSession}
  <SessionConflictDialog 
    session={conflictSession}
    onResume={handleResume}
    onDiscard={handleDiscard}
    onCancel={handleExit}
  />
{:else if isLoading}
  <div class="min-h-screen flex items-center justify-center bg-muted/20">
    <div class="text-muted-foreground animate-pulse">Loading mock test...</div>
  </div>
{:else}
  <QuizShell 
    examConfig={activeConfig} 
    questions={selectedQuestions} 
    mode="timed"
    context={currentContext}
    {sessionId} 
    onExit={handleExit} 
  />
{/if}
