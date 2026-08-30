<script lang="ts">
  import SEO from "$lib/components/SEO.svelte";
  import { onMount, untrack } from "svelte";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  
  import RecentActivity from "$lib/features/dashboard/components/recent-activity.svelte";
  import { dashboardDataService } from "$lib/features/dashboard/services/dashboard-data";
  import { testHistoryRepo } from "$lib/features/tests/repositories/test-history";
  import { testAnswersRepo } from "$lib/features/tests/repositories/test-answers";
  import type { ActivityItem } from "$lib/features/progress/types";
  import * as Pagination from "$lib/components/ui/pagination/index.js";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Trash2 } from "@lucide/svelte";

  let activityFeed = $state<ActivityItem[]>([]);
  let totalCount = $state(0);
  const pageSize = 5;
  
  let currentPage = $state(parseInt(page.url.searchParams.get("page") || "1", 10) || 1);
  let totalPages = $derived(Math.max(1, Math.ceil(totalCount / pageSize)));

  // Sync from URL to local state when URL changes (e.g., browser back/forward)
  $effect(() => {
    const p = parseInt(page.url.searchParams.get("page") || "1", 10) || 1;
    if (untrack(() => currentPage) !== p) {
      currentPage = p;
    }
  });

  // Load data and sync URL when currentPage changes
  $effect(() => {
    const p = currentPage;
    
    untrack(() => {
      // Check out of bounds (only if we've loaded the total count)
      if (totalCount > 0 && p > totalPages) {
         const url = new URL(page.url);
         url.searchParams.set("page", totalPages.toString());
         goto(url, { keepFocus: true, replaceState: true, noScroll: true });
         return;
      }

      // Sync to URL if different
      const currentUrlPage = parseInt(page.url.searchParams.get("page") || "1", 10) || 1;
      if (p !== currentUrlPage) {
         const url = new URL(page.url);
         url.searchParams.set("page", p.toString());
         goto(url, { keepFocus: true, noScroll: true });
      }
      
      // load data for the new page
      loadData(p);
    });
  });

  const loadData = async (pageNum: number) => {
    const res = await dashboardDataService.getRecentActivityPaginated(pageNum, pageSize);
    activityFeed = res.items;
    totalCount = res.totalCount;
  };

  const handleDeleteActivity = async (id: string) => {
    await testHistoryRepo.delete(id);
    await testAnswersRepo.deleteForTest(id);
    
    // If we deleted the last item on the page, go to previous page
    let p = currentPage;
    if (activityFeed.length === 1 && p > 1) {
      currentPage = p - 1;
    } else {
      await loadData(p);
    }
  };

  let isDeletingAll = $state(false);

  const handleDeleteAll = async () => {
    isDeletingAll = true;
    await testHistoryRepo.deleteAll();
    await testAnswersRepo.deleteAll();
    
    currentPage = 1;
    await loadData(1);
    isDeletingAll = false;
  };
</script>

<SEO title="Recent Activity" noindex={true} />

<main class="grow py-8 md:py-12">
  <div class="container mx-auto px-4 sm:px-8 max-w-4xl">
    <div class="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div>
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
          Activity History
        </h1>
        <p class="text-lg text-muted-foreground">
          Review your past practice sessions and mock tests.
        </p>
      </div>

      {#if totalCount > 0}
        <AlertDialog.Root>
          <AlertDialog.Trigger>
            {#snippet child({ props })}
              <Button variant="destructive" disabled={isDeletingAll} {...props}>
                <Trash2 class="mr-2 h-4 w-4" />
                Clear All History
              </Button>
            {/snippet}
          </AlertDialog.Trigger>
          <AlertDialog.Content>
            <AlertDialog.Header>
              <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
              <AlertDialog.Description>
                This action cannot be undone. This will permanently delete all your practice sessions, mock test scores, and history from your local device.
              </AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
              <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
              <AlertDialog.Action variant="destructive" onclick={handleDeleteAll}>
                Delete All
              </AlertDialog.Action>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Root>
      {/if}
    </div>

    {#if activityFeed.length === 0 && totalCount === 0}
      <div class="text-center py-16 px-4 bg-card rounded-2xl border border-dashed">
        <p class="text-muted-foreground">No recent activity found. Start a test to see your history here!</p>
      </div>
    {:else}
      <RecentActivity activities={activityFeed} onDeleteActivity={handleDeleteActivity} />
      
      {#if totalPages > 1}
        <div class="mt-8 mb-4">
          <Pagination.Root count={totalCount} perPage={pageSize} bind:page={currentPage}>
            {#snippet children({ pages, currentPage })}
              <Pagination.Content>
                <Pagination.Item>
                  <Pagination.PrevButton />
                </Pagination.Item>
                {#each pages as pageItem (pageItem.key)}
                  {#if pageItem.type === "ellipsis"}
                    <Pagination.Item>
                      <Pagination.Ellipsis />
                    </Pagination.Item>
                  {:else}
                    <Pagination.Item>
                      <Pagination.Link page={pageItem} isActive={currentPage === pageItem.value}>
                        {pageItem.value}
                      </Pagination.Link>
                    </Pagination.Item>
                  {/if}
                {/each}
                <Pagination.Item>
                  <Pagination.NextButton />
                </Pagination.Item>
              </Pagination.Content>
            {/snippet}
          </Pagination.Root>
        </div>
      {/if}
    {/if}
  </div>
</main>
