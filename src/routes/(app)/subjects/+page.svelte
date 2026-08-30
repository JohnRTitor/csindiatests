<script lang="ts">
  import SEO from "$lib/components/SEO.svelte";
  import { UGC_NET_CS_SUBJECTS } from "$lib/features/subjects/registry";
  import { pyqService } from "$lib/features/pyq/services/pyq-service";
  
  const counts = pyqService.getSubjectCounts("ugc-net-cs");
  
  // Merge subject definitions with their counts
  const subjectsWithCounts = UGC_NET_CS_SUBJECTS.map(subject => {
    const countData = counts.find(c => c.id === subject.id);
    return {
      ...subject,
      count: countData ? countData.count : 0
    };
  }).filter(s => s.count > 0);
  
  // Sort by count descending for now, or use registry order
  // subjectsWithCounts.sort((a, b) => b.count - a.count);
</script>

<SEO title="Subjects" description="Browse Computer Science subjects for UGC NET and GATE preparation." />

<main class="min-h-screen bg-background">
  <div class="container mx-auto max-w-5xl px-4 py-12 md:py-16">
    
    <div class="mb-12">
      <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
        Subject Explorer
      </h1>
      <p class="text-xl text-muted-foreground max-w-2xl">
        Practice exactly what you need. Dive into thousands of previous year questions categorized by topic.
      </p>
    </div>
    
    <div class="mb-8">
      <h2 class="text-2xl font-bold tracking-tight mb-6 flex items-center gap-3">
        <span class="bg-primary text-primary-foreground text-sm px-2 py-0.5 rounded font-semibold uppercase tracking-wider">UGC NET CS</span>
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each subjectsWithCounts as subject}
          <a 
            href={`/ugc-net-cs/subjects/${subject.id}`}
            class={`group relative flex flex-col justify-between p-6 rounded-2xl border transition-all hover:scale-[1.02] hover:shadow-lg overflow-hidden ${subject.color || 'bg-card text-card-foreground border-border'}`}
          >
            <!-- Decorative background blob if desired -->
            <div class="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all pointer-events-none"></div>
            
            <div class="mb-8 relative z-10">
              <h3 class="text-xl font-bold leading-tight mb-2 group-hover:underline underline-offset-4 decoration-2 decoration-white/30">
                {subject.name}
              </h3>
            </div>
            
            <div class="flex items-end justify-between relative z-10 mt-auto">
              <span class="text-sm font-medium opacity-80">
                {subject.shortName}
              </span>
              <div class="flex flex-col items-end">
                <span class="text-3xl font-black tabular-nums tracking-tighter">
                  {subject.count}
                </span>
                <span class="text-xs font-semibold uppercase tracking-wider opacity-70">
                  Questions
                </span>
              </div>
            </div>
          </a>
        {/each}
      </div>
    </div>
    
  </div>
</main>
