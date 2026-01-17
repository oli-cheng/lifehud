import { cn } from "@/lib/utils";

interface IntensityPipsProps {
  intensity: 1 | 2 | 3 | 4 | 5;
  kind?: "buff" | "debuff";
}

export const IntensityPips = ({ intensity, kind = "buff" }: IntensityPipsProps) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={cn(
            "intensity-pip",
            i <= intensity
              ? kind === "buff"
                ? "bg-buff shadow-[0_0_6px_hsl(var(--buff)/0.6)]"
                : "bg-debuff shadow-[0_0_6px_hsl(var(--debuff)/0.6)]"
              : "intensity-pip-inactive"
          )}
        />
      ))}
    </div>
  );
};
