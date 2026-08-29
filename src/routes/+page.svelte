<script lang="ts">
  import AppHeader from "$lib/components/app-header.svelte";
  import AppFooter from "$lib/components/app-footer.svelte";
  
  import HeroSection from "$lib/components/home/hero-section.svelte";
  import ProgressOverview from "$lib/components/home/progress-overview.svelte";
  import ContinueStudying from "$lib/components/home/continue-studying.svelte";
  import QuickPractice from "$lib/components/home/quick-practice.svelte";
  import SubjectGrid from "$lib/components/home/subject-grid.svelte";
  import StudyInsights from "$lib/components/home/study-insights.svelte";
  import RecentActivity from "$lib/components/home/recent-activity.svelte";

  import { mockUserProgress, mockActivityFeed, mockQuickPracticeOptions, getActiveSubjects } from "$lib/data/user-progress";
  import { mockSubjects } from "$lib/data/subjects";

  const activeSubjects = getActiveSubjects();
</script>

<div class="min-h-screen flex flex-col">
  <AppHeader />
  
  <main class="flex-grow">
    <div class="container mx-auto px-4 sm:px-8 max-w-6xl">
      <HeroSection userName="Masum" />
      
      <ProgressOverview progress={mockUserProgress} />
      
      {#if activeSubjects.length > 0}
        <ContinueStudying subjects={activeSubjects} />
      {/if}
      
      <QuickPractice options={mockQuickPracticeOptions} />
      
      <SubjectGrid subjects={mockSubjects} />
      
      <StudyInsights subjects={mockSubjects} progress={mockUserProgress} />
      
      <RecentActivity activities={mockActivityFeed} />
    </div>
  </main>
  
  <AppFooter />
</div>
