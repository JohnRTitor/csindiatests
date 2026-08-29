<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import type { Subject, UserProgress } from "$lib/types";

  let { subjects, progress }: { subjects: Subject[], progress: UserProgress } = $props();

  const sortedSubjects = $derived([...subjects].filter(s => s.attemptedQuestions > 0).sort((a, b) => b.accuracy - a.accuracy));
  const bestSubject = $derived(sortedSubjects.length > 0 ? sortedSubjects[0] : null);
  const weakestSubject = $derived(sortedSubjects.length > 0 ? sortedSubjects[sortedSubjects.length - 1] : null);
</script>

<section class="mb-12">
  <div class="mb-6">
    <h2 class="text-2xl font-bold tracking-tight text-foreground">Performance Insights</h2>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    
    <Card.Root class="md:col-span-2">
      <Card.Header>
        <Card.Title>Accuracy by Subject</Card.Title>
        <Card.Description>Your performance across topics</Card.Description>
      </Card.Header>
      <Card.Content>
        <div class="space-y-4">
          {#each sortedSubjects.slice(0, 5) as subject}
            <div class="space-y-1">
              <div class="flex justify-between text-sm">
                <span class="font-medium">{subject.name}</span>
                <span class="text-muted-foreground">{subject.accuracy}%</span>
              </div>
              <div class="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  class="h-full bg-primary rounded-full transition-all duration-500"
                  style="width: {subject.accuracy}%"
                ></div>
              </div>
            </div>
          {/each}
          
          {#if sortedSubjects.length === 0}
            <div class="text-center py-8 text-muted-foreground text-sm">
              Complete more questions to see your accuracy breakdown.
            </div>
          {/if}
        </div>
      </Card.Content>
    </Card.Root>

    <div class="space-y-6">
      <Card.Root>
        <Card.Content class="p-6">
          <h3 class="text-sm font-medium text-muted-foreground mb-1">Strongest Area</h3>
          {#if bestSubject}
            <div class="text-lg font-bold line-clamp-1">{bestSubject.name}</div>
            <div class="text-sm text-green-600 dark:text-green-500 font-medium mt-1">{bestSubject.accuracy}% accuracy</div>
          {:else}
            <div class="text-lg font-medium text-muted-foreground">Not enough data</div>
          {/if}
        </Card.Content>
      </Card.Root>

      <Card.Root>
        <Card.Content class="p-6">
          <h3 class="text-sm font-medium text-muted-foreground mb-1">Needs Review</h3>
          {#if weakestSubject && weakestSubject.accuracy < 60}
            <div class="text-lg font-bold line-clamp-1">{weakestSubject.name}</div>
            <div class="text-sm text-amber-600 dark:text-amber-500 font-medium mt-1">{weakestSubject.accuracy}% accuracy</div>
          {:else if weakestSubject}
            <div class="text-lg font-medium text-muted-foreground">You're doing great everywhere!</div>
          {:else}
            <div class="text-lg font-medium text-muted-foreground">Not enough data</div>
          {/if}
        </Card.Content>
      </Card.Root>
    </div>
    
  </div>
</section>
