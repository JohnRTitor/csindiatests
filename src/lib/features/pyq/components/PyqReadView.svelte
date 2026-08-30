<script lang="ts">
  import type { PyqQuestion } from "$lib/features/pyq/types";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import RichContentRenderer from "./RichContentRenderer.svelte";
  import { FileText, MapPin, Eye, EyeOff, SquareCheck } from "@lucide/svelte";

  let { questions, title, onStartQuiz }: { questions: PyqQuestion[]; title: string; onStartQuiz?: () => void } =
    $props();

  let revealedAnswers = $state<Record<string, boolean>>({});

  let questionsWithAnswers = $derived(questions.filter((q) => q.answer));
  let isAllRevealed = $derived(
    questionsWithAnswers.length > 0 &&
      questionsWithAnswers.every((q) => revealedAnswers[q.id])
  );

  function toggleAll() {
    if (isAllRevealed) {
      revealedAnswers = {};
    } else {
      const next: Record<string, boolean> = { ...revealedAnswers };
      questionsWithAnswers.forEach((q) => {
        next[q.id] = true;
      });
      revealedAnswers = next;
    }
  }

  function toggleAnswer(id: string) {
    revealedAnswers[id] = !revealedAnswers[id];
  }
</script>

<div class="space-y-8 max-w-4xl mx-auto py-8">
  <div class="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
    <div>
      <h1 class="text-3xl font-bold tracking-tight mb-2">{title}</h1>
      <p class="text-muted-foreground flex items-center">
        <FileText class="mr-2 h-4 w-4" />
        {questions.length} Questions · Read Mode
      </p>
    </div>
    <div class="flex items-center gap-2">
      {#if questionsWithAnswers.length > 0}
        <Button variant="outline" onclick={toggleAll}>
          {#if isAllRevealed}
            <EyeOff class="mr-2 h-4 w-4" />
            Hide All Answers
          {:else}
            <Eye class="mr-2 h-4 w-4" />
            Reveal All Answers
          {/if}
        </Button>
      {/if}
      {#if onStartQuiz}
        <Button onclick={onStartQuiz}>
          <SquareCheck class="mr-2 h-4 w-4" />
          Start Quiz
        </Button>
      {/if}
    </div>
  </div>

  {#each questions as question (question.id)}
    <Card.Root id="q-{question.questionNumber}" class="scroll-m-20">
      <Card.Header class="pb-3 border-b bg-muted/30">
        <div class="flex justify-between items-center">
          <Card.Title class="text-lg"
            >Question {question.questionNumber}</Card.Title
          >
          <div
            class="text-xs text-muted-foreground flex items-center bg-background px-2 py-1 rounded-md border"
          >
            <MapPin class="mr-1 h-3 w-3" />
            Page {question.source.page}
          </div>
        </div>
      </Card.Header>
      <Card.Content class="pt-6">
        <div class="mb-6">
          <RichContentRenderer content={question.content} />
        </div>

        <div class="space-y-3 pl-4 border-l-2 border-muted">
          {#each question.options as option}
            <div class="flex items-start">
              <span class="font-semibold mr-3 mt-1 min-w-6"
                >{option.id}.</span
              >
              <div class="grow">
                <RichContentRenderer content={option.content} />
              </div>
            </div>
          {/each}
        </div>
      </Card.Content>
      {#if question.answer}
        <Card.Footer class="bg-primary/5 border-t pt-4 flex-col items-start gap-4">
          <Button
            variant="ghost"
            size="sm"
            class="text-muted-foreground hover:text-foreground -ml-3"
            onclick={() => toggleAnswer(question.id)}
            aria-label={revealedAnswers[question.id] ? `Hide answer for question ${question.questionNumber}` : `Show answer for question ${question.questionNumber}`}
          >
            {#if revealedAnswers[question.id]}
              <EyeOff class="mr-2 h-4 w-4" />
              Hide Answer
            {:else}
              <Eye class="mr-2 h-4 w-4" />
              Show Answer
            {/if}
          </Button>

          {#if revealedAnswers[question.id]}
            <div class="w-full">
              <p class="font-semibold text-primary mb-1">
                Answer: {question.answer}
              </p>
              {#if question.explanation}
                <div class="text-sm text-muted-foreground mt-3 pt-3 border-t border-muted/50">
                  <span class="font-medium text-foreground mb-1 block">Explanation:</span>
                  {#if Array.isArray(question.explanation)}
                    <RichContentRenderer content={question.explanation} />
                  {:else}
                    <p>{question.explanation}</p>
                  {/if}
                </div>
              {/if}
            </div>
          {/if}
        </Card.Footer>
      {/if}
    </Card.Root>
  {/each}
</div>
