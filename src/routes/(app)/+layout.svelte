<script lang="ts">
  import AppHeader from "$lib/components/layout/app-header.svelte";
  import AppFooter from "$lib/components/layout/app-footer.svelte";
  let { children } = $props();
</script>

<div class="min-h-screen flex flex-col bg-background text-foreground">
  <AppHeader />
  <div class="grow flex flex-col">
    {@render children()}
  </div>
  <AppFooter />
</div>
