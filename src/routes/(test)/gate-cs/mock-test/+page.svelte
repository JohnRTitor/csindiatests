<script lang="ts">
  import { goto } from "$app/navigation";
  import { gateConfig, gateQuestions } from "$lib/features/exams/config/gate-cs";
  import QuizShell from "$lib/features/quiz/components/QuizShell.svelte";

  // Take 65 questions for GATE mock test
  const selectedQuestions = gateQuestions.slice(0, 65);
  
  // Clone config and set duration to 180 mins
  const activeConfig = { ...gateConfig, defaultDuration: 180 };

  function handleExit() {
    goto('/gate-cs');
  }
</script>

<svelte:head>
  <title>Mock Test | GATE CS</title>
</svelte:head>

<QuizShell 
  examConfig={activeConfig} 
  questions={selectedQuestions} 
  mode="timed" 
  onExit={handleExit} 
/>
