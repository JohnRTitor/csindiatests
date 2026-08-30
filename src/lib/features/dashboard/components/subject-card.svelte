<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { ChevronRight } from "@lucide/svelte";
  import type { Subject } from "$lib/features/exams/types";

  let { subject, href }: { subject: Subject; href: string } = $props();
</script>

<a {href} class="block h-full">
  <Card.Root
    class="hover:bg-accent/50 cursor-pointer transition-colors h-full"
  >
    <Card.Content class="p-4 flex items-center justify-between">
      <div>
        <h3 class="font-medium line-clamp-1">{subject.name}</h3>
        <p class="text-sm text-muted-foreground">
          {subject.totalQuestions} questions
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8 rounded-full shrink-0"
        tabindex={-1}
      >
        <ChevronRight class="h-4 w-4" />
      </Button>
    </Card.Content>
  </Card.Root>
</a>
