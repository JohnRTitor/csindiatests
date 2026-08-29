<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { ugcNetConfig } from "$lib/features/exams/config/ugc-net-cs";
  import QuizShell from "$lib/features/quiz/components/QuizShell.svelte";
  import { pyqService } from "$lib/features/pyq/services/pyq-service";
  import type { Question } from "$lib/features/exams/types";

  import { page } from "$app/state";
  import { testHistoryRepo } from "$lib/features/tests/repositories/test-history";

  let sessionId = $derived(page.url.searchParams.get('session'));
  let selectedQuestions = $state<Question[]>([]);
  let isLoading = $state(true);

  onMount(async () => {
    if (sessionId) {
      // Resume existing session
      const session = await testHistoryRepo.get(sessionId);
      if (session && session.questionIds) {
        selectedQuestions = await pyqService.getQuestionsByIds("ugc-net-cs", session.questionIds);
      } else {
        selectedQuestions = await pyqService.getRandomQuestions("ugc-net-cs", 50);
      }
    } else {
      // Take 50 questions for UGC NET mock test
      selectedQuestions = await pyqService.getRandomQuestions("ugc-net-cs", 50);
    }
    isLoading = false;
  });
  
  // Clone config and set duration to 60 mins
  const activeConfig = { ...ugcNetConfig, defaultDuration: 60 };

  function handleExit() {
    goto('/ugc-net-cs');
  }
</script>

<svelte:head>
  <title>Mock Test | UGC NET CS</title>
</svelte:head>

{#if isLoading}
  <div class="min-h-screen flex items-center justify-center bg-muted/20">
    <div class="text-muted-foreground animate-pulse">Loading mock test...</div>
  </div>
{:else}
  <QuizShell 
    examConfig={activeConfig} 
    questions={selectedQuestions} 
    mode="timed"
    {sessionId} 
    onExit={handleExit} 
  />
{/if}
