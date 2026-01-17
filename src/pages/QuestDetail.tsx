import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  Check,
  Trophy,
  ChevronUp,
  ChevronDown,
  Plus,
  MapPin,
  Clock,
  Play,
} from "lucide-react";
import { HudPanel } from "@/components/HudPanel";
import { PriorityChip } from "@/components/PriorityChip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp, selectNextStep } from "@/store/AppContext";
import { Quest, QuestStep } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const generateId = () => Math.random().toString(36).substring(2, 9);

export default function QuestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  const quest = state.quests.find((q) => q.id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuest, setEditedQuest] = useState<Quest | null>(null);
  const [newStepText, setNewStepText] = useState("");
  const [newStepLocation, setNewStepLocation] = useState("");
  const [newStepTime, setNewStepTime] = useState("");

  if (!quest) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Quest not found</p>
          <Button onClick={() => navigate("/quests")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Quests
          </Button>
        </div>
      </div>
    );
  }

  const nextStep = selectNextStep(quest);
  const allStepsDone = quest.steps.every((s) => s.done);

  const handleEdit = () => {
    setEditedQuest({ ...quest });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedQuest) {
      dispatch({ type: "UPDATE_QUEST", payload: editedQuest });
      setIsEditing(false);
      toast.success("Quest updated");
    }
  };

  const handleCancel = () => {
    setEditedQuest(null);
    setIsEditing(false);
  };

  const handleDelete = () => {
    dispatch({ type: "DELETE_QUEST", payload: quest.id });
    toast.success("Quest deleted");
    navigate("/quests");
  };

  const handleActivate = () => {
    dispatch({ type: "UPDATE_QUEST", payload: { ...quest, status: "active" } });
    toast.success("Quest activated!");
  };

  const handleTurnIn = () => {
    if (!allStepsDone) {
      toast.warning("Not all steps are complete, but turning in anyway...");
    }
    dispatch({ type: "TURN_IN_QUEST", payload: quest.id });
    toast.success(`+${quest.xpReward} XP!`, {
      icon: <Trophy className="w-4 h-4 text-accent" />,
    });
  };

  const toggleStep = (stepId: string) => {
    const updatedSteps = quest.steps.map((s) =>
      s.id === stepId ? { ...s, done: !s.done } : s
    );
    dispatch({
      type: "UPDATE_QUEST",
      payload: { ...quest, steps: updatedSteps },
    });
  };

  const moveStep = (stepId: string, direction: "up" | "down") => {
    const index = quest.steps.findIndex((s) => s.id === stepId);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === quest.steps.length - 1)
    ) {
      return;
    }

    const newSteps = [...quest.steps];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newSteps[index], newSteps[swapIndex]] = [newSteps[swapIndex], newSteps[index]];

    dispatch({
      type: "UPDATE_QUEST",
      payload: { ...quest, steps: newSteps },
    });
  };

  const addStep = () => {
    if (!newStepText.trim()) return;

    const newStep: QuestStep = {
      id: generateId(),
      text: newStepText.trim(),
      done: false,
      locationLabel: newStepLocation.trim() || undefined,
      timeWindow: newStepTime.trim() || undefined,
    };

    dispatch({
      type: "UPDATE_QUEST",
      payload: { ...quest, steps: [...quest.steps, newStep] },
    });

    setNewStepText("");
    setNewStepLocation("");
    setNewStepTime("");
    toast.success("Step added");
  };

  const deleteStep = (stepId: string) => {
    if (quest.steps.length <= 1) {
      toast.error("Quest must have at least one step");
      return;
    }
    dispatch({
      type: "UPDATE_QUEST",
      payload: { ...quest, steps: quest.steps.filter((s) => s.id !== stepId) },
    });
  };

  const currentQuest = isEditing && editedQuest ? editedQuest : quest;

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <Button
        variant="ghost"
        onClick={() => navigate("/quests")}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Quests
      </Button>

      <HudPanel
        title="Quest Details"
        actions={
          <div className="flex gap-2">
            {!isEditing && (
              <>
                <Button size="sm" variant="outline" onClick={handleEdit}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        }
      >
        <div className="space-y-6">
          {/* Title & Status */}
          <div className="space-y-4">
            {isEditing ? (
              <>
                <Input
                  value={editedQuest?.title || ""}
                  onChange={(e) =>
                    setEditedQuest({ ...editedQuest!, title: e.target.value })
                  }
                  className="text-xl font-bold"
                />
                <Textarea
                  value={editedQuest?.description || ""}
                  onChange={(e) =>
                    setEditedQuest({ ...editedQuest!, description: e.target.value })
                  }
                  placeholder="Description..."
                  rows={2}
                />
                <div className="flex gap-4">
                  <Select
                    value={editedQuest?.priority}
                    onValueChange={(v: "low" | "med" | "high") =>
                      setEditedQuest({ ...editedQuest!, priority: v })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="med">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={editedQuest?.tags.join(", ") || ""}
                    onChange={(e) =>
                      setEditedQuest({
                        ...editedQuest!,
                        tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Tags (comma-separated)"
                    className="flex-1"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-bold">{currentQuest.title}</h2>
                  <div className="flex items-center gap-2">
                    <PriorityChip priority={currentQuest.priority} />
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded uppercase font-medium",
                        currentQuest.status === "active" && "bg-primary/20 text-primary",
                        currentQuest.status === "backlog" && "bg-muted text-muted-foreground",
                        currentQuest.status === "completed" && "bg-success/20 text-success"
                      )}
                    >
                      {currentQuest.status}
                    </span>
                  </div>
                </div>
                {currentQuest.description && (
                  <p className="text-muted-foreground">{currentQuest.description}</p>
                )}
                {currentQuest.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentQuest.tags.map((tag) => (
                      <span key={tag} className="tag-chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* XP Reward */}
          <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
            <Trophy className="w-5 h-5 text-accent" />
            <span className="text-sm">XP Reward:</span>
            <span className="font-bold text-accent">{currentQuest.xpReward} XP</span>
          </div>

          {/* Steps */}
          <div>
            <h3 className="font-semibold mb-3">Steps</h3>
            <div className="space-y-2">
              {currentQuest.steps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border border-border/30",
                    step.done ? "bg-success/10" : "bg-secondary/30"
                  )}
                >
                  <button
                    onClick={() => toggleStep(step.id)}
                    className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5",
                      step.done
                        ? "bg-success border-success text-success-foreground"
                        : "border-muted-foreground"
                    )}
                  >
                    {step.done && <Check className="w-3 h-3" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm", step.done && "line-through text-muted-foreground")}>
                      {step.text}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {step.locationLabel && (
                        <span className="text-xs text-primary flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {step.locationLabel}
                        </span>
                      )}
                      {step.timeWindow && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {step.timeWindow}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1 shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-7 h-7"
                      onClick={() => moveStep(step.id, "up")}
                      disabled={index === 0}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-7 h-7"
                      onClick={() => moveStep(step.id, "down")}
                      disabled={index === currentQuest.steps.length - 1}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-7 h-7 text-destructive"
                      onClick={() => deleteStep(step.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Step */}
            <div className="mt-4 p-3 bg-secondary/20 rounded-lg space-y-2">
              <Input
                value={newStepText}
                onChange={(e) => setNewStepText(e.target.value)}
                placeholder="New step..."
              />
              <div className="flex gap-2">
                <Input
                  value={newStepLocation}
                  onChange={(e) => setNewStepLocation(e.target.value)}
                  placeholder="Location (optional)"
                  className="flex-1"
                />
                <Input
                  value={newStepTime}
                  onChange={(e) => setNewStepTime(e.target.value)}
                  placeholder="Time window (optional)"
                  className="flex-1"
                />
                <Button onClick={addStep}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border/50">
            {isEditing ? (
              <>
                <Button onClick={handleSave} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                {currentQuest.status === "backlog" && (
                  <Button onClick={handleActivate} className="flex-1">
                    <Play className="w-4 h-4 mr-2" /> Activate Quest
                  </Button>
                )}
                {currentQuest.status === "active" && (
                  <Button
                    onClick={handleTurnIn}
                    className={cn(
                      "flex-1",
                      allStepsDone
                        ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                        : ""
                    )}
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Turn In (+{currentQuest.xpReward} XP)
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </HudPanel>
    </div>
  );
}
