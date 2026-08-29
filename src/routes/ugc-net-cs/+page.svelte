<script lang="ts">
  import { onMount } from "svelte";
  import { createQuizStore } from "$lib/stores/quiz.svelte";
  import { mockQuestions } from "$lib/data/questions";
  
  import QuizHeader from "$lib/components/quiz/quiz-header.svelte";
  import QuestionCard from "$lib/components/quiz/question-card.svelte";
  import AnswerOption from "$lib/components/quiz/answer-option.svelte";
  import ExplanationCard from "$lib/components/quiz/explanation-card.svelte";
  import QuizSidebar from "$lib/components/quiz/quiz-sidebar.svelte";
  import QuizResults from "$lib/components/quiz/quiz-results.svelte";
  import QuestionNavigator from "$lib/components/quiz/question-navigator.svelte";

  import { Button } from "$lib/components/ui/button/index.js";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { ArrowRight, LayoutGrid, CheckCircle2 } from "@lucide/svelte";

  // Initialize quiz with mock questions, a timer, and 45 mins
  const quiz = createQuizStore(mockQuestions, true, 45);

  let isMobileNavigatorOpen = $state(false);

  onMount(() => {
    quiz.start();
    
    return () => {
      quiz.reset();
    };
  });

  const handleAnswerSelect = (optionId: string) => {
    if (!quiz.state.answers[quiz.currentQuestion.id]) {
      quiz.answerQuestion(quiz.currentQuestion.id, optionId);
    }
  };

  const handleNext = () => {
    if (quiz.state.currentIndex === quiz.state.questions.length - 1) {
      quiz.complete();
    } else {
      quiz.nextQuestion();
    }
  };
</script>

<svelte:head>
  <title>Practice | csnetschool</title>
</svelte:head>

<div class="min-h-screen bg-muted/10 flex flex-col">
  
  {#if quiz.isCompleted}
    <div class="container mx-auto px-4 flex-grow flex items-center justify-center">
      <QuizResults state={quiz.state} />
    </div>
  {:else if quiz.isStarted}
    
    <QuizHeader 
      currentIndex={quiz.state.currentIndex}
      totalQuestions={quiz.state.questions.length}
      timeRemaining={quiz.state.timeRemaining}
      isTimerPaused={quiz.state.isTimerPaused}
      onPauseTimer={() => quiz.pauseTimer()}
      onResumeTimer={() => quiz.resumeTimer()}
    />

    {#if quiz.state.isTimerPaused}
      <div class="flex-grow flex flex-col items-center justify-center container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-4">Test Paused</h2>
        <p class="text-muted-foreground max-w-md mb-8">Take a breather. The timer is currently stopped.</p>
        <Button size="lg" onclick={() => quiz.resumeTimer()}>Resume Practice</Button>
      </div>
    {:else}
      <main class="flex-grow container mx-auto px-4 py-6 md:py-8 flex gap-8 relative items-start">
        
        <!-- Left Column: Question Area -->
        <div class="w-full lg:w-[65%] xl:w-[70%] max-w-3xl mx-auto lg:mx-0">
          <div class="bg-card rounded-2xl border shadow-sm p-6 sm:p-8 md:p-10 transition-all">
            <QuestionCard 
              question={quiz.currentQuestion}
              index={quiz.state.currentIndex}
            />

            <div class="space-y-3 mt-8">
              {#each quiz.currentQuestion.options as option}
                <AnswerOption 
                  {option}
                  isSelected={quiz.state.answers[quiz.currentQuestion.id] === option.id}
                  isEvaluated={quiz.state.answers[quiz.currentQuestion.id] !== undefined}
                  isCorrect={option.id === quiz.currentQuestion.correctOptionId}
                  onSelect={handleAnswerSelect}
                />
              {/each}
            </div>

            {#if quiz.state.answers[quiz.currentQuestion.id]}
              <ExplanationCard 
                isCorrect={quiz.state.answers[quiz.currentQuestion.id] === quiz.currentQuestion.correctOptionId}
                explanation={quiz.currentQuestion.explanation}
                correctAnswerId={quiz.currentQuestion.correctOptionId}
              />
              
              <div class="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t animate-in fade-in">
                
                <Sheet.Root bind:open={isMobileNavigatorOpen}>
                  <Sheet.Trigger>
                    {#snippet child({ props })}
                      <Button variant="outline" class="w-full sm:w-auto lg:hidden" {...props}>
                        <LayoutGrid class="mr-2 h-4 w-4" />
                        Navigator
                      </Button>
                    {/snippet}
                  </Sheet.Trigger>
                  <Sheet.Content side="bottom" class="h-[80vh] rounded-t-xl sm:h-auto sm:max-h-[85vh]">
                    <Sheet.Header>
                      <Sheet.Title>Question Navigator</Sheet.Title>
                      <Sheet.Description>Jump to any question in the test</Sheet.Description>
                    </Sheet.Header>
                    <div class="py-6 overflow-y-auto">
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
                  </Sheet.Content>
                </Sheet.Root>

                <Button 
                  size="lg" 
                  class="w-full sm:w-auto font-medium ml-auto"
                  onclick={handleNext}
                >
                  {#if quiz.state.currentIndex === quiz.state.questions.length - 1}
                    <CheckCircle2 class="mr-2 h-4 w-4" /> Finish Test
                  {:else}
                    Next Question <ArrowRight class="ml-2 h-4 w-4" />
                  {/if}
                </Button>
              </div>
            {/if}
          </div>
        </div>

        <!-- Right Column: Sidebar (Desktop only) -->
        <div class="hidden lg:block lg:w-[35%] xl:w-[30%] shrink-0 sticky top-[88px]">
          <QuizSidebar 
            questions={quiz.state.questions}
            currentIndex={quiz.state.currentIndex}
            answers={quiz.state.answers}
            onGoToQuestion={quiz.goToQuestion}
          />
        </div>

      </main>
    {/if}
  {/if}
</div>
