<script lang="ts">
  import { gateConfig } from "$lib/features/exams/config/gate-cs";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Target, BookOpen, ChevronRight } from "@lucide/svelte";
  import { getPracticeModes } from "$lib/features/exams/config/practice-modes";
  import PracticeModeCard from "$lib/features/dashboard/components/practice-mode-card.svelte";
  import SubjectCard from "$lib/features/dashboard/components/subject-card.svelte";

  const practiceModes = getPracticeModes("gate-cs");
</script>

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
      <!-- Previous Year Questions -->
      <section>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold tracking-tight flex items-center">
            <BookOpen class="mr-2 h-6 w-6 text-primary" /> Previous Year Questions
          </h2>
        </div>
        <Card.Root class="hover:border-primary/50 transition-colors bg-primary/5">
          <Card.Content class="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 class="text-xl font-bold mb-2">Authentic PYQ Papers</h3>
              <p class="text-muted-foreground max-w-2xl">
                Browse, read, and practice with actual previous year question papers. Understand the real exam pattern and test your readiness.
              </p>
            </div>
            <Button size="lg" class="shrink-0 w-full md:w-auto" href="/gate-cs/pyq">
              Explore PYQs <ChevronRight class="ml-2 w-4 h-4" />
            </Button>
          </Card.Content>
        </Card.Root>
      </section>

      <!-- Practice Modes -->
      <section>
        <h2 class="text-2xl font-bold tracking-tight mb-6 flex items-center mt-12">
          <Target class="mr-2 h-6 w-6 text-primary" /> Practice Modes
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {#each practiceModes as mode}
            <PracticeModeCard {mode} />
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
          {#each gateConfig.subjects as subject}
            <SubjectCard {subject} href={`/gate-cs/subjects/${subject.id}`} />
          {/each}
        </div>
      </section>
    </div>
  </main>
