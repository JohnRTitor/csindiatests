<script lang="ts">
  import { goto } from "$app/navigation";
  import PyqViewer from "$lib/features/pyq/components/PyqViewer.svelte";
  import { ugcNetConfig } from "$lib/features/exams/config/ugc-net-cs";

  let { data } = $props();

  function handleExit() {
    goto("/ugc-net-cs/pyq");
  }
</script>

<PyqViewer 
  questions={data.questions} 
  manifest={data.manifest} 
  examConfig={ugcNetConfig}
  onExit={handleExit} 
/>
