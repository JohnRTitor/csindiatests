<script lang="ts">
  import type { PyqQuestion, PyqPaperManifest } from "$lib/features/pyq/types";
  import type { ExamConfig, Question } from "$lib/features/exams/types";
  import PyqModeSwitch from "./PyqModeSwitch.svelte";
  import PyqReadView from "./PyqReadView.svelte";
  import QuizShell from "$lib/features/quiz/components/QuizShell.svelte";

  let { 
    questions, 
    manifest,
    examConfig,
    onExit 
  }: { 
    questions: PyqQuestion[]; 
    manifest: PyqPaperManifest;
    examConfig: ExamConfig;
    onExit: () => void;
  } = $props();

  let mode = $state<"quiz" | "read">("quiz");

  // Map PyqQuestion to Question for QuizShell
  // We explicitly preserve `answer: null` as `correctOptionId: null`
  // QuizShell/AnswerOption needs to handle correctOptionId === null as "Answer Unavailable"
  const mappedQuestions: Question[] = $derived(
    questions.map(q => ({
      id: q.id,
      examId: q.examId,
      subjectId: q.subjectId || "pyq",
      topic: q.topic,
      difficulty: q.difficulty || "Medium",
      content: q.content,
      options: q.options,
      correctOptionId: q.answer,
      explanation: q.explanation,
      tags: [q.year.toString(), q.paper, q.shift]
    }))
  );
</script>

<div class="min-h-screen flex flex-col bg-muted/20">
  <div class="bg-card border-b sticky top-0 z-10 shadow-sm">
    <div class="container mx-auto px-4 max-w-5xl h-16 flex items-center justify-between">
      <div class="font-semibold hidden sm:block">
        {examConfig.shortName} · {manifest.title}
      </div>
      <div class="grow flex justify-center">
        <PyqModeSwitch {mode} onModeChange={(m) => mode = m} />
      </div>
      <div>
        <button class="text-sm font-medium hover:underline text-muted-foreground" onclick={onExit}>
          Exit
        </button>
      </div>
    </div>
  </div>

  <div class="grow">
    {#if mode === "quiz"}
      <div class="h-[calc(100vh-4rem)]">
        <!-- QuizShell handles its own layout, but we pass isAnswerUnavailable via modified components -->
        <QuizShell 
          {examConfig} 
          questions={mappedQuestions} 
          mode="practice"
          {onExit} 
        />
      </div>
    {:else}
      <PyqReadView {questions} title={manifest.title} />
    {/if}
  </div>
</div>
