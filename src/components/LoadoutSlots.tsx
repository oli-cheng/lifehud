import { LoadoutSlots as LoadoutSlotsType } from "@/types";
import { 
  HardHat, 
  Shirt, 
  Umbrella, 
  ChevronDown, 
  Footprints, 
  Watch, 
  Briefcase 
} from "lucide-react";

const slotIcons = {
  headwear: HardHat,
  top: Shirt,
  outerwear: Umbrella,
  bottom: ChevronDown,
  footwear: Footprints,
  accessory: Watch,
  bag: Briefcase,
};

const slotLabels = {
  headwear: "Head",
  top: "Top",
  outerwear: "Outer",
  bottom: "Bottom",
  footwear: "Feet",
  accessory: "Accessory",
  bag: "Bag",
};

interface LoadoutSlotsProps {
  slots: LoadoutSlotsType;
  compact?: boolean;
}

export const LoadoutSlotsGrid = ({ slots, compact = false }: LoadoutSlotsProps) => {
  const entries = Object.entries(slots) as [keyof LoadoutSlotsType, string][];

  if (compact) {
    const filledSlots = entries.filter(([, value]) => value);
    return (
      <div className="flex flex-wrap gap-2">
        {filledSlots.slice(0, 3).map(([key, value]) => {
          const Icon = slotIcons[key];
          return (
            <div
              key={key}
              className="flex items-center gap-1.5 text-xs bg-secondary/50 px-2 py-1 rounded"
            >
              <Icon className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">{value}</span>
            </div>
          );
        })}
        {filledSlots.length > 3 && (
          <span className="text-xs text-muted-foreground">+{filledSlots.length - 3} more</span>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
      {entries.map(([key, value]) => {
        const Icon = slotIcons[key];
        return (
          <div
            key={key}
            className="bg-secondary/30 rounded-lg p-3 border border-border/30"
          >
            <div className="flex items-center gap-2 mb-1">
              <Icon className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {slotLabels[key]}
              </span>
            </div>
            <p className="text-sm font-medium truncate">
              {value || <span className="text-muted-foreground italic">Empty</span>}
            </p>
          </div>
        );
      })}
    </div>
  );
};
