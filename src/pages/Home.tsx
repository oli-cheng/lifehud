import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Scroll, Sparkles, Shirt, Plus, Coffee, Wine, Moon, Zap } from "lucide-react";
import { HudPanel } from "@/components/HudPanel";
import { QuestCard } from "@/components/QuestCard";
import { EffectCard } from "@/components/EffectCard";
import { LoadoutSlotsGrid } from "@/components/LoadoutSlots";
import { XpBar } from "@/components/XpBar";
import { Button } from "@/components/ui/button";
import { CreateQuestModal } from "@/components/modals/CreateQuestModal";
import { AddEffectModal } from "@/components/modals/AddEffectModal";
import { useApp, selectActiveQuests, selectActiveEffects, selectEquippedLoadout } from "@/store/AppContext";
import { EFFECT_PRESETS } from "@/store/presets";
import { Effect } from "@/types";
import { toast } from "sonner";

const generateId = () => Math.random().toString(36).substring(2, 9);

export default function Home() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [questModalOpen, setQuestModalOpen] = useState(false);
  const [effectModalOpen, setEffectModalOpen] = useState(false);

  const activeQuests = selectActiveQuests(state);
  const activeEffects = selectActiveEffects(state);
  const equippedLoadout = selectEquippedLoadout(state);

  const addPresetEffect = (presetKey: "caffeine" | "alcohol" | "sleep_inertia") => {
    const preset = EFFECT_PRESETS.find((p) => p.key === presetKey);
    if (!preset) return;

    const effect: Effect = {
      id: generateId(),
      name: preset.name,
      kind: preset.kind,
      intensity: preset.intensity,
      startAt: Date.now(),
      durationMin: preset.durationMin,
      tags: [],
      presetKey,
    };

    dispatch({ type: "ADD_EFFECT", payload: effect });
    toast.success(`${preset.name} effect added`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Desktop: 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Active Quests Panel */}
        <HudPanel
          title="Active Quests"
          icon={Scroll}
          actions={
            <Button size="sm" variant="ghost" onClick={() => navigate("/quests")}>
              View All
            </Button>
          }
        >
          {activeQuests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Scroll className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No active quests</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={() => setQuestModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-1" /> Create Quest
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeQuests.slice(0, 5).map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </div>
          )}
        </HudPanel>

        {/* Active Effects Panel */}
        <HudPanel
          title="Active Effects"
          icon={Sparkles}
          actions={
            <Button size="sm" variant="ghost" onClick={() => navigate("/effects")}>
              View All
            </Button>
          }
        >
          {activeEffects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No active effects</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeEffects.slice(0, 3).map((effect) => (
                <EffectCard key={effect.id} effect={effect} />
              ))}
            </div>
          )}

          {/* Quick Add Effects */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
            <Button
              size="sm"
              variant="outline"
              onClick={() => addPresetEffect("caffeine")}
              className="text-xs"
            >
              <Coffee className="w-3.5 h-3.5 mr-1" /> +Caffeine
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => addPresetEffect("alcohol")}
              className="text-xs"
            >
              <Wine className="w-3.5 h-3.5 mr-1" /> +Alcohol
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => addPresetEffect("sleep_inertia")}
              className="text-xs"
            >
              <Moon className="w-3.5 h-3.5 mr-1" /> +Sleep Inertia
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setEffectModalOpen(true)}
              className="text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Custom
            </Button>
          </div>
        </HudPanel>
      </div>

      {/* Bottom Bar: Equipment + XP + Quick Actions */}
      <HudPanel title="Status Bar" icon={Zap}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Equipped Loadout */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Shirt className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">
                  {equippedLoadout ? equippedLoadout.name : "No loadout equipped"}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate("/equipment")}
                className="text-xs"
              >
                Change
              </Button>
            </div>
            {equippedLoadout && (
              <LoadoutSlotsGrid slots={equippedLoadout.slots} compact />
            )}
          </div>

          {/* XP Bar */}
          <div className="flex flex-col justify-center">
            <XpBar />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-end gap-2">
            <Button size="sm" onClick={() => setQuestModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1" /> New Quest
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setEffectModalOpen(true)}>
              <Sparkles className="w-4 h-4 mr-1" /> New Effect
            </Button>
          </div>
        </div>
      </HudPanel>

      {/* Modals */}
      <CreateQuestModal open={questModalOpen} onOpenChange={setQuestModalOpen} />
      <AddEffectModal open={effectModalOpen} onOpenChange={setEffectModalOpen} />
    </div>
  );
}
