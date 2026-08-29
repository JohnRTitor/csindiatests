<script lang="ts">
  import { onMount } from "svelte";
      import ProgressOverview from "$lib/features/dashboard/components/progress-overview.svelte";
  import { dashboardDataService } from "$lib/features/dashboard/services/dashboard-data";
  import type { UserProgress } from "$lib/features/progress/types";

  let userProgress = $state<UserProgress | null>(null);

  onMount(async () => {
    const stats = await dashboardDataService.getStats();
    
    userProgress = {
      totalQuestionsSolved: stats.questionsAttempted,
      overallAccuracy: stats.questionsAttempted > 0 ? Math.round((stats.questionsCorrect / stats.questionsAttempted) * 100) : 0,
      currentStreak: stats.currentStreak,
      testsCompleted: stats.testsCompleted,
      questionsSolvedThisWeek: 0,
    };
  });
</script>

<svelte:head>
  <title>Progress | CS India Tests</title>
</svelte:head>

<main class="grow py-12 md:py-16">
    <div class="container mx-auto px-4 sm:px-8 max-w-6xl">
      <div class="mb-10">
        <h1 class="text-4xl font-extrabold tracking-tight mb-4">
          Your Progress
        </h1>
        <p class="text-xl text-muted-foreground">
          Track your preparation, accuracy, and recent activity.
        </p>
      </div>

      {#if userProgress}
        <ProgressOverview progress={userProgress} />
      {:else}
        <div class="flex items-center justify-center p-12 text-muted-foreground">
          Loading progress data...
        </div>
      {/if}
    </div>
  </main>
