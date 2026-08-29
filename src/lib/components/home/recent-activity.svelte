<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { CheckCircle2, LayoutGrid, Timer } from "@lucide/svelte";
  import type { ActivityItem } from "$lib/types";

  let { activities }: { activities: ActivityItem[] } = $props();

  function formatRelativeTime(isoString: string) {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const date = new Date(isoString);
    const now = new Date();
    
    const hoursDiff = Math.round((date.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (Math.abs(hoursDiff) < 24) {
      if (hoursDiff === 0) return "Just now";
      return rtf.format(hoursDiff, 'hour');
    }
    
    const daysDiff = Math.round((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return rtf.format(daysDiff, 'day');
  }

  function getIconForActivity(type: string) {
    switch(type) {
      case 'test': return Timer;
      case 'mixed': return LayoutGrid;
      default: return CheckCircle2;
    }
  }
  
  function getColorForActivity(type: string) {
    switch(type) {
      case 'test': return "text-amber-500 bg-amber-500/10";
      case 'mixed': return "text-blue-500 bg-blue-500/10";
      default: return "text-green-500 bg-green-500/10";
    }
  }
</script>

<section class="mb-12">
  <div class="mb-6">
    <h2 class="text-2xl font-bold tracking-tight text-foreground">Recent Activity</h2>
  </div>

  <Card.Root>
    <Card.Content class="p-0">
      <div class="divide-y">
        {#each activities as activity}
          {@const Icon = getIconForActivity(activity.type)}
          {@const colorClass = getColorForActivity(activity.type)}
          
          <div class="flex items-start sm:items-center p-4 sm:p-6 gap-4 hover:bg-muted/50 transition-colors">
            <div class={`p-2 rounded-full flex-shrink-0 mt-1 sm:mt-0 ${colorClass}`}>
              <Icon class="h-4 w-4" />
            </div>
            
            <div class="flex-grow">
              <p class="font-medium text-sm sm:text-base">{activity.title}</p>
              <p class="text-xs sm:text-sm text-muted-foreground mt-0.5">{formatRelativeTime(activity.timestamp)}</p>
            </div>
            
            {#if activity.score}
              <div class="font-bold text-lg">{activity.score}</div>
            {/if}
          </div>
        {/each}
        
        {#if activities.length === 0}
          <div class="p-8 text-center text-muted-foreground">
            No recent activity to show.
          </div>
        {/if}
      </div>
    </Card.Content>
  </Card.Root>
</section>
