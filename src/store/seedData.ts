import { AppState } from "@/types";

const generateId = () => Math.random().toString(36).substring(2, 9);

export const CURRENT_SCHEMA_VERSION = 1;

export const createSeedData = (): AppState => {
  const now = Date.now();
  
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    xpTotal: 120,
    quests: [
      {
        id: generateId(),
        title: "Weekly Grocery Run",
        description: "Get essentials for the week including healthy meal prep ingredients",
        status: "active",
        priority: "high",
        tags: ["errands", "health"],
        steps: [
          { id: generateId(), text: "Check pantry and make list", done: true },
          { id: generateId(), text: "Pick up vegetables and proteins", done: false, locationLabel: "Trader Joe's" },
          { id: generateId(), text: "Get coffee beans and snacks", done: false, locationLabel: "Whole Foods" },
        ],
        xpReward: 30,
        createdAt: now - 86400000,
        updatedAt: now,
      },
      {
        id: generateId(),
        title: "Morning Workout Routine",
        description: "Complete the full gym session as planned",
        status: "active",
        priority: "med",
        tags: ["fitness", "daily"],
        steps: [
          { id: generateId(), text: "15 min cardio warmup", done: true, locationLabel: "Gym", timeWindow: "6:00 AM - 6:15 AM" },
          { id: generateId(), text: "Upper body strength training", done: false, locationLabel: "Gym" },
          { id: generateId(), text: "Cool down and stretch", done: false },
        ],
        xpReward: 25,
        createdAt: now - 172800000,
        updatedAt: now,
      },
      {
        id: generateId(),
        title: "Ship Client Presentation",
        description: "Finalize and send the Q1 review deck",
        status: "backlog",
        priority: "high",
        tags: ["work", "deadline"],
        steps: [
          { id: generateId(), text: "Review slide content", done: false },
          { id: generateId(), text: "Add final metrics", done: false },
          { id: generateId(), text: "Send to client", done: false },
        ],
        xpReward: 50,
        createdAt: now - 259200000,
        updatedAt: now,
      },
    ],
    effects: [
      {
        id: generateId(),
        name: "Caffeine",
        kind: "buff",
        intensity: 3,
        startAt: now - 30 * 60 * 1000, // Started 30 min ago
        durationMin: 300,
        tags: ["energy"],
        presetKey: "caffeine",
      },
      {
        id: generateId(),
        name: "Sleep Inertia",
        kind: "debuff",
        intensity: 2,
        startAt: now - 15 * 60 * 1000, // Started 15 min ago
        durationMin: 45,
        tags: ["morning"],
        presetKey: "sleep_inertia",
      },
    ],
    loadouts: [
      {
        id: generateId(),
        name: "Gym Set",
        contextTags: ["fitness", "morning"],
        slots: {
          headwear: "Baseball Cap",
          top: "Dry-fit Tank",
          outerwear: "Zip Hoodie",
          bottom: "Athletic Shorts",
          footwear: "Running Shoes",
          accessory: "Fitness Watch",
          bag: "Gym Duffel",
        },
        checklist: ["Water bottle", "Towel", "Earbuds", "Protein bar"],
        checklistChecked: ["Water bottle"],
        isEquipped: false,
      },
      {
        id: generateId(),
        name: "Meeting Set",
        contextTags: ["work", "professional"],
        slots: {
          headwear: "",
          top: "Oxford Shirt",
          outerwear: "Blazer",
          bottom: "Chinos",
          footwear: "Leather Loafers",
          accessory: "Watch",
          bag: "Laptop Bag",
        },
        checklist: ["Laptop", "Notebook", "Business cards", "Charger"],
        checklistChecked: ["Laptop", "Notebook"],
        isEquipped: true,
      },
    ],
  };
};
