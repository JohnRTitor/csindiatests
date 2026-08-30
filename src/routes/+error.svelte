<script lang="ts">
  import { page } from "$app/state";
</script>

<div
  class="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center"
>
  <h1 class="text-4xl font-bold mb-4">{page.status}</h1>
  <p class="text-xl text-muted-foreground mb-8">
    {page.error?.message ?? "An unexpected error occurred."}
  </p>
  {#if page.error?.errorId}
    <p class="text-xs text-muted-foreground font-mono">
      Error ID: {page.error.errorId}
    </p>
  {/if}
  <a href="/" class="mt-8 text-primary hover:underline"> Return to Home </a>
</div>
