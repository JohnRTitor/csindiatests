<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Progress } from "$lib/components/ui/progress/index.js";
  import { ArrowRight, Clock } from "@lucide/svelte";
  import type { Subject } from "$lib/types";

  let { subjects }: { subjects: Subject[] } = $props();

  function formatRelativeTime(isoString: string) {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const daysDifference = Math.round((new Date(isoString).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysDifference === 0) {
      const hoursDiff = Math.round((new Date(isoString).getTime() - Date.now()) / (1000 * 60 * 60));
      if (hoursDiff === 0) return "Just now";
      return rtf.format(hoursDiff, 'hour');
    }
    
    return rtf.format(daysDifference, 'day');
  }
</script>

<section class="mb-12">
  <div class="flex items-center justify-between mb-6">
    <h2 class="text-2xl font-bold tracking-tight text-foreground">Continue studying</h2>
    <Button variant="link" class="text-muted-foreground">View all paths</Button>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each subjects.slice(0, 3) as subject}
      <Card.Root class="flex flex-col hover:border-primary/50 transition-colors group">
        <Card.Header class="pb-3">
          <Card.Title class="line-clamp-1">{subject.name}</Card.Title>
        </Card.Header>
        <Card.Content class="pb-2 flex-grow">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-muted-foreground">{subject.attemptedQuestions} / {subject.totalQuestions} questions</span>
            <span class="font-medium">{subject.accuracy}% accuracy</span>
          </div>
          <Progress value={subject.progress} class="h-2 mb-4" />
          
          {#if subject.lastPracticed}
            <div class="flex items-center text-xs text-muted-foreground">
              <Clock class="mr-1 h-3 w-3" />
              <span>Practiced {formatRelativeTime(subject.lastPracticed)}</span>
            </div>
          {/if}
        </Card.Content>
        <Card.Footer>
          <Button variant="secondary" class="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" href="/ugc-net-cs">
            Continue
            <ArrowRight class="ml-2 h-4 w-4" />
          </Button>
        </Card.Footer>
      </Card.Root>
    {/each}
  </div>
</section>
