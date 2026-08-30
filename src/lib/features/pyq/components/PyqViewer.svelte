<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import type { PyqQuestion, PyqPaperManifest } from "$lib/features/pyq/types";
  import type { ExamConfig, Question } from "$lib/features/exams/types";
  import type { TestSession } from "$lib/infrastructure/storage/db.types";
  import PyqReadView from "./PyqReadView.svelte";
  import QuizShell from "$lib/features/quiz/components/QuizShell.svelte";
  import SessionConflictDialog from "$lib/features/tests/components/session-conflict-dialog.svelte";
  import { testHistoryRepo } from "$lib/features/tests/repositories/test-history";
  import { sessionManager } from "$lib/features/tests/services/session-manager";
  import type { TestContext } from "$lib/features/tests/types";

  let {
    questions,
    manifest,
    examConfig,
    onExit,
  }: {
    questions: PyqQuestion[];
    manifest: PyqPaperManifest;
    examConfig: ExamConfig;
    onExit: () => void;
  } = $props();

  let sessionId = $derived(page.url.searchParams.get("session"));
  let mode = $state<"quiz" | "read">(
    page.url.searchParams.has("session") || page.url.searchParams.has("start") ? "quiz" : "read",
  );
  let isLoading = $state(false);
  
  let currentContext = $derived<TestContext>({
    examId: examConfig.id,
    testType: "pyq",
    scope: "paper",
    paperId: `${manifest.year}/${manifest.shift}`,
    title: `${examConfig.shortName} · ${manifest.title}`
  });

  let conflictSession = $state<TestSession | null>(null);
  let showConflict = $state(false);

  // Map PyqQuestion to Question for QuizShell
  // We explicitly preserve `answer: null` as `correctOptionId: null`
  // QuizShell/AnswerOption needs to handle correctOptionId === null as "Answer Unavailable"
  const mappedQuestions: Question[] = $derived(
    questions.map((q) => ({
      id: q.id,
      examId: examConfig.id,
      subjectId: q.subjectId || "pyq",
      topic: q.topicId || undefined,
      difficulty: "Medium",
      content: q.content,
      options: q.options,
      correctOptionId: q.answer,
      explanation: q.explanation,
      tags: [manifest.year.toString(), manifest.paper, manifest.shift],
    })),
  );

  onMount(async () => {
    // If the page is loaded with a session ID or start flag, we immediately check for conflicts
    // or resume if it's the right session.
    if (mode === "quiz" && (!sessionId || page.url.searchParams.has("start"))) {
      await checkConflictAndStart();
    }
  });

  async function checkConflictAndStart() {
    isLoading = true;
    mode = "quiz";
    const conflict = await sessionManager.findActiveSession(currentContext);
    if (conflict) {
      conflictSession = conflict;
      showConflict = true;
    }
    isLoading = false;
  }

  async function startQuiz() {
    await checkConflictAndStart();
  }

  async function handleResume() {
    if (!conflictSession) return;
    const url = new URL(page.url.href);
    url.searchParams.set("session", conflictSession.id);
    goto(url, { replaceState: true, keepFocus: true });

    showConflict = false;
  }

  async function handleDiscard() {
    if (!conflictSession) return;
    await testHistoryRepo.update(conflictSession.id, { status: "abandoned" });
    showConflict = false;
  }
</script>

<div class="min-h-screen flex flex-col bg-muted/20">
  {#if mode !== "quiz"}
    <div class="bg-card border-b sticky top-0 z-10 shadow-sm">
      <div
        class="container mx-auto px-4 max-w-5xl h-16 flex items-center justify-between"
      >
        <div class="font-semibold hidden sm:block">
          {examConfig.shortName} · {manifest.title}
        </div>
        <div>
          <button
            class="text-sm font-medium hover:underline text-muted-foreground"
            onclick={onExit}
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  {/if}

  <div class="grow flex flex-col">
    {#if mode === "quiz"}
      <div class="grow flex flex-col">
        {#if showConflict && conflictSession}
          <SessionConflictDialog
            session={conflictSession}
            onResume={handleResume}
            onDiscard={handleDiscard}
            onCancel={onExit}
          />
        {:else if isLoading}
          <div class="flex items-center justify-center h-full">
            <div class="text-muted-foreground animate-pulse">
              Loading pyq session...
            </div>
          </div>
        {:else}
          <!-- QuizShell handles its own layout, but we pass isAnswerUnavailable via modified components -->
          <QuizShell
            {examConfig}
            questions={mappedQuestions}
            mode="practice"
            context={currentContext}
            {sessionId}
            {onExit}
          />
        {/if}
      </div>
    {:else}
      <PyqReadView {questions} title={manifest.title} onStartQuiz={startQuiz} />
    {/if}
  </div>
</div>
