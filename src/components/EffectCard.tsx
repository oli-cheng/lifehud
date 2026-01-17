import { Effect } from "@/types";
import { IntensityPips } from "./IntensityPips";
import { CountdownTimer } from "./CountdownTimer";
import { EffectProgressBar } from "./EffectProgressBar";
import { RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/store/AppContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EffectCardProps {
  effect: Effect;
  isExpired?: boolean;
}

export const EffectCard = ({ effect, isExpired = false }: EffectCardProps) => {
  const { dispatch } = useApp();
  const endTime = effect.startAt + effect.durationMin * 60 * 1000;

  const handleDelete = () => {
    dispatch({ type: "DELETE_EFFECT", payload: effect.id });
    toast.success("Effect removed");
  };

  const handleReUp = () => {
    const newEffect: Effect = {
      ...effect,
      id: Math.random().toString(36).substring(2, 9),
      startAt: Date.now(),
    };
    dispatch({ type: "ADD_EFFECT", payload: newEffect });
    dispatch({ type: "DELETE_EFFECT", payload: effect.id });
    toast.success(`${effect.name} restarted`);
  };

  return (
    <div
      className={cn(
        "bg-secondary/30 rounded-lg p-3 border border-border/30",
        isExpired && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded font-medium",
              effect.kind === "buff" ? "buff-chip" : "debuff-chip"
            )}
          >
            {effect.kind}
          </span>
          <h4 className="font-medium text-sm">{effect.name}</h4>
        </div>
        <IntensityPips intensity={effect.intensity} kind={effect.kind} />
      </div>

      <div className="mb-2">
        <CountdownTimer endTime={endTime} />
      </div>

      <EffectProgressBar
        startAt={effect.startAt}
        durationMin={effect.durationMin}
        kind={effect.kind}
      />

      {effect.notes && (
        <p className="text-xs text-muted-foreground mt-2">{effect.notes}</p>
      )}

      <div className="flex gap-2 mt-3">
        {isExpired ? (
          <Button size="sm" variant="secondary" onClick={handleReUp} className="flex-1">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Re-up
          </Button>
        ) : (
          <Button size="sm" variant="ghost" onClick={handleDelete} className="text-destructive hover:text-destructive">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
};
