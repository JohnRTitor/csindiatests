<script lang="ts">
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { mockSubjects } from "$lib/features/exams/config/subjects";
  import type { Question } from "$lib/features/exams/types";
  import RichContentRenderer from "$lib/features/pyq/components/RichContentRenderer.svelte";

  let { question, index }: { question: Question; index: number } = $props();

  const subjectName = $derived(
    mockSubjects.find((s) => s.id === question.subjectId)?.name || "Subject",
  );

  const difficultyVariant = $derived(
    question.difficulty === "Easy"
      ? "secondary"
      : question.difficulty === "Medium"
        ? "outline"
        : "destructive",
  );
</script>

<div class="mb-8">
  <div class="flex flex-wrap items-center gap-2 mb-4">
    <Badge
      variant="outline"
      class="text-xs font-normal text-muted-foreground border-border/50"
    >
      {subjectName}
    </Badge>
    {#if question.topic}
      <Badge
        variant="outline"
        class="text-xs font-normal text-muted-foreground border-border/50"
      >
        {question.topic}
      </Badge>
    {/if}
    {#if question.difficulty}
      <Badge variant={difficultyVariant} class="text-xs font-normal">
        {question.difficulty}
      </Badge>
    {/if}
  </div>

  <div class="flex gap-4">
    <div class="text-xl font-bold text-muted-foreground mt-0.5 select-none">
      {index + 1}.
    </div>
    <div class="text-lg sm:text-xl font-medium leading-relaxed grow">
      {#if question.content}
        <RichContentRenderer content={question.content} />
      {:else if question.text}
        {question.text}
      {/if}
    </div>
  </div>
</div>
