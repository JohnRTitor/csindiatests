<script lang="ts">
  import { goto } from "$app/navigation";
  import PyqViewer from "$lib/features/pyq/components/PyqViewer.svelte";
  import { gateConfig } from "$lib/features/exams/config/gate-cs";

  let { data } = $props();

  function handleExit() {
    goto("/gate-cs/pyq");
  }
</script>

<PyqViewer 
  questions={data.questions} 
  manifest={data.manifest} 
  examConfig={gateConfig}
  onExit={handleExit} 
/>
