<script lang="ts">
  import PyqViewer from "$lib/features/pyq/components/PyqViewer.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const handleExit = () => {
    window.location.href = "/subjects";
  };
</script>

<svelte:head>
  <title>{data.subject.name} | UGC NET CS</title>
</svelte:head>

<PyqViewer 
  questions={data.questions} 
  manifest={data.manifest} 
  examConfig={data.examConfig} 
  onExit={handleExit} 
/>
