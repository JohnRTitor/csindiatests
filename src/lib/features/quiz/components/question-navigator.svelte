<script lang="ts">
  import { Check, X, Minus, ChevronLeft, ChevronRight } from "@lucide/svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import type { Question } from "$lib/features/exams/types";

  let { 
    questions, 
    currentIndex, 
    answers, 
    onGoToQuestion 
  } = $props<{
    questions: Question[],
    currentIndex: number,
    answers: Record<string, string>,
    onGoToQuestion: (index: number) => void
  }>();

  const QUESTIONS_PER_PAGE = 30;
  
  let currentPage = $state(0);
  const totalPages = $derived(Math.ceil(questions.length / QUESTIONS_PER_PAGE));
  
  $effect(() => {
    // Keep navigator page in sync with current question index
    const expectedPage = Math.floor(currentIndex / QUESTIONS_PER_PAGE);
    if (currentPage !== expectedPage) {
      currentPage = expectedPage;
    }
  });

  const visibleQuestions = $derived(questions.slice(currentPage * QUESTIONS_PER_PAGE, (currentPage + 1) * QUESTIONS_PER_PAGE));

  function getQuestionState(question: Question, index: number) {
    const isCurrent = index === currentIndex;
    const answer = answers[question.id];
    const isAnswered = answer !== undefined;
    const isCorrect = isAnswered && answer === question.correctOptionId;

    return {
      isCurrent,
      isAnswered,
      isCorrect,
      isIncorrect: isAnswered && !isCorrect
    };
  }
</script>

<div class="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 xl:grid-cols-6 gap-2">
  {#snippet QuestionButton(index: number, state: ReturnType<typeof getQuestionState>)}
    <button
      class={`
        relative flex flex-col items-center justify-center h-12 rounded-lg border font-medium text-sm transition-all outline-none
        ${state.isCurrent ? 'ring-2 ring-primary border-transparent shadow-sm scale-105 z-10' : 'hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring'}
        ${state.isCorrect && !state.isCurrent ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400' : ''}
        ${state.isIncorrect && !state.isCurrent ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400' : ''}
        ${!state.isAnswered && !state.isCurrent ? 'bg-background border-border text-foreground' : ''}
      `}
      onclick={() => onGoToQuestion(index)}
      aria-label={`Question ${index + 1}`}
      aria-current={state.isCurrent ? "true" : undefined}
    >
      <span>{index + 1}</span>
      
      <div class="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-background border shadow-sm">
        {#if state.isCorrect}
          <Check class="h-2.5 w-2.5 text-green-500" />
        {:else if state.isIncorrect}
          <X class="h-2.5 w-2.5 text-red-500" />
        {:else}
          <Minus class="h-2.5 w-2.5 text-muted-foreground/50" />
        {/if}
      </div>
    </button>
  {/snippet}

  {#each visibleQuestions as question, localIndex}
    {@const index = currentPage * QUESTIONS_PER_PAGE + localIndex}
    {@const state = getQuestionState(question, index)}
    {@render QuestionButton(index, state)}
  {/each}
</div>

{#if totalPages > 1}
  <div class="mt-4 flex items-center justify-between">
    <Button 
      variant="outline" 
      size="sm" 
      disabled={currentPage === 0}
      onclick={() => currentPage--}
      aria-label="Previous questions"
    >
      <ChevronLeft class="h-4 w-4 mr-1" /> Prev
    </Button>
    <div class="text-xs text-muted-foreground font-medium">
      {currentPage * QUESTIONS_PER_PAGE + 1} - {Math.min((currentPage + 1) * QUESTIONS_PER_PAGE, questions.length)} of {questions.length}
    </div>
    <Button 
      variant="outline" 
      size="sm" 
      disabled={currentPage === totalPages - 1}
      onclick={() => currentPage++}
      aria-label="Next questions"
    >
      Next <ChevronRight class="h-4 w-4 ml-1" />
    </Button>
  </div>
{/if}

<div class="mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground justify-center">
  {#snippet LegendItem(label: string, dotClass: string)}
    <div class="flex items-center gap-1.5">
      <div class={`h-3 w-3 rounded-full ${dotClass}`}></div>
      <span>{label}</span>
    </div>
  {/snippet}

  {@render LegendItem("Unanswered", "bg-background border")}
  {@render LegendItem("Correct", "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50")}
  {@render LegendItem("Incorrect", "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50")}
</div>
