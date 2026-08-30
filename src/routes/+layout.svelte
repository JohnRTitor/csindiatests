<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import { ModeWatcher } from "mode-watcher";
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  import { settingsState } from "$lib/features/preferences";

  let { children } = $props();

  $effect(() => {
    // Only run in the browser
    settingsState.init();
  });

  $effect(() => {
    if (typeof document !== 'undefined') {
      const { compactLayout, reduceAnimations } = settingsState.values;
      if (compactLayout) {
        document.body.setAttribute("data-compact", "true");
      } else {
        document.body.removeAttribute("data-compact");
      }
      if (reduceAnimations) {
        document.body.setAttribute("data-reduce-animations", "true");
      } else {
        document.body.removeAttribute("data-reduce-animations");
      }
    }
  });
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<ModeWatcher />
<Toaster />
{@render children()}
