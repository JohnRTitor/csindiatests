<script lang="ts">
  import SEO from "$lib/components/SEO.svelte";
  import { onMount } from "svelte";
  import ProgressOverview from "$lib/features/dashboard/components/progress-overview.svelte";
  import SubjectPerformanceCard from "$lib/features/progress/components/SubjectPerformanceCard.svelte";
  import ConceptRecommendationCard from "$lib/features/progress/components/ConceptRecommendationCard.svelte";
  
  import { dashboardDataService } from "$lib/features/dashboard/services/dashboard-data";
  import { questionAttemptsRepo } from "$lib/features/progress/repositories/question-attempts";
  import { 
    aggregateBySubject, 
    aggregateByConcept, 
    getRecommendedPractice, 
    getStrongConcepts,
    type SubjectStats,
    type ConceptStats
  } from "$lib/features/progress/services/analytics";
  import type { UserProgress } from "$lib/features/progress/types";

  let userProgress = $state<UserProgress | null>(null);
  let subjectStats = $state<SubjectStats[]>([]);
  let conceptStats = $state<ConceptStats[]>([]);
  let recommendedConcepts = $state<ConceptStats[]>([]);
  let strongConcepts = $state<ConceptStats[]>([]);
  let isLoading = $state(true);
  let hasData = $state(false);

  onMount(async () => {
    // Load overall stats
    const stats = await dashboardDataService.getStats();
    
    userProgress = {
      totalQuestionsSolved: stats.questionsAttempted,
      overallAccuracy: stats.questionsAttempted > 0 ? Math.round((stats.questionsCorrect / stats.questionsAttempted) * 100) : 0,
      currentStreak: stats.currentStreak,
      testsCompleted: stats.testsCompleted,
      questionsSolvedThisWeek: 0,
    };

    // Load question attempts
    const allAttempts = await questionAttemptsRepo.getAll();
    hasData = allAttempts.length > 0;

    // Calculate diagnostic analytics
    subjectStats = aggregateBySubject(allAttempts).sort((a, b) => b.totalAttempts - a.totalAttempts);
    conceptStats = aggregateByConcept(allAttempts);
    
    recommendedConcepts = getRecommendedPractice(conceptStats).slice(0, 6);
    strongConcepts = getStrongConcepts(conceptStats).slice(0, 6);

    isLoading = false;
  });
</script>

<SEO title="Progress & Diagnostics" noindex={true} />

<main class="grow py-12 md:py-16">
  <div class="container mx-auto px-4 sm:px-8 max-w-6xl">
    
    <div class="mb-10">
      <h1 class="text-4xl font-extrabold tracking-tight mb-4">
        Performance Diagnostics
      </h1>
      <p class="text-xl text-muted-foreground">
        Track your overall progress, identify weak areas, and know what to practice next.
      </p>
    </div>

    {#if isLoading}
      <div class="flex items-center justify-center p-12 text-muted-foreground">
        Loading diagnostic data...
      </div>
    {:else}
      
      {#if userProgress}
        <div class="mb-12">
          <h2 class="text-2xl font-bold mb-6">Overall Performance</h2>
          <ProgressOverview progress={userProgress} />
        </div>
      {/if}

      {#if !hasData}
        <div class="bg-card border rounded-2xl p-12 text-center shadow-sm">
          <h2 class="text-2xl font-bold mb-4">No performance data yet</h2>
          <p class="text-muted-foreground mb-8 max-w-md mx-auto">
            Complete a practice test to see your subject performance, concept strengths, areas needing practice, and improvement trends.
          </p>
        </div>
      {:else}

        {#if recommendedConcepts.length > 0}
          <div class="mb-12">
            <h2 class="text-2xl font-bold mb-6 flex items-baseline">
              Needs Attention <span class="ml-3 text-sm font-normal text-muted-foreground">Focus your practice here</span>
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {#each recommendedConcepts as concept}
                <ConceptRecommendationCard stat={concept} />
              {/each}
            </div>
          </div>
        {/if}

        {#if subjectStats.length > 0}
          <div class="mb-12">
            <h2 class="text-2xl font-bold mb-6">Subject Performance</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              {#each subjectStats as stat}
                <SubjectPerformanceCard {stat} />
              {/each}
            </div>
          </div>
        {/if}

        {#if strongConcepts.length > 0}
          <div class="mb-12">
            <h2 class="text-2xl font-bold mb-6">Your Strong Areas</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {#each strongConcepts as concept}
                <ConceptRecommendationCard stat={concept} />
              {/each}
            </div>
          </div>
        {/if}

      {/if}
      
    {/if}
  </div>
</main>
