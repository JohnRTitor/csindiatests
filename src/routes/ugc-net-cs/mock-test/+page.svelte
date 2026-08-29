<script lang="ts">
  import { goto } from "$app/navigation";
  import { ugcNetConfig, ugcNetQuestions } from "$lib/features/exams/config/ugc-net-cs";
  import QuizShell from "$lib/features/quiz/components/QuizShell.svelte";

  // Take 50 questions for UGC NET mock test (as an example)
  const selectedQuestions = ugcNetQuestions.slice(0, 50);
  
  // Clone config and set duration to 60 mins
  const activeConfig = { ...ugcNetConfig, defaultDuration: 60 };

  function handleExit() {
    goto('/ugc-net-cs');
  }
</script>

<svelte:head>
  <title>Mock Test | UGC NET CS</title>
</svelte:head>

<QuizShell 
  examConfig={activeConfig} 
  questions={selectedQuestions} 
  mode="timed" 
  onExit={handleExit} 
/>
