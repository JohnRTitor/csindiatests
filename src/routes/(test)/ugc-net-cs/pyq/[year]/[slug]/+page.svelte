<script lang="ts">
  import SEO from "$lib/components/SEO.svelte";
  import { goto } from "$app/navigation";
  import PyqViewer from "$lib/features/pyq/components/PyqViewer.svelte";
  import { ugcNetConfig } from "$lib/features/exams/config/ugc-net-cs";

  let { data } = $props();

  function handleExit() {
    goto("/ugc-net-cs/pyq");
  }
</script>

<SEO 
  title="{ugcNetConfig.shortName} {data.manifest.title} — PYQ" 
  description="Practice the {data.manifest.title} previous year question paper for {ugcNetConfig.name}." 
/>

<PyqViewer 
  questions={data.questions} 
  manifest={data.manifest} 
  examConfig={ugcNetConfig}
  onExit={handleExit} 
/>
