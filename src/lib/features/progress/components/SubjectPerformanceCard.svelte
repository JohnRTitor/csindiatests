<script lang="ts">
  import type { SubjectStats } from "$lib/features/progress/services/analytics";
  import { Progress } from "$lib/components/ui/progress/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { TrendingUp, TrendingDown, Minus } from "@lucide/svelte";

  let { stat }: { stat: SubjectStats } = $props();

  const formatName = (id: string) => {
    return id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Strong': return 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20';
      case 'Good': return 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20';
      case 'Needs Practice': return 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20';
      case 'Needs Attention': return 'bg-red-500/10 text-red-600 hover:bg-red-500/20';
      default: return 'bg-slate-500/10 text-slate-600 hover:bg-slate-500/20';
    }
  };
</script>

<div class="bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
  <div class="flex justify-between items-start mb-3">
    <div>
      <h3 class="font-semibold text-lg">{formatName(stat.subjectId)}</h3>
      <p class="text-sm text-muted-foreground mt-1">
        {stat.correctAttempts} / {stat.totalAttempts} correct
      </p>
    </div>
    <div class="flex flex-col items-end gap-2">
      <div class="font-bold text-2xl">{Math.round(stat.accuracy)}%</div>
      <Badge variant="secondary" class={getStatusColor(stat.status)}>
        {stat.status}
      </Badge>
    </div>
  </div>

  <div class="mt-4">
    <Progress value={stat.accuracy} class="h-2" />
  </div>

  {#if stat.trend}
    <div class="mt-4 pt-4 border-t flex items-center text-sm">
      <span class="text-muted-foreground mr-2">Recent trend:</span>
      {#if stat.trend.direction === 'up'}
        <span class="text-emerald-600 font-medium flex items-center">
          <TrendingUp class="w-4 h-4 mr-1" />
          +{Math.round(stat.trend.difference)}%
        </span>
      {:else if stat.trend.direction === 'down'}
        <span class="text-red-600 font-medium flex items-center">
          <TrendingDown class="w-4 h-4 mr-1" />
          -{Math.round(stat.trend.difference)}%
        </span>
      {:else}
        <span class="text-slate-600 font-medium flex items-center">
          <Minus class="w-4 h-4 mr-1" />
          Stable
        </span>
      {/if}
    </div>
  {/if}
</div>
