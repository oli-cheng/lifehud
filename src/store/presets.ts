import { EffectPreset } from "@/types";

export const EFFECT_PRESETS: EffectPreset[] = [
  {
    key: "caffeine",
    name: "Caffeine",
    kind: "buff",
    intensity: 3,
    durationMin: 300, // 5 hours
  },
  {
    key: "alcohol",
    name: "Alcohol",
    kind: "debuff",
    intensity: 3,
    durationMin: 480, // 8 hours
  },
  {
    key: "sleep_inertia",
    name: "Sleep Inertia",
    kind: "debuff",
    intensity: 2,
    durationMin: 45,
  },
];

export const getPreset = (key: string): EffectPreset | undefined =>
  EFFECT_PRESETS.find((p) => p.key === key);
