<script lang="ts">
  import SEO from "$lib/components/SEO.svelte";
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Slider } from "$lib/components/ui/slider/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { LoaderCircle, Database, CircleAlert } from "@lucide/svelte";
  import { settingsState } from '$lib/features/preferences';
  import type { AppSettings } from "$lib/features/preferences/state/settings.svelte";

  let saving = $state<Record<string, boolean>>({});

  onMount(() => {
    settingsState.init();
  });

  async function updatePreference<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    saving[key] = true;
    try {
      await settingsState.updatePreference(key, value);
      toast.success("Settings saved");
    } catch (err: any) {
      toast.error(`Failed to save: ${err.message || "Unknown error"}`);
    } finally {
      saving[key] = false;
    }
  }

  // Event handlers for different input types
  function handleSwitchChange(key: keyof AppSettings, checked: boolean) {
    updatePreference(key, checked);
  }

  function handleSliderChange(key: keyof AppSettings, value: number) {
    updatePreference(key, value);
  }

  function handleNumberInputChange(key: keyof AppSettings, event: Event) {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value, 10);
    if (!isNaN(value) && value >= 1) {
      updatePreference(key, value);
    }
  }

  // Computed values
  let formattedTimerThreshold = $derived(() => {
    const threshold = settingsState.values.timerWarningThreshold;
    const minutes = Math.floor(threshold / 60);
    const seconds = threshold % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  });
</script>

<SEO title="Settings" noindex={true} />

  <main class="grow container mx-auto px-4 sm:px-8 max-w-4xl py-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Settings</h1>
        <p class="text-muted-foreground mt-1">Manage your application preferences and local data.</p>
      </div>
      
      {#if settingsState.isLoaded && settingsState.isSupported}
        <div class="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
          <Database class="h-4 w-4 text-green-500" />
          <span>Local storage active</span>
        </div>
      {/if}
    </div>

    {#if !settingsState.isLoaded}
      <div class="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <LoaderCircle class="h-8 w-8 animate-spin mb-4" />
        <p>Loading settings...</p>
      </div>
    {:else if !settingsState.isSupported}
      <div class="bg-destructive/10 border border-destructive/20 rounded-lg p-6 flex items-start gap-4 text-destructive">
        <CircleAlert class="h-6 w-6 shrink-0 mt-0.5" />
        <div>
          <h3 class="font-semibold text-lg">Local Storage Unavailable</h3>
          <p class="mt-1 opacity-90">
            Your browser doesn't support the required local storage features.
            Some offline features and progress tracking may not work correctly.
          </p>
          <Button variant="outline" class="mt-4 bg-background" onclick={() => window.location.reload()}>
            Retry Connection
          </Button>
        </div>
      </div>
    {:else}
      {#snippet SwitchSetting(id: string, label: string, description: string, key: keyof AppSettings)}
        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <Label for={id} class="text-base">{label}</Label>
            <p class="text-sm text-muted-foreground">{description}</p>
          </div>
          <Switch 
            {id}
            checked={settingsState.values[key] as boolean} 
            onCheckedChange={(v) => handleSwitchChange(key, v)} 
            disabled={saving[key]}
          />
        </div>
      {/snippet}

      <div class="grid gap-8">
        <!-- Appearance -->
        <section class="space-y-6 bg-card border rounded-xl p-6 shadow-sm">
          <div>
            <h2 class="text-xl font-semibold">Appearance</h2>
            <p class="text-sm text-muted-foreground">Customize how the application looks and feels.</p>
          </div>
          <Separator />
          <div class="space-y-6">
            {@render SwitchSetting("compact-layout", "Compact Layout", "Reduce spacing between elements to fit more on screen.", "compactLayout")}
            {@render SwitchSetting("reduce-animations", "Reduce Animations", "Disable UI transitions and animations.", "reduceAnimations")}
          </div>
        </section>

        <!-- Quiz Behavior -->
        <section class="space-y-6 bg-card border rounded-xl p-6 shadow-sm">
          <div>
            <h2 class="text-xl font-semibold">Quiz Behavior</h2>
            <p class="text-sm text-muted-foreground">Configure how mock tests and practice sessions work.</p>
          </div>
          <Separator />
          <div class="space-y-6">
            {@render SwitchSetting("auto-advance", "Auto-advance", "Automatically move to the next question after answering.", "autoAdvance")}
            {@render SwitchSetting("show-explanation", "Show Explanations", "Show answer explanations immediately in practice mode.", "showExplanation")}
            {@render SwitchSetting("confirm-end", "Confirm Submission", "Require confirmation before submitting a test.", "confirmEndTest")}
            {@render SwitchSetting("show-navigator", "Question Navigator", "Show the question grid navigator during tests.", "showNavigator")}
          </div>
        </section>

        <!-- Timer Settings -->
        <section class="space-y-6 bg-card border rounded-xl p-6 shadow-sm">
          <div>
            <h2 class="text-xl font-semibold">Timer Settings</h2>
            <p class="text-sm text-muted-foreground">Manage time tracking and warnings.</p>
          </div>
          <Separator />
          <div class="space-y-6">
            {@render SwitchSetting("show-time", "Show Elapsed Time", "Display the timer during untimed practice sessions.", "showElapsedTime")}
            {@render SwitchSetting("timer-warning", "Low Time Warning", "Change timer color when time is running low.", "enableTimerWarning")}

            {#if settingsState.values.enableTimerWarning}
              <div class="space-y-4 pt-2">
                <div class="flex items-center justify-between">
                  <Label class="text-base">Warning Threshold</Label>
                  <span class="text-sm font-medium tabular-nums">{formattedTimerThreshold()}</span>
                </div>
                <Slider
                  type="single"
                  value={settingsState.values.timerWarningThreshold}
                  min={60}
                  max={1200}
                  step={60}
                  onValueChange={(v: number) => { settingsState.values.timerWarningThreshold = v; }}
                  onValueCommit={(v: number) => handleSliderChange('timerWarningThreshold', v)}
                  disabled={saving.timerWarningThreshold}
                  class="**:[[role=slider]]:h-4 **:[[role=slider]]:w-4"
                />
                <p class="text-xs text-muted-foreground">Warn when less than this amount of time remains.</p>
              </div>
            {/if}
          </div>
        </section>

        <!-- Study Goals -->
        <section class="space-y-6 bg-card border rounded-xl p-6 shadow-sm">
          <div>
            <h2 class="text-xl font-semibold">Study Goals</h2>
            <p class="text-sm text-muted-foreground">Set your daily targets and study preferences.</p>
          </div>
          <Separator />
          <div class="space-y-6">
            <div class="grid gap-2">
              <Label for="daily-goal" class="text-base">Daily Question Goal</Label>
              <div class="flex items-center gap-4 max-w-50">
                <Input 
                  id="daily-goal" 
                  type="number" 
                  min="1" 
                  max="500" 
                  value={settingsState.values.dailyQuestionGoal}
                  onchange={(e) => handleNumberInputChange('dailyQuestionGoal', e)}
                  disabled={saving.dailyQuestionGoal}
                />
                <span class="text-sm text-muted-foreground shrink-0">questions</span>
              </div>
            </div>

            {@render SwitchSetting("review-incorrect", "Prioritize Incorrect", "Show previously missed questions more frequently.", "reviewIncorrect")}
          </div>
        </section>

      </div>
    {/if}
  </main>
