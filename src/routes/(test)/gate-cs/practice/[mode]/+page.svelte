<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { gateConfig } from "$lib/features/exams/config/gate-cs";
  import type { QuizMode } from "$lib/features/quiz/types";
  import type { Question } from "$lib/features/exams/types";
  import QuizShell from "$lib/features/quiz/components/QuizShell.svelte";
  import { testHistoryRepo } from "$lib/features/tests/repositories/test-history";
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

  onMount(async () => {
    const data = modeData();
    if (!data) {
      isLoading = false;
      return;
    }

    if (sessionId) {
      // Resume existing session
      const session = await testHistoryRepo.get(sessionId);
      if (session && session.questionIds) {
        selectedQuestions = await pyqService.getQuestionsByIds("gate-cs", session.questionIds);
      } else {
        // Fallback if invalid
        selectedQuestions = await pyqService.getRandomQuestions("gate-cs", data.count);
      }
    } else {
      // New session: get random questions
      selectedQuestions = await pyqService.getRandomQuestions("gate-cs", data.count);
    }
    
    isLoading = false;
  });

  function handleExit() {
    goto('/gate-cs');
  }
</script>

<svelte:head>
  <title>Practice {modeParam} | GATE CS</title>
</svelte:head>

{#if isLoading}
  <div class="min-h-screen flex items-center justify-center bg-muted/20">
    <div class="text-muted-foreground animate-pulse">Loading practice session...</div>
  </div>
{:else if modeData()}
  <QuizShell 
    examConfig={gateConfig} 
    questions={selectedQuestions} 
    mode={modeData()!.mode} 
    {sessionId}
    onExit={handleExit} 
  />
{:else}
  <div class="min-h-screen flex items-center justify-center bg-muted/20">
    <div class="text-center">
      <h1 class="text-2xl font-bold mb-4">Invalid Practice Mode</h1>
      <button class="text-primary hover:underline" onclick={() => goto('/gate-cs')}>
        Return to GATE CS
      </button>
    </div>
  </div>
{/if}
