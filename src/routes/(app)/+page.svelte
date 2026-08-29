<script lang="ts">
  import { onMount } from "svelte";
      
  import ExamSelection from "$lib/features/dashboard/components/exam-selection.svelte";
  import RecentActivity from "$lib/features/dashboard/components/recent-activity.svelte";
  import ProgressOverview from "$lib/features/dashboard/components/progress-overview.svelte";
  import { dashboardDataService } from "$lib/features/dashboard/services/dashboard-data";
  import { testHistoryRepo } from "$lib/features/tests/repositories/test-history";
  import { testAnswersRepo } from "$lib/features/tests/repositories/test-answers";
  import type { ActivityItem, UserProgress } from "$lib/features/progress/types";

  let activityFeed = $state<ActivityItem[]>([]);
  let userProgress = $state<UserProgress | null>(null);

  const loadData = async () => {
    const stats = await dashboardDataService.getStats();
    activityFeed = await dashboardDataService.getRecentActivity(5);
    
    userProgress = {
      totalQuestionsSolved: stats.questionsAttempted,
      overallAccuracy: stats.questionsAttempted > 0 ? Math.round((stats.questionsCorrect / stats.questionsAttempted) * 100) : 0,
      currentStreak: stats.currentStreak,
      testsCompleted: stats.testsCompleted,
      questionsSolvedThisWeek: 0,
    };
  };

  onMount(() => {
    loadData();
  });

  const handleDeleteActivity = async (id: string) => {
    await testHistoryRepo.delete(id);
    await testAnswersRepo.deleteForTest(id);
    await loadData();
  };
</script>

<main class="grow py-8">
    <div class="container mx-auto px-4 sm:px-8 max-w-6xl">
      {#if userProgress}
        <ProgressOverview progress={userProgress} />
      {/if}
      <ExamSelection />
      
      <div class="mt-8 mb-16">
        <RecentActivity activities={activityFeed} onDeleteActivity={handleDeleteActivity} />
      </div>
    </div>
  </main>
