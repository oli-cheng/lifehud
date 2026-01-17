import { cn } from "@/lib/utils";

interface PriorityChipProps {
  priority: "low" | "med" | "high";
}

export const PriorityChip = ({ priority }: PriorityChipProps) => {
  return (
    <span
      className={cn(
        "priority-chip",
        priority === "low" && "priority-low",
        priority === "med" && "priority-med",
        priority === "high" && "priority-high"
      )}
    >
      {priority}
    </span>
  );
};
