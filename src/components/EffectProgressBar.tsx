import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface EffectProgressBarProps {
  startAt: number;
  durationMin: number;
  kind: "buff" | "debuff";
}

export const EffectProgressBar = ({ startAt, durationMin, kind }: EffectProgressBarProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculate = () => {
      const elapsed = Date.now() - startAt;
      const total = durationMin * 60 * 1000;
      const remaining = Math.max(0, 1 - elapsed / total);
      setProgress(remaining * 100);
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [startAt, durationMin]);

  return (
    <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
      <div
        className={cn(
          "h-full rounded-full transition-all duration-1000",
          kind === "buff" ? "bg-buff" : "bg-debuff"
        )}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
