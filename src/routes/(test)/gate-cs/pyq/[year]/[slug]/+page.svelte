<script lang="ts">
  import SEO from "$lib/components/SEO.svelte";
  import { goto } from "$app/navigation";
  import PyqViewer from "$lib/features/pyq/components/PyqViewer.svelte";
  import { gateConfig } from "$lib/features/exams/config/gate-cs";

  let { data } = $props();

  function handleExit() {
    goto("/gate-cs/pyq");
  }
</script>

<SEO 
  title="{gateConfig.shortName} {data.manifest.title} — PYQ" 
  description="Practice the {data.manifest.title} previous year question paper for {gateConfig.name}." 
/>

<PyqViewer 
  questions={data.questions} 
  manifest={data.manifest} 
  examConfig={gateConfig}
  onExit={handleExit} 
/>
