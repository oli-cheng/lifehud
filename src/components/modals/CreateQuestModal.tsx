import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/store/AppContext";
import { Quest, QuestStep } from "@/types";
import { toast } from "sonner";

interface CreateQuestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const CreateQuestModal = ({ open, onOpenChange }: CreateQuestModalProps) => {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"backlog" | "active">("active");
  const [priority, setPriority] = useState<"low" | "med" | "high">("med");
  const [tags, setTags] = useState("");
  const [steps, setSteps] = useState<Partial<QuestStep>[]>([{ text: "", locationLabel: "" }]);
  const [xpReward, setXpReward] = useState(25);

  const addStep = () => {
    setSteps([...steps, { text: "", locationLabel: "" }]);
  };

  const updateStep = (index: number, field: string, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validSteps = steps.filter((s) => s.text?.trim());
    if (!title.trim() || validSteps.length === 0) {
      toast.error("Title and at least one step required");
      return;
    }

    const quest: Quest = {
      id: generateId(),
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      steps: validSteps.map((s) => ({
        id: generateId(),
        text: s.text!.trim(),
        done: false,
        locationLabel: s.locationLabel?.trim() || undefined,
        timeWindow: s.timeWindow?.trim() || undefined,
      })),
      xpReward,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    dispatch({ type: "ADD_QUEST", payload: quest });
    toast.success("Quest created!");
    onOpenChange(false);
    resetForm();
    navigate(`/quests/${quest.id}`);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("active");
    setPriority("med");
    setTags("");
    setSteps([{ text: "", locationLabel: "" }]);
    setXpReward(25);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Quest</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Quest title..."
            />
          </div>

          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this quest about?"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(v: "backlog" | "active") => setStatus(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v: "low" | "med" | "high") => setPriority(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="med">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="work, urgent"
              />
            </div>

            <div>
              <Label htmlFor="xp">XP Reward</Label>
              <Input
                id="xp"
                type="number"
                min={1}
                max={1000}
                value={xpReward}
                onChange={(e) => setXpReward(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <Label>Steps</Label>
            <div className="space-y-2 mt-2">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={step.text || ""}
                    onChange={(e) => updateStep(index, "text", e.target.value)}
                    placeholder="Step description..."
                    className="flex-1"
                  />
                  <Input
                    value={step.locationLabel || ""}
                    onChange={(e) => updateStep(index, "locationLabel", e.target.value)}
                    placeholder="Location (opt)"
                    className="w-28"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStep(index)}
                    disabled={steps.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addStep}>
                <Plus className="w-4 h-4 mr-1" /> Add Step
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Quest</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
