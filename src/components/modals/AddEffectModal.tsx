import { useState } from "react";
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
import { Effect } from "@/types";
import { toast } from "sonner";

interface AddEffectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const AddEffectModal = ({ open, onOpenChange }: AddEffectModalProps) => {
  const { dispatch } = useApp();
  const [name, setName] = useState("");
  const [kind, setKind] = useState<"buff" | "debuff">("buff");
  const [intensity, setIntensity] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [durationMin, setDurationMin] = useState(60);
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Effect name required");
      return;
    }

    const effect: Effect = {
      id: generateId(),
      name: name.trim(),
      kind,
      intensity,
      startAt: Date.now(),
      durationMin,
      tags: [],
      notes: notes.trim() || undefined,
    };

    dispatch({ type: "ADD_EFFECT", payload: effect });
    toast.success(`${kind === "buff" ? "Buff" : "Debuff"} added: ${name}`);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setKind("buff");
    setIntensity(3);
    setDurationMin(60);
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Custom Effect</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Effect Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Focus Mode"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Type</Label>
              <Select value={kind} onValueChange={(v: "buff" | "debuff") => setKind(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buff">Buff</SelectItem>
                  <SelectItem value="debuff">Debuff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Intensity</Label>
              <Select 
                value={intensity.toString()} 
                onValueChange={(v) => setIntensity(Number(v) as 1 | 2 | 3 | 4 | 5)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {i} - {["Minimal", "Light", "Moderate", "Strong", "Intense"][i - 1]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min={1}
              max={1440}
              value={durationMin}
              onChange={(e) => setDurationMin(Number(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes..."
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Effect</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
