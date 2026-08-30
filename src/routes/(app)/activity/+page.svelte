<script lang="ts">
  import { onMount } from "svelte";
  import RecentActivity from "$lib/features/dashboard/components/recent-activity.svelte";
  import { dashboardDataService } from "$lib/features/dashboard/services/dashboard-data";
  import { testHistoryRepo } from "$lib/features/tests/repositories/test-history";
  import { testAnswersRepo } from "$lib/features/tests/repositories/test-answers";
  import type { ActivityItem } from "$lib/features/progress/types";

  let activityFeed = $state<ActivityItem[]>([]);

  const loadData = async () => {
    // Fetch a larger number of activities for the dedicated page
    activityFeed = await dashboardDataService.getRecentActivity(50);
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

<svelte:head>
  <title>Recent Activity | CS India Tests</title>
</svelte:head>

<main class="grow py-8 md:py-12">
  <div class="container mx-auto px-4 sm:px-8 max-w-4xl">
    <div class="mb-8">
      <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
        Activity History
      </h1>
      <p class="text-lg text-muted-foreground">
        Review your past practice sessions and mock tests.
      </p>
    </div>

    <RecentActivity activities={activityFeed} onDeleteActivity={handleDeleteActivity} />
  </div>
</main>
