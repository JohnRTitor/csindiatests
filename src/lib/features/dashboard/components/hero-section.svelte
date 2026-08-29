<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { ArrowRight, Play } from "@lucide/svelte";

  let { userName = "Student" } = $props();

  const greeting = $derived.by(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  });
</script>

<section class="py-8 md:py-12">
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div class="space-y-2">
      <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
        {greeting}, {userName}.
      </h1>
      <p class="text-lg text-muted-foreground max-w-[600px]">
        Keep building your CS fundamentals. Continue where you left off or start a focused practice session.
      </p>
    </div>
    
    <div class="flex flex-col sm:flex-row gap-3">
      <Button size="lg" class="w-full sm:w-auto font-medium" href="/ugc-net-cs">
        Continue Practice
        <ArrowRight class="ml-2 h-4 w-4" />
      </Button>
      <Button variant="outline" size="lg" class="w-full sm:w-auto font-medium">
        <Play class="mr-2 h-4 w-4" />
        Start a Test
      </Button>
    </div>
  </div>
</section>
