<script lang="ts">
  import {
    gateConfig,
    gateQuestions,
  } from "$lib/features/exams/config/gate-cs";
  import AppHeader from "$lib/components/layout/app-header.svelte";
  import AppFooter from "$lib/components/layout/app-footer.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Clock, Zap, Target, BookOpen, ChevronRight } from "@lucide/svelte";
</script>

<div class="min-h-screen flex flex-col bg-muted/20">
  <AppHeader />

  <main class="grow">
    <!-- Hero Section -->
    <section class="bg-card border-b py-12 md:py-16">
      <div class="container mx-auto px-4 max-w-5xl text-center">
        <div
          class="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6"
        >
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

        {#snippet PracticeModeCard(mode: any)}
          {@const Icon = mode.icon}
          <Card.Root
            class={mode.isExamMode
              ? "border-primary/50 bg-primary/5 relative overflow-hidden"
              : "hover:border-primary/50 transition-colors"}
          >
            {#if mode.isExamMode}
              <div
                class="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg"
              >
                EXAM MODE
              </div>
            {/if}
            <Card.Header>
              <Icon class={`h-8 w-8 mb-2 ${mode.iconColor}`} />
              <Card.Title>{mode.title}</Card.Title>
              <Card.Description>{mode.description}</Card.Description>
            </Card.Header>
            <Card.Content>
              <p class="text-sm text-muted-foreground mb-4">{mode.content}</p>
              <Button
                class="w-full"
                variant={mode.isExamMode ? "default" : "secondary"}
                href={mode.href}>{mode.buttonText}</Button
              >
            </Card.Content>
          </Card.Root>
        {/snippet}

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {#each [{ title: "Quick Practice", description: "10 questions", content: "Warm up with a fast conceptual revision.", href: "/gate-cs/practice/quick", buttonText: "Start Quick", icon: Zap, iconColor: "text-amber-500", isExamMode: false }, { title: "Focused Practice", description: "25 questions", content: "A balanced session for deep analytical problem solving.", href: "/gate-cs/practice/focused", buttonText: "Start Focused", icon: Target, iconColor: "text-blue-500", isExamMode: false }, { title: "Full Practice", description: "50 questions", content: "Comprehensive untimed practice across core GATE subjects.", href: "/gate-cs/practice/full", buttonText: "Start Full", icon: BookOpen, iconColor: "text-indigo-500", isExamMode: false }, { title: "Mock Test", description: "Timed · 65 questions", content: "Simulate the real GATE exam environment (3 hours).", href: "/gate-cs/mock-test", buttonText: "Start Mock Test", icon: Clock, iconColor: "text-primary", isExamMode: true }] as mode}
            {@render PracticeModeCard(mode)}
          {/each}
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
          {#snippet SubjectCard(subject: any)}
            <a href={`/gate-cs/subjects/${subject.id}`} class="block h-full">
              <Card.Root
                class="hover:bg-accent/50 cursor-pointer transition-colors h-full"
              >
                <Card.Content class="p-4 flex items-center justify-between">
                  <div>
                    <h3 class="font-medium line-clamp-1">{subject.name}</h3>
                    <p class="text-sm text-muted-foreground">
                      {subject.totalQuestions} questions
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="h-8 w-8 rounded-full shrink-0"
                  >
                    <ChevronRight class="h-4 w-4" />
                  </Button>
                </Card.Content>
              </Card.Root>
            </a>
          {/snippet}

          {#each gateConfig.subjects as subject}
            {@render SubjectCard(subject)}
          {/each}
        </div>
      </section>
    </div>
  </main>
  <AppFooter />
</div>
