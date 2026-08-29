<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { CheckCircle2, Target, Flame, Trophy } from "@lucide/svelte";
  import type { UserProgress } from "$lib/types";

  let { progress }: { progress: UserProgress } = $props();
</script>

<section class="mb-12">
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    
    <Card.Root>
      <Card.Content class="p-6 flex flex-col justify-between h-full">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-medium text-muted-foreground">Questions Solved</span>
          <div class="p-2 bg-primary/10 rounded-full text-primary">
            <CheckCircle2 class="h-4 w-4" />
          </div>
        </div>
        <div>
          <div class="text-3xl font-bold">{progress.totalQuestionsSolved}</div>
          <p class="text-xs text-muted-foreground mt-1">+{progress.questionsSolvedThisWeek} this week</p>
        </div>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Content class="p-6 flex flex-col justify-between h-full">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-medium text-muted-foreground">Accuracy</span>
          <div class="p-2 bg-amber-500/10 rounded-full text-amber-500">
            <Target class="h-4 w-4" />
          </div>
        </div>
        <div>
          <div class="text-3xl font-bold">{progress.overallAccuracy}%</div>
          <p class="text-xs text-muted-foreground mt-1">Overall average</p>
        </div>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Content class="p-6 flex flex-col justify-between h-full">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-medium text-muted-foreground">Current Streak</span>
          <div class="p-2 bg-orange-500/10 rounded-full text-orange-500">
            <Flame class="h-4 w-4" />
          </div>
        </div>
        <div>
          <div class="text-3xl font-bold">{progress.currentStreak} <span class="text-lg font-semibold text-muted-foreground">days</span></div>
          <p class="text-xs text-muted-foreground mt-1">Keep it up!</p>
        </div>
      </Card.Content>
    </Card.Root>

    <Card.Root>
      <Card.Content class="p-6 flex flex-col justify-between h-full">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-medium text-muted-foreground">Tests Completed</span>
          <div class="p-2 bg-blue-500/10 rounded-full text-blue-500">
            <Trophy class="h-4 w-4" />
          </div>
        </div>
        <div>
          <div class="text-3xl font-bold">{progress.testsCompleted}</div>
          <p class="text-xs text-muted-foreground mt-1">Full length tests</p>
        </div>
      </Card.Content>
    </Card.Root>

  </div>
</section>
