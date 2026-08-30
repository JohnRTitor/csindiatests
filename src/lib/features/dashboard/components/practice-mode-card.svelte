<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import type { PracticeMode } from "$lib/features/dashboard/types";

  let { mode }: { mode: PracticeMode } = $props();
</script>

<Card.Root
  class={mode.isExamMode
    ? "border-primary/50 bg-primary/5 relative overflow-hidden"
    : "hover:border-primary/50 transition-colors"}
>
  {#if mode.isExamMode}
    <div
      class="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg"
    >
      EXAM MODE
    </div>
  {/if}
  <Card.Header>
    {@const Icon = mode.icon}
    <Icon class={`h-8 w-8 mb-2 ${mode.iconColor}`} />
    <Card.Title>{mode.title}</Card.Title>
    <Card.Description>{mode.description}</Card.Description>
  </Card.Header>
  <Card.Content>
    <p class="text-sm text-muted-foreground mb-4">{mode.content}</p>
    <Button
      class="w-full"
      variant={mode.isExamMode ? "default" : "secondary"}
      href={mode.href}
    >
      {mode.buttonText}
    </Button>
  </Card.Content>
</Card.Root>
