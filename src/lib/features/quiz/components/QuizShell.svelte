<script lang="ts">
  import { onMount } from "svelte";
  import { createQuizStore } from "$lib/features/quiz/state/quiz.svelte";
  import type { ExamConfig, Question } from "$lib/features/exams/types";
import type { QuizMode } from "$lib/features/quiz/types";
  
  import QuizHeader from "$lib/features/quiz/components/quiz-header.svelte";
  import QuestionCard from "$lib/features/quiz/components/question-card.svelte";
  import AnswerOption from "$lib/features/quiz/components/answer-option.svelte";
  import ExplanationCard from "$lib/features/quiz/components/explanation-card.svelte";
  import QuizSidebar from "$lib/features/quiz/components/quiz-sidebar.svelte";
  import QuizResults from "$lib/features/quiz/components/quiz-results.svelte";
  import QuestionNavigator from "$lib/features/quiz/components/question-navigator.svelte";
  import { settingsState } from "$lib/features/preferences";

  import { quizPersistenceService } from "$lib/features/quiz/services/quiz-persistence";
  import { testHistoryRepo } from "$lib/features/tests/repositories/test-history";
  import { testAnswersRepo } from "$lib/features/tests/repositories/test-answers";
  import { testCompletionService } from "$lib/features/tests/services/test-completion";
  import type { TestContext } from "$lib/features/tests/types";


  import { Button } from "$lib/components/ui/button/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import SubmitConfirmDialog from "./submit-confirm-dialog.svelte";
  import { ArrowRight, LayoutGrid, CircleCheck } from "@lucide/svelte";

  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  
  let { 
    examConfig, 
    questions, 
    mode = "practice",
    context,
    sessionId: initialSessionId,
    onExit
  }: { 
    examConfig: ExamConfig, 
    questions: Question[], 
    mode?: QuizMode,
    context: TestContext,
    sessionId?: string | null,
    onExit: () => void 
  } = $props();

  let durationMinutes = $derived(examConfig.defaultDuration || 60);
  
  // Initialize quiz with provided questions and mode (needs to be reactive if these can change)
  const quiz = $derived(createQuizStore(questions, mode, durationMinutes));

  let isMobileNavigatorOpen = $state(false);
  let reviewMode = $state(false);
  let sessionId = $state("");

  onMount(() => {
    let isActive = true;

    const initSession = async () => {
      if (!isActive) return;

      if (initialSessionId) {
        sessionId = initialSessionId;
        const existingSession = await testHistoryRepo.get(sessionId);
        if (existingSession) {
          // Load answers
          const savedAnswers = await testAnswersRepo.getForTest(sessionId);
          const answerMap: Record<string, string> = {};
          savedAnswers.forEach(a => {
            if (a.selectedAnswer) {
              answerMap[a.questionId] = a.selectedAnswer;
            }
          });
          
          // Calculate remaining time
          let timeRemaining = null;
          if (mode === "timed" && existingSession.startedAt) {
            const elapsedSeconds = Math.floor((Date.now() - new Date(existingSession.startedAt).getTime()) / 1000);
            const totalDuration = durationMinutes * 60;
            timeRemaining = Math.max(0, totalDuration - elapsedSeconds);
          }
          
          quiz.restoreState(answerMap, timeRemaining);
          quiz.start();
          
          // Restore currentIndex to the first unanswered question
          const firstUnansweredIndex = questions.findIndex(q => !answerMap[q.id]);
          if (firstUnansweredIndex !== -1) {
            quiz.goToQuestion(firstUnansweredIndex);
          } else {
            quiz.goToQuestion(questions.length - 1);
          }
          return;
        }
      } 
      
      // Create new session
      sessionId = crypto.randomUUID();
      
      // Create the test session
      await testHistoryRepo.create({
        id: sessionId,
        examId: examConfig.id,
        testType: context.testType,
        scope: context.scope,
        subjectId: context.subjectId,
        topicId: context.topicId,
        paperId: context.paperId,
        title: context.title || `${examConfig.shortName} Practice`,
        mode: mode,
        startedAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        questionIds: questions.map(q => q.id),
        completedAt: null,
        durationSeconds: null,
        totalQuestions: questions.length,
        answeredQuestions: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        skippedQuestions: 0,
        score: 0,
        percentage: 0,
        status: 'in_progress',
        metadata: null
      });

      quiz.start();

      // Update URL to preserve session ID across refreshes
      const url = new URL(page.url);
      url.searchParams.set('session', sessionId);
      goto(url, { replaceState: true, keepFocus: true });
    };

    initSession();
    
    return () => {
      isActive = false;
      quiz.reset();
    };
  });

  let showConfirmSubmitDialog = $state(false);

  const handleAnswerSelect = (optionId: string) => {
    if (reviewMode) return;
    const currentQ = quiz.currentQuestion;
    if (!quiz.state.answers[currentQ.id]) {
      quiz.answerQuestion(currentQ.id, optionId);
      
      const isCorrect = optionId === currentQ.correctOptionId;
      const timeSpent = 0; // Could track actual time spent per question later
      
      quizPersistenceService.recordAnswer({
        id: crypto.randomUUID(),
        testSessionId: sessionId,
        questionId: currentQ.id,
        selectedAnswer: optionId,
        correctAnswer: currentQ.correctOptionId || "",
        isCorrect: isCorrect,
        answeredAt: new Date().toISOString(),
        timeSpentSeconds: timeSpent,
        markedForReview: false,
        explanationSeen: true,
        metadata: null
      }).catch(console.error);
      
      const currentQIndex = quiz.state.currentIndex;
      
      if (settingsState.values.autoAdvance && currentQIndex < quiz.state.questions.length - 1) {
        const willShowFeedback = settingsState.values.showExplanation || forceShowAnswerForCurrent;
        
        if (!(willShowFeedback && !isCorrect)) {
          setTimeout(() => {
            if (!reviewMode && quiz.state.answers[currentQ.id] && quiz.state.currentIndex === currentQIndex) {
              handleNext();
            }
          }, 1000);
        }
      }
    }
  };

  const handleNext = () => {
    if (quiz.state.currentIndex === quiz.state.questions.length - 1) {
      if (reviewMode) {
        onExit();
      } else {
        if (settingsState.values.confirmEndTest) {
          showConfirmSubmitDialog = true;
        } else {
          submitTest();
        }
      }
    } else {
      quiz.nextQuestion();
    }
  };

  const submitTest = () => {
    quiz.complete();
    
    // Finalize the session and save analytics
    testCompletionService.completeTest(
      sessionId,
      quiz.state.questions,
      quiz.state.answers,
      quiz.state.score,
      quiz.state.startTime,
      mode,
      examConfig.id
    ).catch(console.error);
  };

  const handleCancelTest = async () => {
    if (sessionId) {
      await testHistoryRepo.delete(sessionId);
      await testAnswersRepo.deleteForTest(sessionId);
    }
    onExit();
  };

  const handleReviewMistakes = () => {
    reviewMode = true;
    quiz.state.mode = "review"; // Custom state for UI if needed
    // In review mode, we just want to look at incorrect ones, but for simplicity,
    // let's just go through all questions and show their answers/explanations.
    // Ideally we'd filter, but keeping it simple for now or jumping to first mistake.
    const firstMistakeIndex = quiz.state.questions.findIndex(q => quiz.state.answers[q.id] !== q.correctOptionId);
    if (firstMistakeIndex !== -1) {
      quiz.goToQuestion(firstMistakeIndex);
    } else {
      quiz.goToQuestion(0);
    }
  };

  let forceShowAnswerForCurrent = $state(false);

  $effect(() => {
    // Reset force show when question changes
    const _ = quiz.state.currentIndex;
    forceShowAnswerForCurrent = false;
  });

  const handleShowAnswer = () => {
    forceShowAnswerForCurrent = true;
  };

</script>

<svelte:head>
  <title>{examConfig.shortName} Practice | CS India Tests</title>
</svelte:head>

<div class="min-h-screen bg-muted/10 flex flex-col">
  
  {#if quiz.isCompleted && !reviewMode}
    <div class="container mx-auto px-4 grow flex items-center justify-center">
      <QuizResults 
        state={quiz.state} 
        onReviewMistakes={handleReviewMistakes} 
        onExit={onExit} 
      />
    </div>
  {:else if quiz.isStarted || reviewMode}
    
    <QuizHeader 
      title={context.title || examConfig.name}
      modeLabel={mode === 'practice' ? 'Practice Test' : 'Mock Test'}
      currentIndex={quiz.state.currentIndex}
      totalQuestions={quiz.state.questions.length}
      timeRemaining={quiz.state.timeRemaining}
      elapsedTime={quiz.state.elapsedTime}
      isTimerPaused={quiz.state.isTimerPaused}
      onPauseTimer={() => quiz.pauseTimer()}
      onResumeTimer={() => quiz.resumeTimer()}
      onExit={onExit}
      onCancelTest={handleCancelTest}
    />

    {#if quiz.state.isTimerPaused}
      <div class="grow flex flex-col items-center justify-center container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">Test Paused</h2>
        <p class="text-muted-foreground max-w-md mb-8">Take a breather. The timer is currently stopped.</p>
        <Button size="lg" onclick={() => quiz.resumeTimer()}>Resume Practice</Button>
      </div>
    {:else}
      <main class="grow container mx-auto px-4 py-6 md:py-8 flex gap-8 relative items-start">
        
        <!-- Left Column: Question Area -->
        <div class="w-full {settingsState.values.showNavigator ? 'lg:w-[65%] xl:w-[70%]' : 'max-w-4xl'} max-w-3xl mx-auto lg:mx-0">
          
          {#if reviewMode}
            <div class="mb-4 text-sm font-medium text-amber-600 bg-amber-50 px-4 py-2 rounded-md border border-amber-200">
              Review Mode - Analyzing Mistakes
            </div>
          {/if}

          <div class="bg-card rounded-2xl border shadow-sm p-6 sm:p-8 md:p-10 compact:p-4 transition-all">
            <QuestionCard 
              question={quiz.currentQuestion}
              index={quiz.state.currentIndex}
            />

            <div class="space-y-3 compact:space-y-2 mt-8 compact:mt-4">
              {#each quiz.currentQuestion.options as option}
                <AnswerOption 
                  {option}
                  isSelected={quiz.state.answers[quiz.currentQuestion.id] === option.id}
                  isEvaluated={reviewMode || forceShowAnswerForCurrent || (settingsState.values.showExplanation && quiz.state.answers[quiz.currentQuestion.id] !== undefined)}
                  isCorrect={option.id === quiz.currentQuestion.correctOptionId}
                  isAnswerUnavailable={quiz.currentQuestion.correctOptionId === null}
                  onSelect={handleAnswerSelect}
                />
              {/each}
            </div>

            {#if reviewMode || forceShowAnswerForCurrent || quiz.state.answers[quiz.currentQuestion.id]}
              {#if settingsState.values.showExplanation || reviewMode || forceShowAnswerForCurrent}
                {#if quiz.currentQuestion.correctOptionId !== null || quiz.currentQuestion.explanation !== null}
                  <ExplanationCard 
                    isCorrect={quiz.state.answers[quiz.currentQuestion.id] === quiz.currentQuestion.correctOptionId}
                    explanation={quiz.currentQuestion.explanation}
                    correctAnswerId={quiz.currentQuestion.correctOptionId}
                    isAnswered={quiz.state.answers[quiz.currentQuestion.id] !== undefined}
                  />
                {:else}
                  <div class="mt-6 compact:mt-4 p-4 rounded-xl border border-muted bg-muted/20 text-center text-sm text-muted-foreground">
                    Answer key unavailable for this paper. Your selection has been recorded for this session.
                  </div>
                {/if}
              {/if}
            {/if}

            <!-- Action Buttons Footer -->
            <div class="mt-8 compact:mt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-6 compact:pt-4 border-t animate-in fade-in">
              
              <!-- Mobile Navigator (Always accessible) -->
              {#if settingsState.values.showNavigator}
                <Drawer.Root bind:open={isMobileNavigatorOpen}>
                  <Drawer.Trigger>
                    {#snippet child({ props }: { props: Record<string, unknown> })}
                      <Button variant="outline" class="w-full sm:w-auto lg:hidden" {...props}>
                        <LayoutGrid class="mr-2 h-4 w-4" />
                        Navigator
                      </Button>
                    {/snippet}
                  </Drawer.Trigger>
                  <Drawer.Content class="h-[80vh] sm:h-auto sm:max-h-[85vh]">
                    <Drawer.Header>
                      <Drawer.Title>Question Navigator</Drawer.Title>
                      <Drawer.Description>Jump to any question in the test</Drawer.Description>
                    </Drawer.Header>
                    <div class="py-6 overflow-y-auto px-4 sm:px-6">
                      <QuestionNavigator 
                        questions={quiz.state.questions}
                        currentIndex={quiz.state.currentIndex}
                        answers={quiz.state.answers}
                        onGoToQuestion={(idx) => {
                          quiz.goToQuestion(idx);
                          isMobileNavigatorOpen = false;
                        }}
                      />
                    </div>
                  </Drawer.Content>
                </Drawer.Root>
              {:else}
                <div class="hidden sm:block"></div>
              {/if}

              <!-- Primary Action -->
              <div class="w-full sm:w-auto flex flex-col sm:flex-row justify-end gap-3">
                {#if !reviewMode && !forceShowAnswerForCurrent && !quiz.state.answers[quiz.currentQuestion.id]}
                  <Button variant="outline" class="w-full sm:w-auto" onclick={handleShowAnswer}>
                    Show Answer
                  </Button>
                {:else}
                  {#if !reviewMode && forceShowAnswerForCurrent && !quiz.state.answers[quiz.currentQuestion.id]}
                    <Button variant="outline" class="w-full sm:w-auto" onclick={() => forceShowAnswerForCurrent = false}>
                      Hide Answer
                    </Button>
                  {/if}
                  <Button 
                    size="lg" 
                    class="w-full sm:w-auto font-medium"
                    onclick={handleNext}
                  >
                    {#if quiz.state.currentIndex === quiz.state.questions.length - 1}
                      <CircleCheck class="mr-2 h-4 w-4" /> {reviewMode ? "Exit Review" : "Finish Test"}
                    {:else}
                      Next Question <ArrowRight class="ml-2 h-4 w-4" />
                    {/if}
                  </Button>
                {/if}
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Sidebar (Desktop only) -->
        {#if settingsState.values.showNavigator}
          <div class="hidden lg:block lg:w-[35%] xl:w-[30%] shrink-0 sticky top-22">
            <QuizSidebar 
              questions={quiz.state.questions}
              currentIndex={quiz.state.currentIndex}
              answers={quiz.state.answers}
              onGoToQuestion={quiz.goToQuestion}
            />
          </div>
        {/if}

      </main>
    {/if}
  {/if}
</div>

<SubmitConfirmDialog
  bind:open={showConfirmSubmitDialog}
  hasUnansweredQuestions={Object.keys(quiz.state.answers).length < quiz.state.questions.length}
  onSubmit={submitTest}
/>
