<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { CircleCheck, Target, Flame, Trophy } from "@lucide/svelte";
  import type { Component } from "svelte";
  import type { UserProgress } from "$lib/features/progress/types";

  let { progress }: { progress: UserProgress } = $props();

  type StatCard = {
    title: string;
    icon: Component;
    colorClass: string;
    bgClass: string;
    value: number;
    suffix: string;
    subtitle: string;
  };

  const stats = $derived([
    {
      title: "Questions Solved",
      icon: CircleCheck,
      colorClass: "text-primary",
      bgClass: "bg-primary/10",
      value: progress.totalQuestionsSolved,
      suffix: "",
      subtitle: `+${progress.questionsSolvedThisWeek} this week`
    },
    {
      title: "Accuracy",
      icon: Target,
      colorClass: "text-amber-500",
      bgClass: "bg-amber-500/10",
      value: progress.overallAccuracy,
      suffix: "%",
      subtitle: "Overall average"
    },
    {
      title: "Current Streak",
      icon: Flame,
      colorClass: "text-orange-500",
      bgClass: "bg-orange-500/10",
      value: progress.currentStreak,
      suffix: "days",
      subtitle: "Keep it up!"
    },
    {
      title: "Tests Completed",
      icon: Trophy,
      colorClass: "text-blue-500",
      bgClass: "bg-blue-500/10",
      value: progress.testsCompleted,
      suffix: "",
      subtitle: "Full length tests"
    }
  ] satisfies StatCard[]);
</script>

<section class="mb-12">
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    {#snippet StatCard(stat: typeof stats[0])}
      {@const Icon = stat.icon}
      <Card.Root>
        <Card.Content class="p-6 flex flex-col justify-between h-full">
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm font-medium text-muted-foreground">{stat.title}</span>
            <div class={`p-2 rounded-full ${stat.bgClass} ${stat.colorClass}`}>
              <Icon class="h-4 w-4" />
            </div>
          </div>
          <div>
            <div class="text-3xl font-bold">
              {stat.value}
              {#if stat.suffix === 'days'}
                <span class="text-lg font-semibold text-muted-foreground">days</span>
              {:else}
                {stat.suffix}
              {/if}
            </div>
            <p class="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
          </div>
        </Card.Content>
      </Card.Root>
    {/snippet}

    {#each stats as stat}
      {@render StatCard(stat)}
    {/each}
  </div>
</section>
