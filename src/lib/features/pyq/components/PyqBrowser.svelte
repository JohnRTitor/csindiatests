<script lang="ts">
  import { pyqService } from "$lib/features/pyq/services/pyq-service";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { BookOpen, Calendar, Clock, ArrowRight, SquareCheck } from "@lucide/svelte";

  let { examId = "ugc-net-cs" } = $props<{ examId?: string }>();

  let availablePapers = $derived(pyqService.getAvailablePyqPapers(examId));

  // Group papers by year
  let papersByYear = $derived(availablePapers.reduce(
    (acc, paper) => {
      if (!acc[paper.year]) {
        acc[paper.year] = [];
      }
      acc[paper.year].push(paper);
      return acc;
    },
    {} as Record<number, typeof availablePapers>,
  ));

  let years = $derived(Object.keys(papersByYear)
    .map(Number)
    .sort((a, b) => b - a));
</script>

<div class="space-y-12">
  {#each years as year}
    <section>
      <h2 class="text-2xl font-bold tracking-tight mb-6 flex items-center">
        <Calendar class="mr-2 h-6 w-6 text-primary" />
        {year} Papers
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each papersByYear[year] as paper}
          <Card.Root
            class="hover:border-primary/50 transition-all hover:shadow-md flex flex-col h-full"
          >
            <Card.Header>
              <div class="flex justify-between items-start mb-2">
                <BookOpen class="h-8 w-8 text-blue-500" />
                <span
                  class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary"
                >
                  {paper.questionCount} Qs
                </span>
              </div>
              <Card.Title class="line-clamp-2">{paper.title}</Card.Title>
              <Card.Description>{paper.paper} · {paper.shift}</Card.Description>
            </Card.Header>
            <Card.Content class="grow">
              <div class="flex items-center text-sm text-muted-foreground mb-4">
                <Clock class="mr-1 h-4 w-4" /> Untimed Practice
              </div>
            </Card.Content>
            <Card.Footer class="pt-0 flex gap-2">
              <Button
                variant="outline"
                href="/{examId}/pyq/{paper.year}/{encodeURIComponent(
                  paper.slug || paper.shift,
                )}"
                class="flex-1 justify-center"
              >
                View Paper
              </Button>
              <Button
                href="/{examId}/pyq/{paper.year}/{encodeURIComponent(
                  paper.slug || paper.shift,
                )}?start=true"
                class="flex-1 justify-center"
              >
                Start Quiz <SquareCheck class="h-4 w-4 ml-2" />
              </Button>
            </Card.Footer>
          </Card.Root>
        {/each}
      </div>
    </section>
  {/each}
</div>
