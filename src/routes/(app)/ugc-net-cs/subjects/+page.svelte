<script lang="ts">
  import SEO from "$lib/components/SEO.svelte";
  import { UGC_NET_CS_SUBJECTS } from "$lib/features/subjects/registry";
    </script>

<SEO title="UGC NET CS Subjects" description="Browse UGC NET Computer Science subjects." />

<main class="min-h-screen bg-background flex flex-col">
  
  <div class="grow container mx-auto max-w-5xl px-4 py-12 md:py-16">
    <div class="mb-12">
      <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
        UGC NET CS Subjects
      </h1>
      <p class="text-xl text-muted-foreground max-w-2xl">
        Select a subject to practice specific topic questions.
      </p>
    </div>

    <div class="mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each UGC_NET_CS_SUBJECTS as subject}
          <a
            href={`/ugc-net-cs/subjects/${subject.id}`}
            class={`group relative flex flex-col justify-between p-6 rounded-2xl border transition-all hover:scale-[1.02] hover:shadow-lg overflow-hidden ${subject.color || "bg-card text-card-foreground border-border"}`}
          >
            <!-- Decorative background blob if desired -->
            <div
              class="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all pointer-events-none"
            ></div>

            <div class="mb-8 relative z-10">
              <h3
                class="text-xl font-bold leading-tight mb-2 group-hover:underline underline-offset-4 decoration-2 decoration-white/30"
              >
                {subject.name}
              </h3>
            </div>

            <div class="flex items-end justify-between relative z-10 mt-auto">
              <span class="text-sm font-medium opacity-80">
                {subject.shortName}
              </span>
              <div class="flex flex-col items-end">
                <span
                  class="text-xs font-semibold uppercase tracking-wider opacity-70"
                >
                  Practice
                </span>
              </div>
            </div>
          </a>
        {/each}
      </div>
    </div>
  </div>

  </main>
