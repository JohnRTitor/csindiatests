<script lang="ts">
  import QuizShell from "$lib/features/quiz/components/QuizShell.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const handleExit = () => {
    window.location.href = "/gate-cs/subjects";
  };
</script>

<svelte:head>
  <title>{data.subject.name} | GATE CS</title>
</svelte:head>

{#if data.questions.length > 0}
  <QuizShell
    questions={data.questions}
    examConfig={data.examConfig}
    mode="practice"
    onExit={handleExit}
  />
{:else}
  <div
    class="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center"
  >
    <h2 class="text-2xl font-bold mb-4">No questions available</h2>
    <p class="text-muted-foreground mb-8">
      We couldn't find any questions for {data.subject.name} yet.
    </p>
    <button
      class="px-4 py-2 bg-primary text-primary-foreground rounded-md"
      onclick={handleExit}
    >
      Back to Subjects
    </button>
  </div>
{/if}
