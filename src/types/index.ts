// LifeHUD Data Types

export interface QuestStep {
  id: string;
  text: string;
  done: boolean;
  locationLabel?: string;
  timeWindow?: string;
  notes?: string;
}

export interface Quest {
  id: string;
  title: string;
  description?: string;
  status: "backlog" | "active" | "completed";
  priority: "low" | "med" | "high";
  tags: string[];
  steps: QuestStep[];
  xpReward: number;
  createdAt: number;
  updatedAt: number;
}

export interface Effect {
  id: string;
  name: string;
  kind: "buff" | "debuff";
  intensity: 1 | 2 | 3 | 4 | 5;
  startAt: number;
  durationMin: number;
  tags: string[];
  notes?: string;
  presetKey?: "caffeine" | "alcohol" | "sleep_inertia";
}

export interface LoadoutSlots {
  headwear: string;
  top: string;
  outerwear: string;
  bottom: string;
  footwear: string;
  accessory: string;
  bag: string;
}

export interface Loadout {
  id: string;
  name: string;
  contextTags: string[];
  slots: LoadoutSlots;
  checklist: string[];
  checklistChecked: string[];
  isEquipped: boolean;
}

export interface AppState {
  schemaVersion: number;
  xpTotal: number;
  quests: Quest[];
  effects: Effect[];
  loadouts: Loadout[];
}

export type EffectPreset = {
  key: "caffeine" | "alcohol" | "sleep_inertia";
  name: string;
  kind: "buff" | "debuff";
  intensity: 1 | 2 | 3 | 4 | 5;
  durationMin: number;
};
