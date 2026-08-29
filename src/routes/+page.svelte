<script lang="ts">
  import AppHeader from "$lib/components/layout/app-header.svelte";
  import AppFooter from "$lib/components/layout/app-footer.svelte";
  
  import ExamSelection from "$lib/features/dashboard/components/exam-selection.svelte";
  import RecentActivity from "$lib/features/dashboard/components/recent-activity.svelte";

  import { mockActivityFeed } from "$lib/features/progress/data/user-progress";
</script>

<div class="min-h-screen flex flex-col bg-muted/10">
  <AppHeader />
  
  <main class="flex-grow">
    <div class="container mx-auto px-4 sm:px-8 max-w-6xl">
      <ExamSelection />
      
      <div class="mt-8 mb-16">
        <RecentActivity activities={mockActivityFeed} />
      </div>
    </div>
  </main>
  
  <AppFooter />
</div>
