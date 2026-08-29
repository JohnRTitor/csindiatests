<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { CheckCircle2, LayoutGrid, Timer, Clock, Trash } from "@lucide/svelte";
  import type { ActivityItem } from "$lib/features/progress/types";

  let { activities, onDeleteActivity }: { activities: ActivityItem[], onDeleteActivity?: (id: string) => void } = $props();

  let itemToDelete = $state<string | null>(null);

  function formatRelativeTime(isoString: string) {
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const date = new Date(isoString);
    const now = new Date();

    const hoursDiff = Math.round(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60)
    );

    if (Math.abs(hoursDiff) < 24) {
      if (hoursDiff === 0) {
        const minsDiff = Math.round(
          (date.getTime() - now.getTime()) / (1000 * 60)
        );
        if (minsDiff === 0) return "Just now";
        return rtf.format(minsDiff, "minute");
      }
      return rtf.format(hoursDiff, "hour");
    }

    const daysDiff = Math.round(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysDiff === -1) return "Yesterday";
    return rtf.format(daysDiff, "day");
  }

  function getIconForActivity(type: string) {
    switch (type) {
      case "test":
        return Timer;
      case "mixed":
        return LayoutGrid;
      default:
        return CheckCircle2;
    }
  }

  function getColorForActivity(type: string) {
    switch (type) {
      case "test":
        return "text-amber-500 bg-amber-500/10";
      case "mixed":
        return "text-blue-500 bg-blue-500/10";
      default:
        return "text-green-500 bg-green-500/10";
    }
  }
</script>

<section class="mb-12">
  <div class="mb-6 flex items-center justify-between">
    <h2 class="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
      <Clock class="h-6 w-6 text-primary" /> Recent Activity
    </h2>
  </div>

  <Card.Root>
    <Card.Content class="p-0">
      <div class="divide-y">
        {#each activities as activity}
          {@const Icon = getIconForActivity(activity.type)}
          {@const colorClass = getColorForActivity(activity.type)}

          <div class="flex flex-col sm:flex-row sm:items-center p-4 sm:p-6 gap-4 sm:gap-6 hover:bg-muted/30 transition-colors">
            
            <div class="grow space-y-1">
              <div class="flex items-center gap-2 mb-1">
                <span class={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${activity.status === 'in_progress' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                  {activity.status === 'in_progress' ? 'In Progress' : 'Completed'}
                </span>
              </div>
              <h3 class="font-bold text-base sm:text-lg text-foreground leading-tight">
                {activity.examName}
              </h3>
              <p class="text-sm text-muted-foreground font-medium">
                {activity.modeName}{#if activity.subjectName} · {activity.subjectName}{/if}{#if activity.topicName} · {activity.topicName}{/if}
              </p>
              
              <div class="pt-3 pb-1">
                <p class="text-sm font-medium">
                  {activity.answeredCount} / {activity.totalQuestions} answered
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <p class="text-xs text-muted-foreground">
                    {activity.progressPercent}% complete · Last active {formatRelativeTime(activity.lastActiveAt)}
                  </p>
                </div>
              </div>
            </div>

            <div class="mt-4 sm:mt-0 flex-shrink-0 self-start sm:self-center w-full sm:w-auto flex items-center gap-2">
              {#if activity.status === 'in_progress' && activity.resumeHref}
                <Button href={activity.resumeHref} class="w-full sm:w-auto">
                  Resume
                </Button>
              {:else if activity.status === 'completed' && activity.resultHref}
                <Button href={activity.resultHref} variant="outline" class="w-full sm:w-auto">
                  View Result
                </Button>
              {/if}

              {#if onDeleteActivity}
                <Button variant="ghost" size="icon" class="text-muted-foreground hover:text-destructive hover:bg-destructive/10" onclick={() => itemToDelete = activity.id}>
                  <Trash class="h-4 w-4" />
                </Button>
              {/if}
            </div>

          </div>
        {/each}

        {#if activities.length === 0}
          <div class="p-10 text-center flex flex-col items-center justify-center">
            <div class="bg-muted p-4 rounded-full mb-4">
              <Clock class="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 class="font-semibold text-lg mb-2">No recent activity</h3>
            <p class="text-muted-foreground max-w-sm mb-6">
              Start a practice session and your progress will appear here.
            </p>
            <Button href="/gate-cs/practice/quick">
              Start Practice
            </Button>
          </div>
        {/if}
      </div>
    </Card.Content>
  </Card.Root>
</section>

<AlertDialog.Root open={itemToDelete !== null} onOpenChange={(open) => { if (!open) itemToDelete = null; }}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Delete this test?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete your progress for this test session.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action 
        class="bg-destructive text-destructive-foreground hover:bg-destructive/90" 
        onclick={() => { 
          if (itemToDelete && onDeleteActivity) {
            onDeleteActivity(itemToDelete);
          }
          itemToDelete = null;
        }}>
        Delete Test
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
