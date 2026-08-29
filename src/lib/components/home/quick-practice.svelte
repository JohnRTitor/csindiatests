<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Zap, Timer } from "@lucide/svelte";
  import type { QuickPracticeOption } from "$lib/types";

  let { options }: { options: QuickPracticeOption[] } = $props();
</script>

<section class="mb-12">
  <div class="mb-6">
    <h2 class="text-2xl font-bold tracking-tight text-foreground">Quick Practice</h2>
    <p class="text-muted-foreground">Start a session immediately</p>
  </div>

  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    {#each options as option}
      <a href="/ugc-net-cs" class="block outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl group">
        <Card.Root class="h-full hover:border-primary/50 transition-all duration-200 cursor-pointer">
          <Card.Content class="p-5 flex flex-col items-center text-center justify-center h-full gap-3">
            <div class={`p-3 rounded-full ${option.isTimed ? 'bg-blue-500/10 text-blue-500' : 'bg-primary/10 text-primary'} group-hover:scale-110 transition-transform`}>
              {#if option.isTimed}
                <Timer class="h-6 w-6" />
              {:else}
                <Zap class="h-6 w-6" />
              {/if}
            </div>
            
            <div>
              <h3 class="font-bold text-lg">{option.title}</h3>
              <p class="text-sm text-muted-foreground">{option.description}</p>
            </div>
          </Card.Content>
        </Card.Root>
      </a>
    {/each}
  </div>
</section>
