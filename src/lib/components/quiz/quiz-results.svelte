<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { CheckCircle2, XCircle, Minus, Trophy, Clock, ArrowRight, RotateCcw } from "@lucide/svelte";
  import type { Question, QuizState } from "$lib/types";
  import { mockSubjects } from "$lib/data/subjects";

  let { state }: { state: QuizState } = $props();

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const totalQuestions = $derived(state.questions.length);
  const correct = $derived(state.score);
  const answered = $derived(Object.keys(state.answers).length);
  const incorrect = $derived(answered - correct);
  const unanswered = $derived(totalQuestions - answered);
  const accuracy = $derived(answered > 0 ? Math.round((correct / answered) * 100) : 0);
  
  const timeUsed = $derived(state.endTime ? state.endTime - state.startTime : 0);

  // Group performance by subject
  const subjectPerformance = $derived.by(() => {
    const stats: Record<string, { correct: number, total: number }> = {};
    
    state.questions.forEach(q => {
      if (!stats[q.subjectId]) {
        stats[q.subjectId] = { correct: 0, total: 0 };
      }
      stats[q.subjectId].total++;
      if (state.answers[q.id] === q.correctOptionId) {
        stats[q.subjectId].correct++;
      }
    });

    return Object.entries(stats).map(([subjectId, data]) => {
      return {
        name: mockSubjects.find(s => s.id === subjectId)?.name || "Unknown Subject",
        accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
        correct: data.correct,
        total: data.total
      };
    }).sort((a, b) => b.accuracy - a.accuracy);
  });
</script>

<div class="max-w-4xl mx-auto py-8">
  <div class="text-center mb-10">
    <div class="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-full mb-4">
      <Trophy class="h-8 w-8" />
    </div>
    <h1 class="text-3xl font-bold tracking-tight mb-2">Test Complete</h1>
    <p class="text-muted-foreground">Great job! Here's how you performed.</p>
  </div>

  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    <Card.Root>
      <Card.Content class="p-6 text-center">
        <div class="text-3xl font-bold mb-1">{correct} <span class="text-base font-normal text-muted-foreground">/ {totalQuestions}</span></div>
        <div class="text-sm font-medium text-muted-foreground">Score</div>
      </Card.Content>
    </Card.Root>
    
    <Card.Root>
      <Card.Content class="p-6 text-center">
        <div class="text-3xl font-bold mb-1">{accuracy}%</div>
        <div class="text-sm font-medium text-muted-foreground">Accuracy</div>
      </Card.Content>
    </Card.Root>
    
    <Card.Root>
      <Card.Content class="p-6 text-center">
        <div class="text-3xl font-bold mb-1">{answered}</div>
        <div class="text-sm font-medium text-muted-foreground">Answered</div>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Content class="p-6 text-center">
        <div class="text-3xl font-bold mb-1">{formatDuration(timeUsed)}</div>
        <div class="flex items-center justify-center text-sm font-medium text-muted-foreground">
          <Clock class="mr-1 h-3 w-3" /> Time Used
        </div>
      </Card.Content>
    </Card.Root>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
    <Card.Root>
      <Card.Header>
        <Card.Title>Summary</Card.Title>
      </Card.Header>
      <Card.Content>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center text-green-600 dark:text-green-500">
              <CheckCircle2 class="mr-2 h-5 w-5" />
              <span class="font-medium">Correct</span>
            </div>
            <span class="font-bold">{correct}</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center text-red-600 dark:text-red-500">
              <XCircle class="mr-2 h-5 w-5" />
              <span class="font-medium">Incorrect</span>
            </div>
            <span class="font-bold">{incorrect}</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center text-muted-foreground">
              <Minus class="mr-2 h-5 w-5" />
              <span class="font-medium">Unanswered</span>
            </div>
            <span class="font-bold">{unanswered}</span>
          </div>
        </div>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Header>
        <Card.Title>Subject Performance</Card.Title>
      </Card.Header>
      <Card.Content>
        <div class="space-y-4">
          {#each subjectPerformance as sp}
            <div class="space-y-1">
              <div class="flex justify-between text-sm">
                <span class="font-medium line-clamp-1">{sp.name}</span>
                <span class="text-muted-foreground">{sp.correct}/{sp.total} ({sp.accuracy}%)</span>
              </div>
              <div class="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  class="h-full bg-primary rounded-full"
                  style="width: {sp.accuracy}%"
                ></div>
              </div>
            </div>
          {/each}
        </div>
      </Card.Content>
    </Card.Root>
  </div>

  <div class="flex flex-col sm:flex-row justify-center gap-4">
    <Button size="lg" class="w-full sm:w-auto font-medium" disabled>
      Review Mistakes
    </Button>
    <Button variant="outline" size="lg" class="w-full sm:w-auto font-medium" onclick={() => window.location.reload()}>
      <RotateCcw class="mr-2 h-4 w-4" />
      Retry Test
    </Button>
    <Button variant="outline" size="lg" class="w-full sm:w-auto font-medium" href="/">
      Return to Dashboard
      <ArrowRight class="ml-2 h-4 w-4" />
    </Button>
  </div>
</div>
