<script lang="ts">
  import { CheckCircle2, XCircle } from "@lucide/svelte";
  import RichContentRenderer from "$lib/features/pyq/components/RichContentRenderer.svelte";

  let {
    option,
    isSelected = false,
    isEvaluated = false,
    isCorrect = false,
    isAnswerUnavailable = false,
    onSelect,
  } = $props();

  const isActuallyCorrectOption = $derived(
    isEvaluated && !isAnswerUnavailable && isCorrect,
  );
  const isWrongSelected = $derived(
    isEvaluated && !isAnswerUnavailable && isSelected && !isCorrect,
  );
  const isDisabled = $derived(isEvaluated);

  const getBaseStyles = () => {
    return "relative flex w-full text-left items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200 outline-none";
  };

  const getVariantStyles = () => {
    if (isActuallyCorrectOption) {
      return "border-green-500 bg-green-50 dark:bg-green-500/10 text-green-900 dark:text-green-50";
    }

    if (isWrongSelected) {
      return "border-red-500 bg-red-50 dark:bg-red-500/10 text-red-900 dark:text-red-50";
    }

    if (isSelected) {
      return "border-primary bg-primary/5 text-foreground";
    }

    if (isDisabled) {
      return "border-border/50 bg-background opacity-60";
    }

    return "border-border bg-background hover:border-primary/50 hover:bg-muted/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring text-foreground";
  };
</script>

<button
  class="{getBaseStyles()} {getVariantStyles()}"
  disabled={isDisabled}
  onclick={() => onSelect(option.id)}
>
  <div
    class={`flex items-center justify-center h-6 w-6 rounded-md border text-sm font-bold shrink-0 mt-0.5
    ${isActuallyCorrectOption ? "bg-green-500 border-green-500 text-white" : ""}
    ${isWrongSelected ? "bg-red-500 border-red-500 text-white" : ""}
    ${isSelected && !isEvaluated ? "bg-primary border-primary text-primary-foreground" : ""}
    ${!isSelected && !isEvaluated ? "bg-muted border-border text-muted-foreground" : ""}
    ${!isSelected && isEvaluated && !isActuallyCorrectOption && !isAnswerUnavailable ? "bg-muted/50 border-border/50 text-muted-foreground/50" : ""}
    ${isAnswerUnavailable && isSelected ? "bg-primary border-primary text-primary-foreground" : ""}
    ${isAnswerUnavailable && !isSelected ? "bg-muted/50 border-border/50 text-muted-foreground/50" : ""}
  `}
  >
    {option.id}
  </div>

  <div class="grow text-base pt-0.5">
    {#if option.content}
      <RichContentRenderer content={option.content} />
    {:else if option.text}
      {option.text}
    {/if}
  </div>

  {#if isActuallyCorrectOption}
    <div class="shrink-0 text-green-500 mt-0.5">
      <CheckCircle2 class="h-5 w-5" />
    </div>
  {:else if isWrongSelected}
    <div class="shrink-0 text-red-500 mt-0.5">
      <XCircle class="h-5 w-5" />
    </div>
  {/if}
</button>
