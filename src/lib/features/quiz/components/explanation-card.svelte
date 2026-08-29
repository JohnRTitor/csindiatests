<script lang="ts">
  import { CheckCircle2, XCircle, Info } from "@lucide/svelte";
  
  let { isCorrect, explanation, correctAnswerId } = $props();
</script>

<div class={`mt-8 rounded-xl border overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 ${isCorrect ? 'border-green-200 dark:border-green-900/50 bg-green-50/50 dark:bg-green-900/10' : 'border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10'}`}>
  
  <div class={`px-5 py-3 border-b flex items-center gap-2 font-semibold ${isCorrect ? 'bg-green-100/50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-900/50' : 'bg-red-100/50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-900/50'}`}>
    {#if isCorrect}
      <CheckCircle2 class="h-5 w-5" />
      <span>Correct</span>
    {:else}
      <XCircle class="h-5 w-5" />
      <span>Incorrect — Correct Answer is {correctAnswerId}</span>
    {/if}
  </div>
  
  <div class="p-5 sm:p-6 bg-card text-card-foreground">
    <div class="flex gap-3 mb-2 items-start">
      <div class="text-primary shrink-0 mt-0.5">
        <Info class="h-5 w-5" />
      </div>
      <h4 class="font-semibold text-lg">Explanation</h4>
    </div>
    
    <div class="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-muted-foreground ml-8 leading-relaxed">
      <p>{explanation}</p>
    </div>
  </div>
</div>
