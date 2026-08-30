import { preferencesRepo } from '../repositories/preferences';

export type AppSettings = {
  theme: string;
  compactLayout: boolean;
  reduceAnimations: boolean;
  autoAdvance: boolean;
  showExplanation: boolean;
  confirmEndTest: boolean;
  soundEffects: boolean;
  showNavigator: boolean;
  enableTimerWarning: boolean;
  timerWarningThreshold: number;
  showElapsedTime: boolean;
  dailyQuestionGoal: number;
  reviewIncorrect: boolean;
};

const defaultPreferences: AppSettings = {
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

function createSettingsStore() {
  let state = $state<AppSettings>({ ...defaultPreferences });
  let isLoaded = $state(false);
  let isSupported = $state(true);

  async function init() {
    if (typeof window === 'undefined') return; // Skip during SSR
    
    // Prevent multiple initializations
    if (isLoaded) return;

    try {
      const loadedPrefs = await preferencesRepo.getAll();
      state = { ...defaultPreferences, ...(loadedPrefs as Partial<AppSettings>) };
    } catch (err) {
      console.error("Failed to load preferences:", err);
      isSupported = false;
    } finally {
      isLoaded = true;
    }
  }

  async function updatePreference<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    if (!isSupported) return;
    
    // Optimistic update
    const previousValue = state[key];
    state[key] = value;
    
    try {
      await preferencesRepo.set(key, value);
    } catch (err) {
      console.error(`Failed to save preference ${key}:`, err);
      // Revert on failure
      state[key] = previousValue;
      throw err;
    }
  }

  return {
    get values() { return state; },
    get isLoaded() { return isLoaded; },
    get isSupported() { return isSupported; },
    init,
    updatePreference
  };
}

export const settingsState = createSettingsStore();
