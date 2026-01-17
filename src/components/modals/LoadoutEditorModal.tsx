import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/store/AppContext";
import { Loadout, LoadoutSlots } from "@/types";
import { toast } from "sonner";

interface LoadoutEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingLoadout?: Loadout | null;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const emptySlots: LoadoutSlots = {
  headwear: "",
  top: "",
  outerwear: "",
  bottom: "",
  footwear: "",
  accessory: "",
  bag: "",
};

const slotLabels: Record<keyof LoadoutSlots, string> = {
  headwear: "Headwear",
  top: "Top",
  outerwear: "Outerwear",
  bottom: "Bottom",
  footwear: "Footwear",
  accessory: "Accessory",
  bag: "Bag",
};

export const LoadoutEditorModal = ({ open, onOpenChange, editingLoadout }: LoadoutEditorModalProps) => {
  const { dispatch } = useApp();
  const [name, setName] = useState("");
  const [contextTags, setContextTags] = useState("");
  const [slots, setSlots] = useState<LoadoutSlots>(emptySlots);
  const [checklist, setChecklist] = useState<string[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState("");

  useEffect(() => {
    if (editingLoadout) {
      setName(editingLoadout.name);
      setContextTags(editingLoadout.contextTags.join(", "));
      setSlots(editingLoadout.slots);
      setChecklist(editingLoadout.checklist);
    } else {
      resetForm();
    }
  }, [editingLoadout, open]);

  const resetForm = () => {
    setName("");
    setContextTags("");
    setSlots(emptySlots);
    setChecklist([]);
    setNewChecklistItem("");
  };

  const updateSlot = (key: keyof LoadoutSlots, value: string) => {
    setSlots({ ...slots, [key]: value });
  };

  const addChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setChecklist([...checklist, newChecklistItem.trim()]);
      setNewChecklistItem("");
    }
  };

  const removeChecklistItem = (index: number) => {
    setChecklist(checklist.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Loadout name required");
      return;
    }

    const loadout: Loadout = {
      id: editingLoadout?.id || generateId(),
      name: name.trim(),
      contextTags: contextTags.split(",").map((t) => t.trim()).filter(Boolean),
      slots,
      checklist,
      checklistChecked: editingLoadout?.checklistChecked || [],
      isEquipped: editingLoadout?.isEquipped || false,
    };

    if (editingLoadout) {
      dispatch({ type: "UPDATE_LOADOUT", payload: loadout });
      toast.success("Loadout updated!");
    } else {
      dispatch({ type: "ADD_LOADOUT", payload: loadout });
      toast.success("Loadout created!");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingLoadout ? "Edit Loadout" : "Create Loadout"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Loadout Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Gym Set"
            />
          </div>

          <div>
            <Label htmlFor="tags">Context Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={contextTags}
              onChange={(e) => setContextTags(e.target.value)}
              placeholder="fitness, morning"
            />
          </div>

          <div>
            <Label className="mb-2 block">Equipment Slots</Label>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(slots) as (keyof LoadoutSlots)[]).map((key) => (
                <div key={key}>
                  <Label htmlFor={key} className="text-xs text-muted-foreground">
                    {slotLabels[key]}
                  </Label>
                  <Input
                    id={key}
                    value={slots[key]}
                    onChange={(e) => updateSlot(key, e.target.value)}
                    placeholder={`${slotLabels[key]}...`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Checklist</Label>
            <div className="space-y-2">
              {checklist.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-1 text-sm bg-secondary/50 px-3 py-2 rounded">
                    {item}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeChecklistItem(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  placeholder="Add checklist item..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addChecklistItem();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addChecklistItem}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingLoadout ? "Save Changes" : "Create Loadout"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
