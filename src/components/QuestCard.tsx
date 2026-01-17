import { Link } from "react-router-dom";
import { MapPin, ChevronRight, Check, Trophy } from "lucide-react";
import { Quest } from "@/types";
import { selectNextStep, useApp } from "@/store/AppContext";
import { PriorityChip } from "./PriorityChip";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface QuestCardProps {
  quest: Quest;
  showActions?: boolean;
}

export const QuestCard = ({ quest, showActions = true }: QuestCardProps) => {
  const { dispatch } = useApp();
  const nextStep = selectNextStep(quest);
  const allStepsDone = quest.steps.every((s) => s.done);
  const hasLocationMarkers = quest.steps.some((s) => s.locationLabel);
  const completedSteps = quest.steps.filter((s) => s.done).length;

  const handleCompleteStep = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (nextStep) {
      dispatch({ type: "COMPLETE_STEP", payload: { questId: quest.id, stepId: nextStep.id } });
      toast.success("Step complete!", { duration: 2000 });
    }
  };

  const handleTurnIn = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: "TURN_IN_QUEST", payload: quest.id });
    toast.success(`+${quest.xpReward} XP`, {
      icon: <Trophy className="w-4 h-4 text-accent" />,
      duration: 3000,
    });
  };

  return (
    <Link
      to={`/quests/${quest.id}`}
      className="block bg-secondary/30 hover:bg-secondary/50 rounded-lg p-3 transition-colors border border-border/30 hover:border-primary/30"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{quest.title}</h4>
          {hasLocationMarkers && (
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <PriorityChip priority={quest.priority} />
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {quest.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {quest.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag-chip">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${(completedSteps / quest.steps.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {completedSteps}/{quest.steps.length}
        </span>
      </div>

      {nextStep && !allStepsDone && (
        <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
          <span className="text-primary">→</span>
          <span className="truncate">{nextStep.text}</span>
          {nextStep.locationLabel && (
            <span className="text-primary shrink-0">@ {nextStep.locationLabel}</span>
          )}
        </div>
      )}

      {showActions && quest.status === "active" && (
        <div className="flex gap-2 mt-3">
          {allStepsDone ? (
            <Button
              size="sm"
              onClick={handleTurnIn}
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Trophy className="w-3.5 h-3.5 mr-1.5" />
              Turn In (+{quest.xpReward} XP)
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleCompleteStep}
              className="flex-1"
            >
              <Check className="w-3.5 h-3.5 mr-1.5" />
              Complete Step
            </Button>
          )}
        </div>
      )}
    </Link>
  );
};
