<script lang="ts">
  import { gateConfig, gateQuestions } from "$lib/features/exams/config/gate-cs";
  import type { QuizMode } from "$lib/features/quiz/types";
  import QuizShell from "$lib/features/quiz/components/QuizShell.svelte";
  import AppHeader from "$lib/components/layout/app-header.svelte";
  import AppFooter from "$lib/components/layout/app-footer.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Clock, Zap, Target, BookOpen, ChevronRight } from "@lucide/svelte";

  let isQuizActive = $state(false);
  let selectedMode = $state<QuizMode>("practice");
  let selectedQuestions = $state(gateQuestions);
  
  // Clone config so we can dynamically adjust duration if needed
  let activeConfig = $state({ ...gateConfig });

  function startPractice(count: number, mode: QuizMode) {
    selectedMode = mode;
    // For demonstration, we just take the first N questions from our mock data
    selectedQuestions = gateQuestions.slice(0, count);
    
    // Adjust duration based on mode
    if (mode === "timed") {
       activeConfig.defaultDuration = 180; // 180 mins for GATE Mock
    }
    
    isQuizActive = true;
  }

  function handleExit() {
    isQuizActive = false;
  }
</script>

{#if isQuizActive}
  <QuizShell 
    examConfig={activeConfig} 
    questions={selectedQuestions} 
    mode={selectedMode} 
    onExit={handleExit} 
  />
{:else}
  <div class="min-h-screen flex flex-col bg-muted/20">
    <AppHeader />
    
    <main class="flex-grow">
      <!-- Hero Section -->
      <section class="bg-card border-b py-12 md:py-16">
        <div class="container mx-auto px-4 max-w-5xl text-center">
          <div class="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            Advanced Preparation
          </div>
          <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {gateConfig.name}
          </h1>
          <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
            {gateConfig.description}
          </p>
        </div>
      </section>

      <div class="container mx-auto px-4 py-12 max-w-5xl space-y-12">
        
        <!-- Practice Modes -->
        <section>
          <h2 class="text-2xl font-bold tracking-tight mb-6 flex items-center">
            <Target class="mr-2 h-6 w-6 text-primary" /> Practice Modes
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <Card.Root class="hover:border-primary/50 transition-colors">
              <Card.Header>
                <Zap class="h-8 w-8 text-amber-500 mb-2" />
                <Card.Title>Quick Practice</Card.Title>
                <Card.Description>10 questions</Card.Description>
              </Card.Header>
              <Card.Content>
                <p class="text-sm text-muted-foreground mb-4">Warm up with a fast conceptual revision.</p>
                <Button class="w-full" variant="secondary" onclick={() => startPractice(10, "practice")}>Start Quick</Button>
              </Card.Content>
            </Card.Root>

            <Card.Root class="hover:border-primary/50 transition-colors">
              <Card.Header>
                <Target class="h-8 w-8 text-blue-500 mb-2" />
                <Card.Title>Focused Practice</Card.Title>
                <Card.Description>25 questions</Card.Description>
              </Card.Header>
              <Card.Content>
                <p class="text-sm text-muted-foreground mb-4">A balanced session for deep analytical problem solving.</p>
                <Button class="w-full" variant="secondary" onclick={() => startPractice(25, "practice")}>Start Focused</Button>
              </Card.Content>
            </Card.Root>

            <Card.Root class="hover:border-primary/50 transition-colors">
              <Card.Header>
                <BookOpen class="h-8 w-8 text-indigo-500 mb-2" />
                <Card.Title>Full Practice</Card.Title>
                <Card.Description>50 questions</Card.Description>
              </Card.Header>
              <Card.Content>
                <p class="text-sm text-muted-foreground mb-4">Comprehensive untimed practice across core GATE subjects.</p>
                <Button class="w-full" variant="secondary" onclick={() => startPractice(50, "practice")}>Start Full</Button>
              </Card.Content>
            </Card.Root>

            <Card.Root class="border-primary/50 bg-primary/5 relative overflow-hidden">
              <div class="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                EXAM MODE
              </div>
              <Card.Header>
                <Clock class="h-8 w-8 text-primary mb-2" />
                <Card.Title>Mock Test</Card.Title>
                <Card.Description>Timed · 65 questions</Card.Description>
              </Card.Header>
              <Card.Content>
                <p class="text-sm text-muted-foreground mb-4">Simulate the real GATE exam environment (3 hours).</p>
                <Button class="w-full" onclick={() => startPractice(65, "timed")}>Start Mock Test</Button>
              </Card.Content>
            </Card.Root>

          </div>
        </section>

        <!-- Subjects -->
        <section>
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold tracking-tight flex items-center">
              <BookOpen class="mr-2 h-6 w-6 text-primary" /> Practice by Subject
            </h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each gateConfig.subjects as subject}
              <Card.Root class="hover:bg-accent/50 cursor-pointer transition-colors" onclick={() => startPractice(10, "practice")}>
                <Card.Content class="p-4 flex items-center justify-between">
                  <div>
                    <h3 class="font-medium line-clamp-1">{subject.name}</h3>
                    <p class="text-sm text-muted-foreground">{subject.totalQuestions} questions</p>
                  </div>
                  <Button variant="ghost" size="icon" class="h-8 w-8 rounded-full shrink-0">
                    <ChevronRight class="h-4 w-4" />
                  </Button>
                </Card.Content>
              </Card.Root>
            {/each}
          </div>
        </section>

      </div>
    </main>
    <AppFooter />
  </div>
{/if}
