<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { ugcNetConfig, ugcNetQuestions } from "$lib/features/exams/config/ugc-net-cs";
  import type { QuizMode } from "$lib/features/quiz/types";
  import QuizShell from "$lib/features/quiz/components/QuizShell.svelte";

  // Derive mode and count from route params and config
  let modeParam = $derived($page.params.mode);
  
  // Map mode param to quiz mode and question count
  let modeData = $derived(() => {
    switch(modeParam) {
      case 'quick': return { mode: 'practice' as QuizMode, count: 10 };
      case 'focused': return { mode: 'practice' as QuizMode, count: 25 };
      case 'full': return { mode: 'practice' as QuizMode, count: 50 };
      default: return null;
    }
  });

  let selectedQuestions = $derived(() => {
    const data = modeData();
    if (!data) return [];
    return ugcNetQuestions.slice(0, data.count);
  });

  function handleExit() {
    goto('/ugc-net-cs');
  }
</script>

<svelte:head>
  <title>Practice {modeParam} | UGC NET CS</title>
</svelte:head>

{#if modeData()}
  <QuizShell 
    examConfig={ugcNetConfig} 
    questions={selectedQuestions()} 
    mode={modeData()!.mode} 
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
