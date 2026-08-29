<script lang="ts">
  import { onMount } from "svelte";
  import AppHeader from "$lib/components/layout/app-header.svelte";
  import AppFooter from "$lib/components/layout/app-footer.svelte";
  
  import ExamSelection from "$lib/features/dashboard/components/exam-selection.svelte";
  import RecentActivity from "$lib/features/dashboard/components/recent-activity.svelte";
  import ProgressOverview from "$lib/features/dashboard/components/progress-overview.svelte";
  import { dashboardDataService } from "$lib/features/dashboard/services/dashboard-data";
  import type { ActivityItem, UserProgress } from "$lib/features/progress/types";

  let activityFeed = $state<ActivityItem[]>([]);
  let userProgress = $state<UserProgress | null>(null);

  onMount(async () => {
    const stats = await dashboardDataService.getStats();
    activityFeed = await dashboardDataService.getRecentActivity(5);
    
    userProgress = {
      totalQuestionsSolved: stats.questionsAttempted,
      overallAccuracy: stats.questionsAttempted > 0 ? Math.round((stats.questionsCorrect / stats.questionsAttempted) * 100) : 0,
      currentStreak: stats.currentStreak,
      testsCompleted: stats.testsCompleted,
      questionsSolvedThisWeek: 0,
    };
  });
</script>

<div class="min-h-screen flex flex-col bg-muted/10">
  <AppHeader />
  
  <main class="grow py-8">
    <div class="container mx-auto px-4 sm:px-8 max-w-6xl">
      {#if userProgress}
        <ProgressOverview progress={userProgress} />
      {/if}
      <ExamSelection />
      
      <div class="mt-8 mb-16">
        <RecentActivity activities={activityFeed} />
      </div>
    </div>
  </main>
  
  <AppFooter />
</div>
