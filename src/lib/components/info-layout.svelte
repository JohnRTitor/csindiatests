<script lang="ts">
  import PublicHeader from "./public-header.svelte";
  import PublicFooter from "./public-footer.svelte";

  let { children, maxWidth = "max-w-3xl" } = $props();
</script>

<div class="min-h-screen flex flex-col bg-background text-foreground">
  <PublicHeader />
  
  <main class="flex-grow py-12 md:py-20 px-4 sm:px-6">
    <div class="container mx-auto {maxWidth}">
      {@render children()}
    </div>
  </main>
  
  <PublicFooter />
</div>
