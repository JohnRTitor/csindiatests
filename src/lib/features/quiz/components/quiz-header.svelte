<script lang="ts">
  import { Progress } from "$lib/components/ui/progress/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Pause, Play, Settings } from "@lucide/svelte";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { settingsState } from "$lib/features/preferences";

  let {
    title,
    modeLabel = "Practice Test",
    currentIndex,
    totalQuestions,
    timeRemaining,
    elapsedTime,
    isTimerPaused,
    onPauseTimer,
    onResumeTimer,
    onExit,
    onCancelTest,
  } = $props();

  let showDeleteDialog = $state(false);

  const progressValue = $derived((currentIndex / totalQuestions) * 100);

  const formatTime = (seconds: number) => {
    if (seconds < 0) return "00:00";
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isLowTime = $derived(
    settingsState.values.enableTimerWarning && 
    timeRemaining !== null && 
    timeRemaining <= settingsState.values.timerWarningThreshold
  );
  
  const showElapsed = $derived(timeRemaining === null && settingsState.values.showElapsedTime);
</script>

<header
  class="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shadow-sm"
>
  <div
    class="container mx-auto px-4 h-14 flex items-center justify-between gap-4"
  >
    <!-- Left: Title -->
    <div class="flex items-center gap-3 overflow-hidden">
      <div class="font-semibold text-sm truncate">
        {title}
      </div>
      <div class="hidden md:block h-4 w-px bg-border"></div>
      <div class="text-xs text-muted-foreground whitespace-nowrap hidden sm:block">
        {modeLabel}
      </div>
      <div class="text-xs text-muted-foreground whitespace-nowrap sm:hidden">
        {modeLabel.split(' ')[0]}
      </div>
    </div>

    <!-- Center: Progress -->
    <div class="grow max-w-md hidden md:flex items-center gap-3">
      <span class="text-xs font-medium whitespace-nowrap">
        Question {currentIndex + 1} of {totalQuestions}
      </span>
      <Progress value={progressValue} class="h-1.5" />
    </div>

    <!-- Right: Timer & Options -->
    <div class="flex items-center gap-2 sm:gap-4 shrink-0">
      {#if timeRemaining !== null}
        <div class="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 text-muted-foreground"
            onclick={() => (isTimerPaused ? onResumeTimer() : onPauseTimer())}
          >
            {#if isTimerPaused}
              <Play class="h-4 w-4" />
            {:else}
              <Pause class="h-4 w-4" />
            {/if}
            <span class="sr-only"
              >{isTimerPaused ? "Resume" : "Pause"} Timer</span
            >
          </Button>

          <div
            class={`font-mono font-medium tracking-tighter w-12 text-right ${isLowTime && !isTimerPaused ? "text-destructive animate-pulse" : ""} ${isTimerPaused ? "text-muted-foreground" : ""}`}
          >
            {formatTime(timeRemaining)}
          </div>
        </div>
      {:else if showElapsed}
        <div class="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            class="h-8 w-8 text-muted-foreground"
            onclick={() => (isTimerPaused ? onResumeTimer() : onPauseTimer())}
          >
            {#if isTimerPaused}
              <Play class="h-4 w-4" />
            {:else}
              <Pause class="h-4 w-4" />
            {/if}
            <span class="sr-only"
              >{isTimerPaused ? "Resume" : "Pause"} Timer</span
            >
          </Button>

          <div
            class={`font-mono font-medium tracking-tighter w-12 text-right ${isTimerPaused ? "text-muted-foreground" : "text-muted-foreground/80"}`}
          >
            {formatTime(elapsedTime)}
          </div>
        </div>
      {/if}

      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          {#snippet child({ props })}
            <Button variant="ghost" size="icon" class="h-8 w-8" {...props}>
              <Settings class="h-4 w-4" />
              <span class="sr-only">Options</span>
            </Button>
          {/snippet}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Item onclick={() => onExit?.()}>
            Save & Exit
          </DropdownMenu.Item>
          <DropdownMenu.Item onclick={() => (showDeleteDialog = true)} class="text-destructive focus:bg-destructive/10 focus:text-destructive">
            Delete Test
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      
      <div class="hidden sm:block h-4 w-px bg-border"></div>
      <Button variant="ghost" class="hidden sm:inline-flex hover:bg-destructive/10 hover:text-destructive text-muted-foreground" onclick={() => onExit?.()}>
        Exit
      </Button>
    </div>
  </div>

  <!-- Mobile Progress Bar (underneath) -->
  <div class="md:hidden w-full h-1 bg-muted">
    <div
      class="h-full bg-primary transition-all duration-300"
      style="width: {progressValue}%"
    ></div>
  </div>
</header>

<AlertDialog.Root bind:open={showDeleteDialog}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Delete this test?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete your progress for this test.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action class="bg-destructive text-destructive-foreground hover:bg-destructive/90" onclick={() => onCancelTest?.()}>Delete Test</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
