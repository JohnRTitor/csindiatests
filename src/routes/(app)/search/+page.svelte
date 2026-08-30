<script lang="ts">
  import SEO from "$lib/components/SEO.svelte";
  import { onMount } from "svelte";
  import { Search, Loader2 } from "@lucide/svelte";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import { searchService } from "$lib/features/search/services/search-service";
  import type { SearchResult } from "$lib/features/search/types";
  import SearchResultItem from "$lib/features/search/components/SearchResultItem.svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";

  let query = $state("");
  let results = $state<SearchResult[]>([]);
  let isSearching = $state(false);
  let hasSearched = $state(false);

  // Basic debounce timer
  let debounceTimer: ReturnType<typeof setTimeout>;

  onMount(() => {
    // Check if URL has a ?q= query param
    const qParam = page.url.searchParams.get("q");
    if (qParam) {
      query = qParam;
      performSearch(query);
    }

    // Warm up the search engine by preloading the index
    searchService.init().catch(console.error);
  });

  function handleInput(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    query = value;

    // Update URL state without navigation
    const url = new URL(page.url);
    if (value) {
      url.searchParams.set("q", value);
    } else {
      url.searchParams.delete("q");
    }
    goto(url, { replaceState: true, keepFocus: true });

    clearTimeout(debounceTimer);
    if (value.trim().length > 1) {
      isSearching = true;
      debounceTimer = setTimeout(() => {
        performSearch(value);
      }, 200);
    } else {
      results = [];
      hasSearched = false;
      isSearching = false;
    }
  }

  async function performSearch(q: string) {
    if (!q.trim()) {
      results = [];
      hasSearched = false;
      isSearching = false;
      return;
    }

    isSearching = true;
    try {
      results = await searchService.search(q);
      hasSearched = true;
    } catch (error) {
      console.error("Search failed", error);
      results = [];
    } finally {
      isSearching = false;
    }
  }
</script>

<SEO title="Search PYQs" description="Search UGC NET and GATE Computer Science previous-year questions by topic, subject, year, or keyword." />

<div class="container mx-auto px-4 py-8 max-w-4xl min-h-[80vh]">
  <div class="space-y-6">
    <div class="space-y-2">
      <h1 class="text-3xl font-bold tracking-tight">Search</h1>
      <p class="text-muted-foreground">
        Find PYQs by topic, subject, keywords, or question content.
      </p>
    </div>

    <div class="relative">
      <Search class="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search for 'deadlock', 'SQL', 'C++', etc..."
        class="pl-10 py-6 text-lg rounded-xl bg-card shadow-sm border-2 focus-visible:ring-primary"
        value={query}
        oninput={handleInput}
        autofocus
      />
      {#if isSearching}
        <Loader2
          class="absolute right-4 top-3 h-5 w-5 animate-spin text-muted-foreground"
        />
      {/if}
    </div>

    <div class="mt-8">
      {#if query.length > 0 && query.trim().length < 2}
        <div class="text-center py-12 text-muted-foreground">
          Please enter at least 2 characters to search.
        </div>
      {:else if hasSearched && results.length === 0 && !isSearching}
        <div
          class="text-center py-16 bg-muted/20 rounded-xl border border-dashed"
        >
          <div
            class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4"
          >
            <Search class="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 class="text-lg font-medium mb-1">No results found</h3>
          <p class="text-muted-foreground">
            We couldn't find any questions matching "{query}".
          </p>
        </div>
      {:else if results.length > 0}
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-medium text-muted-foreground">
            Found {results.length}
            {results.length === 1 ? "result" : "results"}
          </h2>
        </div>
        <div class="space-y-4">
          {#each results as result (result.id)}
            <SearchResultItem {result} />
          {/each}
        </div>
      {:else if !query}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <div class="p-6 rounded-xl border bg-card/50">
            <h3 class="font-medium mb-2">Try searching for subjects</h3>
            <div class="flex flex-wrap gap-2">
              <Badge variant="secondary">Operating Systems</Badge>
              <Badge variant="secondary">Data Structures</Badge>
              <Badge variant="secondary">Theory of Computation</Badge>
            </div>
          </div>
          <div class="p-6 rounded-xl border bg-card/50">
            <h3 class="font-medium mb-2">Try searching for keywords</h3>
            <div class="flex flex-wrap gap-2">
              <Badge variant="outline">deadlock</Badge>
              <Badge variant="outline">NP-complete</Badge>
              <Badge variant="outline">normalization</Badge>
              <Badge variant="outline">binary tree</Badge>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
