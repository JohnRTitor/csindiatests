<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { BookOpen, CheckSquare } from "@lucide/svelte";

  let {
    mode,
    onModeChange,
  }: { mode: "quiz" | "read"; onModeChange: (m: "quiz" | "read") => void } =
    $props();
</script>

<div class="inline-flex bg-muted p-1 rounded-lg">
  <Button
    variant={mode === "quiz" ? "default" : "ghost"}
    size="sm"
    class="rounded-md"
    onclick={() => onModeChange("quiz")}
  >
    <CheckSquare class="mr-2 h-4 w-4" />
    Quiz Mode
  </Button>
  <Button
    variant={mode === "read" ? "default" : "ghost"}
    size="sm"
    class="rounded-md"
    onclick={() => onModeChange("read")}
  >
    <BookOpen class="mr-2 h-4 w-4" />
    Read Mode
  </Button>
</div>
