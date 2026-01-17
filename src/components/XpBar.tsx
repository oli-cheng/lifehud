import { useApp, getLevel, getXpProgress } from "@/store/AppContext";
import { Sparkles } from "lucide-react";

export const XpBar = () => {
  const { state } = useApp();
  const level = getLevel(state.xpTotal);
  const progress = getXpProgress(state.xpTotal);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <Sparkles className="w-4 h-4 text-xp-glow" />
        <span className="text-sm font-bold text-xp-glow">LVL {level}</span>
      </div>
      <div className="flex-1 xp-bar-container">
        <div
          className="xp-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground font-mono">
        {progress}/100 XP
      </span>
    </div>
  );
};
