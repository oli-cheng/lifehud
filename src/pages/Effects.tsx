import { useState } from "react";
import { Coffee, Wine, Moon, Plus, Sparkles, Clock } from "lucide-react";
import { HudPanel } from "@/components/HudPanel";
import { EffectCard } from "@/components/EffectCard";
import { Button } from "@/components/ui/button";
import { AddEffectModal } from "@/components/modals/AddEffectModal";
import { useApp, selectActiveEffects, selectExpiredEffects } from "@/store/AppContext";
import { EFFECT_PRESETS } from "@/store/presets";
import { Effect } from "@/types";
import { toast } from "sonner";

const generateId = () => Math.random().toString(36).substring(2, 9);

export default function Effects() {
  const { state, dispatch } = useApp();
  const [effectModalOpen, setEffectModalOpen] = useState(false);

  const activeEffects = selectActiveEffects(state);
  const expiredEffects = selectExpiredEffects(state);

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

  const clearExpired = () => {
    expiredEffects.forEach((e) => {
      dispatch({ type: "DELETE_EFFECT", payload: e.id });
    });
    toast.success("Expired effects cleared");
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Effects Tracker</h1>
        <Button onClick={() => setEffectModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Custom Effect
        </Button>
      </div>

      {/* Quick Add Presets */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Add</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => addPresetEffect("caffeine")}
            className="gap-2"
          >
            <Coffee className="w-4 h-4" />
            <div className="text-left">
              <div className="text-sm font-medium">Caffeine</div>
              <div className="text-xs text-muted-foreground">Buff • 5 hours</div>
            </div>
          </Button>
          <Button
            variant="outline"
            onClick={() => addPresetEffect("alcohol")}
            className="gap-2"
          >
            <Wine className="w-4 h-4" />
            <div className="text-left">
              <div className="text-sm font-medium">Alcohol</div>
              <div className="text-xs text-muted-foreground">Debuff • 8 hours</div>
            </div>
          </Button>
          <Button
            variant="outline"
            onClick={() => addPresetEffect("sleep_inertia")}
            className="gap-2"
          >
            <Moon className="w-4 h-4" />
            <div className="text-left">
              <div className="text-sm font-medium">Sleep Inertia</div>
              <div className="text-xs text-muted-foreground">Debuff • 45 min</div>
            </div>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Effects */}
        <HudPanel title="Active Effects" icon={Sparkles}>
          {activeEffects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No active effects</p>
              <p className="text-sm mt-1">Add an effect using the presets above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeEffects.map((effect) => (
                <EffectCard key={effect.id} effect={effect} />
              ))}
            </div>
          )}
        </HudPanel>

        {/* Expired Effects */}
        <HudPanel
          title="Expired Effects"
          icon={Clock}
          actions={
            expiredEffects.length > 0 && (
              <Button size="sm" variant="ghost" onClick={clearExpired}>
                Clear All
              </Button>
            )
          }
        >
          {expiredEffects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No expired effects</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expiredEffects.map((effect) => (
                <EffectCard key={effect.id} effect={effect} isExpired />
              ))}
            </div>
          )}
        </HudPanel>
      </div>

      <AddEffectModal open={effectModalOpen} onOpenChange={setEffectModalOpen} />
    </div>
  );
}
