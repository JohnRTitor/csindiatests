<script lang="ts">
  import type { RichContent } from "$lib/features/pyq/types";
  import katex from "katex";
  import "katex/dist/katex.min.css";

  let { content }: { content: RichContent[] } = $props();

  function renderMath(math: string) {
    try {
      return katex.renderToString(math, {
        throwOnError: false,
        displayMode: false // Inline mode by default
      });
    } catch (e) {
      console.error("KaTeX error:", e);
      return math;
    }
  }
</script>

<div class="rich-content space-y-3">
  {#each content as block}
    {#if block.type === "text"}
      <p class="text-foreground leading-relaxed whitespace-pre-wrap">{block.value}</p>
    {:else if block.type === "math"}
      <span class="inline-block">{@html renderMath(block.value)}</span>
    {:else if block.type === "code"}
      <pre class="bg-muted p-4 rounded-lg overflow-x-auto text-sm border font-mono">
        <code>{block.value}</code>
      </pre>
    {:else if block.type === "image"}
      <div class="my-4">
        <img 
          src={block.path} 
          alt="Question content" 
          class="max-w-full rounded-md border shadow-sm object-contain"
          loading="lazy"
        />
      </div>
    {/if}
  {/each}
</div>
