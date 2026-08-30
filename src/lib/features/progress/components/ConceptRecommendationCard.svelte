<script lang="ts">
  import type { ConceptStats } from "$lib/features/progress/services/analytics";
  import { Button } from "$lib/components/ui/button/index.js";
  import { TrendingUp, TrendingDown, Minus, BookOpen, AlertCircle } from "@lucide/svelte";
  import { Badge } from "$lib/components/ui/badge/index.js";

  let { stat }: { stat: ConceptStats } = $props();

  const formatName = (id: string) => {
    return id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };
</script>

<div class="bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
  <div class="flex justify-between items-start mb-2">
    <div>
      <h3 class="font-semibold text-lg line-clamp-1" title={formatName(stat.topicId)}>
        {formatName(stat.topicId)}
      </h3>
      <p class="text-xs text-muted-foreground mt-1 line-clamp-1" title={formatName(stat.subjectId)}>
        in {formatName(stat.subjectId)}
      </p>
    </div>
    
    <div class="text-right shrink-0">
      <div class="font-bold text-xl {stat.status === 'Needs Attention' ? 'text-red-600' : 'text-amber-600'}">
        {Math.round(stat.accuracy)}%
      </div>
    </div>
  </div>

  <div class="flex items-center text-sm text-muted-foreground mt-2 mb-4">
    <AlertCircle class="w-4 h-4 mr-1.5 opacity-70" />
    <span>{stat.totalAttempts} questions attempted</span>
  </div>

  <div class="mt-auto pt-4 flex items-center justify-between">
    {#if stat.trend}
      <div class="flex items-center text-xs">
        {#if stat.trend.direction === 'up'}
          <span class="text-emerald-600 font-medium flex items-center bg-emerald-50 px-2 py-1 rounded-full">
            <TrendingUp class="w-3 h-3 mr-1" />
            +{Math.round(stat.trend.difference)}%
          </span>
        {:else if stat.trend.direction === 'down'}
          <span class="text-red-600 font-medium flex items-center bg-red-50 px-2 py-1 rounded-full">
            <TrendingDown class="w-3 h-3 mr-1" />
            -{Math.round(stat.trend.difference)}%
          </span>
        {:else}
          <span class="text-slate-600 font-medium flex items-center bg-slate-50 px-2 py-1 rounded-full">
            <Minus class="w-3 h-3 mr-1" />
            Stable
          </span>
        {/if}
      </div>
    {:else}
      <div></div>
    {/if}

    <Button size="sm" variant="secondary" href={`/ugc-net-cs/practice?subject=${stat.subjectId}&topic=${stat.topicId}`}>
      <BookOpen class="w-4 h-4 mr-2" />
      Practice
    </Button>
  </div>
</div>
