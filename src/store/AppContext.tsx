import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { AppState, Quest, Effect, Loadout, QuestStep } from "@/types";
import { createSeedData, CURRENT_SCHEMA_VERSION } from "./seedData";

// Using localStorage for persistence - simpler than IndexedDB for this app's data size
// and provides synchronous access which works well with React's rendering model
const STORAGE_KEY = "lifehud_state";

type Action =
  | { type: "LOAD_STATE"; payload: AppState }
  | { type: "RESET_DATA" }
  | { type: "ADD_QUEST"; payload: Quest }
  | { type: "UPDATE_QUEST"; payload: Quest }
  | { type: "DELETE_QUEST"; payload: string }
  | { type: "COMPLETE_STEP"; payload: { questId: string; stepId: string } }
  | { type: "TURN_IN_QUEST"; payload: string }
  | { type: "ADD_EFFECT"; payload: Effect }
  | { type: "DELETE_EFFECT"; payload: string }
  | { type: "ADD_LOADOUT"; payload: Loadout }
  | { type: "UPDATE_LOADOUT"; payload: Loadout }
  | { type: "DELETE_LOADOUT"; payload: string }
  | { type: "EQUIP_LOADOUT"; payload: string }
  | { type: "TOGGLE_CHECKLIST_ITEM"; payload: { loadoutId: string; item: string } };

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "LOAD_STATE":
      return action.payload;
    
    case "RESET_DATA":
      return createSeedData();
    
    case "ADD_QUEST":
      return { ...state, quests: [...state.quests, action.payload] };
    
    case "UPDATE_QUEST":
      return {
        ...state,
        quests: state.quests.map((q) =>
          q.id === action.payload.id ? { ...action.payload, updatedAt: Date.now() } : q
        ),
      };
    
    case "DELETE_QUEST":
      return { ...state, quests: state.quests.filter((q) => q.id !== action.payload) };
    
    case "COMPLETE_STEP":
      return {
        ...state,
        quests: state.quests.map((q) =>
          q.id === action.payload.questId
            ? {
                ...q,
                steps: q.steps.map((s) =>
                  s.id === action.payload.stepId ? { ...s, done: true } : s
                ),
                updatedAt: Date.now(),
              }
            : q
        ),
      };
    
    case "TURN_IN_QUEST":
      const quest = state.quests.find((q) => q.id === action.payload);
      if (!quest) return state;
      return {
        ...state,
        xpTotal: state.xpTotal + quest.xpReward,
        quests: state.quests.map((q) =>
          q.id === action.payload
            ? { ...q, status: "completed" as const, updatedAt: Date.now() }
            : q
        ),
      };
    
    case "ADD_EFFECT":
      return { ...state, effects: [...state.effects, action.payload] };
    
    case "DELETE_EFFECT":
      return { ...state, effects: state.effects.filter((e) => e.id !== action.payload) };
    
    case "ADD_LOADOUT":
      return { ...state, loadouts: [...state.loadouts, action.payload] };
    
    case "UPDATE_LOADOUT":
      return {
        ...state,
        loadouts: state.loadouts.map((l) =>
          l.id === action.payload.id ? action.payload : l
        ),
      };
    
    case "DELETE_LOADOUT":
      return { ...state, loadouts: state.loadouts.filter((l) => l.id !== action.payload) };
    
    case "EQUIP_LOADOUT":
      return {
        ...state,
        loadouts: state.loadouts.map((l) => ({
          ...l,
          isEquipped: l.id === action.payload,
        })),
      };
    
    case "TOGGLE_CHECKLIST_ITEM":
      return {
        ...state,
        loadouts: state.loadouts.map((l) =>
          l.id === action.payload.loadoutId
            ? {
                ...l,
                checklistChecked: l.checklistChecked.includes(action.payload.item)
                  ? l.checklistChecked.filter((i) => i !== action.payload.item)
                  : [...l.checklistChecked, action.payload.item],
              }
            : l
        ),
      };
    
    default:
      return state;
  }
};

// Selectors
export const selectActiveQuests = (state: AppState): Quest[] =>
  state.quests.filter((q) => q.status === "active");

export const selectBacklogQuests = (state: AppState): Quest[] =>
  state.quests.filter((q) => q.status === "backlog");

export const selectCompletedQuests = (state: AppState): Quest[] =>
  state.quests.filter((q) => q.status === "completed");

export const selectNextStep = (quest: Quest): QuestStep | null =>
  quest.steps.find((s) => !s.done) || null;

export const selectEquippedLoadout = (state: AppState): Loadout | null =>
  state.loadouts.find((l) => l.isEquipped) || null;

export const selectActiveEffects = (state: AppState): Effect[] => {
  const now = Date.now();
  return state.effects.filter((e) => {
    const endTime = e.startAt + e.durationMin * 60 * 1000;
    return endTime > now;
  });
};

export const selectExpiredEffects = (state: AppState): Effect[] => {
  const now = Date.now();
  return state.effects.filter((e) => {
    const endTime = e.startAt + e.durationMin * 60 * 1000;
    return endTime <= now;
  });
};

export const getLevel = (xp: number): number => Math.floor(xp / 100) + 1;
export const getXpProgress = (xp: number): number => xp % 100;

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, createSeedData());

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AppState;
        // Check schema version - reset if mismatch
        if (parsed.schemaVersion !== CURRENT_SCHEMA_VERSION) {
          dispatch({ type: "RESET_DATA" });
        } else {
          dispatch({ type: "LOAD_STATE", payload: parsed });
        }
      }
    } catch (error) {
      console.error("Failed to load state:", error);
    }
  }, []);

  // Persist state to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save state:", error);
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
