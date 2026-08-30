<script lang="ts">
  import { onMount } from "svelte";
      
  import ExamSelection from "$lib/features/dashboard/components/exam-selection.svelte";
  import RecentActivity from "$lib/features/dashboard/components/recent-activity.svelte";
  import ProgressOverview from "$lib/features/dashboard/components/progress-overview.svelte";
  import QuickPractice from "$lib/features/dashboard/components/quick-practice.svelte";
  import { dashboardDataService } from "$lib/features/dashboard/services/dashboard-data";
  import { testHistoryRepo } from "$lib/features/tests/repositories/test-history";
  import { testAnswersRepo } from "$lib/features/tests/repositories/test-answers";
  import type { ActivityItem, UserProgress } from "$lib/features/progress/types";
  import { mockQuickPracticeOptions } from "$lib/features/progress/data/user-progress";

  let activityFeed = $state<ActivityItem[]>([]);
  let hasMoreActivity = $state(false);
  let userProgress = $state<UserProgress | null>(null);
  let questionsSolvedToday = $state(0);

  const loadData = async () => {
    const stats = await dashboardDataService.getStats();
    const recent = await dashboardDataService.getRecentActivity(5);
    questionsSolvedToday = await dashboardDataService.getQuestionsSolvedToday();
    
    if (recent.length > 4) {
      hasMoreActivity = true;
      activityFeed = recent.slice(0, 4);
    } else {
      hasMoreActivity = false;
      activityFeed = recent;
    }
    
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

      <QuickPractice options={mockQuickPracticeOptions} {questionsSolvedToday} />

      <ExamSelection />
      
      <div class="mt-8 mb-16">
        <RecentActivity activities={activityFeed} onDeleteActivity={handleDeleteActivity} hasMore={hasMoreActivity} />
      </div>
    </div>
  </main>
