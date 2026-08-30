<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { ArrowRight, BookOpen, BrainCircuit } from "@lucide/svelte";
  import type { Component } from "svelte";

  type ExamCard = {
    title: string;
    description: string;
    icon: Component;
    gradientClass: string;
    iconBgClass: string;
    questionsCount: string;
    subjectsCount: string;
    buttonHref: string;
    buttonText: string;
  };

  const exams = [
    {
      title: "UGC NET Computer Science",
      description: "Practice Computer Science questions, strengthen fundamentals, and prepare for UGC NET.",
      icon: BookOpen,
      gradientClass: "from-blue-500 to-cyan-500",
      iconBgClass: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
      questionsCount: "1,600+",
      subjectsCount: "11",
      buttonHref: "/ugc-net-cs",
      buttonText: "Practice UGC NET CS"
    },
    {
      title: "GATE Computer Science & IT",
      description: "Solve GATE-level Computer Science and IT questions with detailed explanations.",
      icon: BrainCircuit,
      gradientClass: "from-amber-500 to-orange-500",
      iconBgClass: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
      questionsCount: "2,100+",
      subjectsCount: "10",
      buttonHref: "/gate-cs",
      buttonText: "Practice GATE CS"
    }
  ] satisfies ExamCard[];
</script>

<section class="py-12 md:py-16">
  <div class="text-center max-w-2xl mx-auto mb-10">
    <h1 class="text-4xl font-bold tracking-tight mb-4">Choose Your Path</h1>
    <p class="text-xl text-muted-foreground">Select an exam to begin your preparation with our premium practice environment.</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
    {#snippet ExamCard(exam: typeof exams[0])}
      {@const Icon = exam.icon}
      <Card.Root class="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 shadow-md hover:shadow-lg">
        <div class={`h-2 w-full bg-gradient-to-r ${exam.gradientClass}`}></div>
        <Card.Header class="pb-4">
          <div class={`mb-4 inline-flex p-3 rounded-xl ${exam.iconBgClass}`}>
            <Icon class="h-8 w-8" />
          </div>
          <Card.Title class="text-2xl">{exam.title}</Card.Title>
          <Card.Description class="text-base mt-2 text-muted-foreground">
            {exam.description}
          </Card.Description>
        </Card.Header>
        <Card.Content class="space-y-4">
          <div class="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <div class="text-2xl font-bold text-foreground">{exam.questionsCount}</div>
              <div class="text-sm font-medium text-muted-foreground">Questions</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-foreground">{exam.subjectsCount}</div>
              <div class="text-sm font-medium text-muted-foreground">Subjects</div>
            </div>
          </div>
        </Card.Content>
        <Card.Footer class="pt-2 pb-6 gap-3 flex-col sm:flex-row">
          <Button class="w-full" size="lg" href={exam.buttonHref}>
            {exam.buttonText} <ArrowRight class="ml-2 h-4 w-4" />
          </Button>
        </Card.Footer>
      </Card.Root>
    {/snippet}

    {#each exams as exam}
      {@render ExamCard(exam)}
    {/each}
  </div>
</section>
