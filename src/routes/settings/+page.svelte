<script lang="ts">
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import AppHeader from "$lib/components/layout/app-header.svelte";
  import AppFooter from "$lib/components/layout/app-footer.svelte";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Slider } from "$lib/components/ui/slider/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { LoaderCircle, Database, CircleAlert } from "@lucide/svelte";
  import { preferencesRepo } from '$lib/features/preferences/index';

  const defaultPreferences = {
    theme: "system",
    compactLayout: false,
    reduceAnimations: false,
    autoAdvance: true,
    showExplanation: true,
    confirmEndTest: true,
    soundEffects: false,
    showNavigator: true,
    enableTimerWarning: true,
    timerWarningThreshold: 300, // 5 minutes in seconds
    showElapsedTime: true,
    dailyQuestionGoal: 20,
    reviewIncorrect: true
  };

  let preferences = $state<Record<string, any>>({ ...defaultPreferences });
  let loading = $state(true);
  let error = $state<string | null>(null);
  let dbSupported = $state(true);
  let saving = $state<Record<string, boolean>>({});

  onMount(async () => {
    try {
      const loadedPrefs = await preferencesRepo.getAll();
      preferences = { ...defaultPreferences, ...loadedPrefs };
    } catch (err: any) {
      console.error("Failed to load preferences:", err);
      dbSupported = false;
      error = err.message || "Failed to connect to local database.";
    } finally {
      loading = false;
    }
  });

  async function updatePreference(key: string, value: any) {
    if (!dbSupported) return;

    // Optimistic update
    const previousValue = preferences[key];
    preferences[key] = value;
    saving[key] = true;

    try {
      await preferencesRepo.set(key, value);
      toast.success("Settings saved");
    } catch (err: any) {
      console.error(`Failed to save preference ${key}:`, err);
      // Revert on failure
      preferences[key] = previousValue;
      toast.error(`Failed to save: ${err.message || "Unknown error"}`);
    } finally {
      saving[key] = false;
    }
  }

  // Event handlers for different input types
  function handleSwitchChange(key: string, checked: boolean) {
    updatePreference(key, checked);
  }

  function handleSliderChange(key: string, value: number) {
    updatePreference(key, value);
  }

  function handleNumberInputChange(key: string, event: Event) {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value, 10);
    if (!isNaN(value)) {
      updatePreference(key, value);
    }
  }

  function handleSelectChange(key: string, value: string) {
    updatePreference(key, value);
  }

  // Computed values
  let formattedTimerThreshold = $derived(() => {
    const minutes = Math.floor(preferences.timerWarningThreshold / 60);
    const seconds = preferences.timerWarningThreshold % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  });
</script>

<div class="min-h-screen flex flex-col bg-muted/20">
  <AppHeader />
  
  <main class="grow container mx-auto px-4 sm:px-8 max-w-4xl py-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Settings</h1>
        <p class="text-muted-foreground mt-1">Manage your application preferences and local data.</p>
      </div>
      
      {#if !loading && dbSupported}
        <div class="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
          <Database class="h-4 w-4 text-green-500" />
          <span>Local storage active</span>
        </div>
      {/if}
    </div>

    {#if loading}
      <div class="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <LoaderCircle class="h-8 w-8 animate-spin mb-4" />
        <p>Loading settings...</p>
      </div>
    {:else if !dbSupported}
      <div class="bg-destructive/10 border border-destructive/20 rounded-lg p-6 flex items-start gap-4 text-destructive">
        <CircleAlert class="h-6 w-6 shrink-0 mt-0.5" />
        <div>
          <h3 class="font-semibold text-lg">Local Storage Unavailable</h3>
          <p class="mt-1 opacity-90">
            {error || "Your browser doesn't support the required local storage features (OPFS)."} 
            Some offline features and progress tracking may not work correctly.
          </p>
          <Button variant="outline" class="mt-4 bg-background" onclick={() => window.location.reload()}>
            Retry Connection
          </Button>
        </div>
      </div>
    {:else}
      <div class="grid gap-8">
        <!-- Appearance -->
        <section class="space-y-6 bg-card border rounded-xl p-6 shadow-sm">
          <div>
            <h2 class="text-xl font-semibold">Appearance</h2>
            <p class="text-sm text-muted-foreground">Customize how the application looks and feels.</p>
          </div>
          <Separator />
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label for="compact-layout" class="text-base">Compact Layout</Label>
                <p class="text-sm text-muted-foreground">Reduce spacing between elements to fit more on screen.</p>
              </div>
              <Switch 
                id="compact-layout" 
                checked={preferences.compactLayout} 
                onCheckedChange={(v) => handleSwitchChange('compactLayout', v)} 
                disabled={saving.compactLayout}
              />
            </div>
            
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label for="reduce-animations" class="text-base">Reduce Animations</Label>
                <p class="text-sm text-muted-foreground">Disable UI transitions and animations.</p>
              </div>
              <Switch 
                id="reduce-animations" 
                checked={preferences.reduceAnimations} 
                onCheckedChange={(v) => handleSwitchChange('reduceAnimations', v)} 
                disabled={saving.reduceAnimations}
              />
            </div>
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
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label for="auto-advance" class="text-base">Auto-advance</Label>
                <p class="text-sm text-muted-foreground">Automatically move to the next question after answering.</p>
              </div>
              <Switch 
                id="auto-advance" 
                checked={preferences.autoAdvance} 
                onCheckedChange={(v) => handleSwitchChange('autoAdvance', v)} 
                disabled={saving.autoAdvance}
              />
            </div>

            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label for="show-explanation" class="text-base">Show Explanations</Label>
                <p class="text-sm text-muted-foreground">Show answer explanations immediately in practice mode.</p>
              </div>
              <Switch 
                id="show-explanation" 
                checked={preferences.showExplanation} 
                onCheckedChange={(v) => handleSwitchChange('showExplanation', v)} 
                disabled={saving.showExplanation}
              />
            </div>

            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label for="confirm-end" class="text-base">Confirm Submission</Label>
                <p class="text-sm text-muted-foreground">Require confirmation before submitting a test.</p>
              </div>
              <Switch 
                id="confirm-end" 
                checked={preferences.confirmEndTest} 
                onCheckedChange={(v) => handleSwitchChange('confirmEndTest', v)} 
                disabled={saving.confirmEndTest}
              />
            </div>

            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label for="show-navigator" class="text-base">Question Navigator</Label>
                <p class="text-sm text-muted-foreground">Show the question grid navigator during tests.</p>
              </div>
              <Switch 
                id="show-navigator" 
                checked={preferences.showNavigator} 
                onCheckedChange={(v) => handleSwitchChange('showNavigator', v)} 
                disabled={saving.showNavigator}
              />
            </div>
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
            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label for="show-time" class="text-base">Show Elapsed Time</Label>
                <p class="text-sm text-muted-foreground">Display the timer during untimed practice sessions.</p>
              </div>
              <Switch 
                id="show-time" 
                checked={preferences.showElapsedTime} 
                onCheckedChange={(v) => handleSwitchChange('showElapsedTime', v)} 
                disabled={saving.showElapsedTime}
              />
            </div>

            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label for="timer-warning" class="text-base">Low Time Warning</Label>
                <p class="text-sm text-muted-foreground">Change timer color when time is running low.</p>
              </div>
              <Switch 
                id="timer-warning" 
                checked={preferences.enableTimerWarning} 
                onCheckedChange={(v) => handleSwitchChange('enableTimerWarning', v)} 
                disabled={saving.enableTimerWarning}
              />
            </div>

            {#if preferences.enableTimerWarning}
              <div class="space-y-4 pt-2">
                <div class="flex items-center justify-between">
                  <Label class="text-base">Warning Threshold</Label>
                  <span class="text-sm font-medium tabular-nums">{formattedTimerThreshold()}</span>
                </div>
                <Slider
                  type="single"
                  value={preferences.timerWarningThreshold}
                  min={60}
                  max={1200}
                  step={60}
                  onValueChange={(v: number) => handleSliderChange('timerWarningThreshold', v)}
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
                  value={preferences.dailyQuestionGoal}
                  onchange={(e) => handleNumberInputChange('dailyQuestionGoal', e)}
                  disabled={saving.dailyQuestionGoal}
                />
                <span class="text-sm text-muted-foreground shrink-0">questions</span>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="space-y-0.5">
                <Label for="review-incorrect" class="text-base">Prioritize Incorrect</Label>
                <p class="text-sm text-muted-foreground">Show previously missed questions more frequently.</p>
              </div>
              <Switch 
                id="review-incorrect" 
                checked={preferences.reviewIncorrect} 
                onCheckedChange={(v) => handleSwitchChange('reviewIncorrect', v)} 
                disabled={saving.reviewIncorrect}
              />
            </div>
          </div>
        </section>

      </div>
    {/if}
  </main>
  
  <AppFooter />
</div>
