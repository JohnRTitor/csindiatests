<script lang="ts">
  import PyqBrowser from "$lib/features/pyq/components/PyqBrowser.svelte";
    </script>

<main class="grow">
    <!-- Hero Section -->
    <section class="bg-card border-b py-12 md:py-16">
      <div class="container mx-auto px-4 max-w-5xl text-center">
        <div
          class="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6"
        >
          Previous Year Questions
        </div>
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          UGC NET Computer Science PYQs
        </h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
          Practice with authentic previous year examination papers to understand
          the exam pattern and test your readiness.
        </p>
      </div>
    </section>

    <div class="container mx-auto px-4 py-12 max-w-5xl">
      <PyqBrowser />
    </div>
  </main>
