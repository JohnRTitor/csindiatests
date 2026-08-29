<script lang="ts">
  import { Progress } from "$lib/components/ui/progress/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { MoreVertical, Pause, Play, Settings } from "@lucide/svelte";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  
  let { 
    examName,
    examShortName,
    currentIndex, 
    totalQuestions, 
    timeRemaining, 
    isTimerPaused, 
    onPauseTimer, 
    onResumeTimer 
  } = $props();

  const progressValue = $derived((currentIndex / totalQuestions) * 100);
  
  const formatTime = (seconds: number) => {
    if (seconds < 0) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isLowTime = $derived(timeRemaining !== null && timeRemaining < 300); // < 5 mins
</script>

<header class="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
  <div class="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
    
    <!-- Left: Title -->
    <div class="flex items-center gap-3 overflow-hidden">
      <div class="hidden sm:block font-semibold text-sm truncate">
        {examName}
      </div>
      <div class="sm:hidden font-semibold text-sm truncate">
        {examShortName}
      </div>
      <div class="hidden md:block h-4 w-px bg-border"></div>
      <div class="text-xs text-muted-foreground whitespace-nowrap">
        Practice Test
      </div>
    </div>

    <!-- Center: Progress -->
    <div class="flex-grow max-w-md hidden md:flex items-center gap-3">
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
            onclick={() => isTimerPaused ? onResumeTimer() : onPauseTimer()}
          >
            {#if isTimerPaused}
              <Play class="h-4 w-4" />
            {:else}
              <Pause class="h-4 w-4" />
            {/if}
            <span class="sr-only">{isTimerPaused ? 'Resume' : 'Pause'} Timer</span>
          </Button>
          
          <div class={`font-mono font-medium tracking-tighter w-12 text-right ${isLowTime && !isTimerPaused ? 'text-destructive animate-pulse' : ''} ${isTimerPaused ? 'text-muted-foreground' : ''}`}>
            {formatTime(timeRemaining)}
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
          <DropdownMenu.Item onclick={() => window.location.href = "/"}>
            Exit Practice
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      
    </div>
  </div>
  
  <!-- Mobile Progress Bar (underneath) -->
  <div class="md:hidden w-full h-1 bg-muted">
    <div class="h-full bg-primary transition-all duration-300" style="width: {progressValue}%"></div>
  </div>
</header>
