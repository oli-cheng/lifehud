# 🎮 LifeHUD

**A video-game HUD for real life.** Track quests, manage buffs & debuffs, and equip loadouts — all from a sleek, dark-themed dashboard inspired by WoW and RuneScape.

---

## ⚡ Pitch

> What if your daily to-dos felt like quest objectives, your coffee was a +3 Caffeine buff, and your outfit was an equipped loadout? **LifeHUD** gamifies your real-world routines without the bloat — just a fast, satisfying core loop: *see next step → complete it → turn in the quest → gain XP.*

---

## 🧭 Features

| Module | What it does |
|---|---|
| **🗡️ Quests** | Missions with steps, priorities, tags, and location markers. One-click step completion from the Home HUD. |
| **✨ Effects** | Buff/debuff timers with live countdowns. Presets for Caffeine, Alcohol, and Sleep Inertia. |
| **🎒 Equipment** | Outfit slot grids and named loadouts (Gym, Meeting, Travel). Equip in one click. |
| **📊 Home HUD** | At-a-glance dashboard: active quests, running effects, equipped loadout, XP bar & level. |
| **🔍 Global Search** | Instantly find any quest, effect, or loadout from the top bar. |

---

## 🏗️ Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui**
- **localStorage** persistence (zero backend, zero auth)
- Fully responsive — mobile-first, desktop-excellent

---

## 🚀 Getting Started

```sh
# Clone & install
git clone <YOUR_GIT_URL>
cd lifehud
npm install

# Start dev server
npm run dev
```

Demo data is seeded automatically on first launch. Hit **Settings → Reset Demo Data** to restore it anytime.

---

## 🗺️ Routes

| Route | Page |
|---|---|
| `/` | Home HUD |
| `/quests` | Quest Log (Backlog / Active / Completed) |
| `/quests/:id` | Quest Detail & Editor |
| `/effects` | Effects Tracker |
| `/equipment` | Equipment & Loadouts |
| `/settings` | Preferences & Data Reset |

---

## 🎯 Core Loop

```
See "Next Step" on Home → Complete it (one click) → All steps done? → Turn In → +XP 🎉
```

---

## 📄 License

MIT
