<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Progress } from "$lib/components/ui/progress/index.js";
  import { Zap, Timer } from "@lucide/svelte";
  import type { QuickPracticeOption } from "$lib/features/dashboard/types";
  import { settingsState } from "$lib/features/preferences";

  let { options, questionsSolvedToday = 0 }: { options: QuickPracticeOption[], questionsSolvedToday?: number } = $props();

  let dailyGoal = $derived(settingsState.values.dailyQuestionGoal);
  let progressPercent = $derived(dailyGoal > 0 ? Math.min(100, Math.round((questionsSolvedToday / dailyGoal) * 100)) : 0);
</script>

<section class="mb-12">
  <div class="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
    <div>
      <h2 class="text-2xl font-bold tracking-tight text-foreground">Quick Practice</h2>
      <p class="text-muted-foreground">Start a session immediately</p>
    </div>
    
    {#if dailyGoal > 0}
      <div class="w-full sm:w-64 space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-muted-foreground font-medium">Daily Goal</span>
          <span class="font-bold">{questionsSolvedToday} / {dailyGoal} <span class="text-muted-foreground font-normal">Qs</span></span>
        </div>
        <Progress value={progressPercent} class="h-2" />
      </div>
    {/if}
  </div>

  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    {#each options as option}
      <a href="/ugc-net-cs" class="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl group">
        <Card.Root class="h-full hover:border-primary/50 transition-all duration-200 cursor-pointer">
          <Card.Content class="p-5 flex flex-col items-center text-center justify-center h-full gap-3">
            <div class={`p-3 rounded-full ${option.isTimed ? 'bg-blue-500/10 text-blue-500' : 'bg-primary/10 text-primary'} group-hover:scale-110 transition-transform`}>
              {#if option.isTimed}
                <Timer class="h-6 w-6" />
              {:else}
                <Zap class="h-6 w-6" />
              {/if}
            </div>
            
            <div>
              <h3 class="font-bold text-lg">{option.title}</h3>
              <p class="text-sm text-muted-foreground">{option.description}</p>
            </div>
          </Card.Content>
        </Card.Root>
      </a>
    {/each}
  </div>
</section>
