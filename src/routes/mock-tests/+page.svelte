<script lang="ts">
  import AppHeader from "$lib/components/layout/app-header.svelte";
  import AppFooter from "$lib/components/layout/app-footer.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Clock, BrainCircuit, BookOpen } from "@lucide/svelte";
</script>

<svelte:head>
  <title>Mock Tests | CS India Tests</title>
</svelte:head>

<div class="min-h-screen flex flex-col bg-muted/10">
  <AppHeader />
  
  <main class="grow py-12 md:py-16">
    <div class="container mx-auto px-4 max-w-5xl">
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Mock Tests Hub
        </h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
          Simulate the real exam environment. Timed mock tests for comprehensive assessment and exam readiness.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- UGC NET Mock Tests -->
        <section>
          <h2 class="text-2xl font-bold tracking-tight mb-6 flex items-center">
            <BookOpen class="mr-2 h-6 w-6 text-blue-500" /> UGC NET CS
          </h2>
          <Card.Root class="border-primary/50 relative overflow-hidden transition-shadow hover:shadow-md">
            <div class="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              EXAM MODE
            </div>
            <Card.Header>
              <Clock class="h-8 w-8 text-blue-500 mb-2" />
              <Card.Title>Full Mock Test</Card.Title>
              <Card.Description>Timed · 50 questions · 60 mins</Card.Description>
            </Card.Header>
            <Card.Content>
              <p class="text-sm text-muted-foreground mb-4">Simulate the real UGC NET Computer Science exam environment.</p>
              <Button class="w-full bg-blue-600 hover:bg-blue-700 text-white" href="/ugc-net-cs/mock-test">Start UGC NET Mock</Button>
            </Card.Content>
          </Card.Root>
        </section>

        <!-- GATE CS Mock Tests -->
        <section>
          <h2 class="text-2xl font-bold tracking-tight mb-6 flex items-center">
            <BrainCircuit class="mr-2 h-6 w-6 text-amber-500" /> GATE CS
          </h2>
          <Card.Root class="border-primary/50 relative overflow-hidden transition-shadow hover:shadow-md">
            <div class="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              EXAM MODE
            </div>
            <Card.Header>
              <Clock class="h-8 w-8 text-amber-500 mb-2" />
              <Card.Title>Full Mock Test</Card.Title>
              <Card.Description>Timed · 65 questions · 180 mins</Card.Description>
            </Card.Header>
            <Card.Content>
              <p class="text-sm text-muted-foreground mb-4">Simulate the real GATE Computer Science exam environment.</p>
              <Button class="w-full bg-amber-600 hover:bg-amber-700 text-white" href="/gate-cs/mock-test">Start GATE Mock</Button>
            </Card.Content>
          </Card.Root>
        </section>
      </div>
    </div>
  </main>
  
  <AppFooter />
</div>
