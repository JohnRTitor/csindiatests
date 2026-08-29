<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import QuestionNavigator from "./question-navigator.svelte";
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

  const totalAnswered = $derived(Object.keys(answers).length);
  const totalQuestions = $derived(questions.length);
  
  const correctAnswers = $derived(questions.filter((q: Question) => answers[q.id] === q.correctOptionId).length);
  const accuracy = $derived(totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0);
</script>

<div class="space-y-6">
  <Card.Root>
    <Card.Header class="pb-3">
      <Card.Title class="text-base">Test Progress</Card.Title>
    </Card.Header>
    <Card.Content>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <div class="text-2xl font-bold">{totalAnswered} <span class="text-sm font-medium text-muted-foreground">/ {totalQuestions}</span></div>
          <div class="text-xs text-muted-foreground mt-1">Answered</div>
        </div>
        <div>
          <div class="text-2xl font-bold">{accuracy}%</div>
          <div class="text-xs text-muted-foreground mt-1">Accuracy</div>
        </div>
      </div>
    </Card.Content>
  </Card.Root>

  <Card.Root>
    <Card.Header class="pb-3">
      <Card.Title class="text-base">Question Navigator</Card.Title>
    </Card.Header>
    <Card.Content>
      <QuestionNavigator 
        {questions} 
        {currentIndex} 
        {answers} 
        {onGoToQuestion} 
      />
    </Card.Content>
  </Card.Root>
</div>
