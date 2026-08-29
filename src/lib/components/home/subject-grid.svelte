<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Progress } from "$lib/components/ui/progress/index.js";
  import type { Subject } from "$lib/types";

  let { subjects }: { subjects: Subject[] } = $props();
</script>

<section class="mb-12">
  <div class="mb-6">
    <h2 class="text-2xl font-bold tracking-tight text-foreground">Practice by Subject</h2>
    <p class="text-muted-foreground">UGC NET Computer Science Core Syllabus</p>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {#each subjects as subject}
      <a href="/ugc-net-cs" class="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
        <Card.Root class="h-full hover:shadow-md transition-all duration-200 hover:-translate-y-1">
          <Card.Content class="p-5 flex flex-col h-full">
            <h3 class="font-semibold text-base mb-4 leading-tight line-clamp-2">{subject.name}</h3>
            
            <div class="mt-auto space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">{subject.totalQuestions} Qs</span>
                
                {#if subject.attemptedQuestions > 0}
                  <span class="font-medium text-primary">{subject.accuracy}% Acc</span>
                {/if}
              </div>
              
              {#if subject.progress > 0}
                <Progress value={subject.progress} class="h-1.5" />
              {:else}
                <div class="h-1.5 w-full bg-muted rounded-full"></div>
              {/if}
            </div>
          </Card.Content>
        </Card.Root>
      </a>
    {/each}
  </div>
</section>
