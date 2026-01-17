import { useState } from "react";
import { Shirt, Plus, Check, Trash2, Edit, CheckSquare, Square } from "lucide-react";
import { HudPanel } from "@/components/HudPanel";
import { LoadoutSlotsGrid } from "@/components/LoadoutSlots";
import { Button } from "@/components/ui/button";
import { LoadoutEditorModal } from "@/components/modals/LoadoutEditorModal";
import { useApp, selectEquippedLoadout } from "@/store/AppContext";
import { Loadout } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Equipment() {
  const { state, dispatch } = useApp();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingLoadout, setEditingLoadout] = useState<Loadout | null>(null);

  const equippedLoadout = selectEquippedLoadout(state);

  const handleEquip = (loadoutId: string) => {
    const loadout = state.loadouts.find((l) => l.id === loadoutId);
    dispatch({ type: "EQUIP_LOADOUT", payload: loadoutId });
    toast.success(`Equipped: ${loadout?.name}`);
  };

  const handleEdit = (loadout: Loadout) => {
    setEditingLoadout(loadout);
    setEditorOpen(true);
  };

  const handleDelete = (loadoutId: string) => {
    dispatch({ type: "DELETE_LOADOUT", payload: loadoutId });
    toast.success("Loadout deleted");
  };

  const handleCreate = () => {
    setEditingLoadout(null);
    setEditorOpen(true);
  };

  const toggleChecklistItem = (loadoutId: string, item: string) => {
    dispatch({ type: "TOGGLE_CHECKLIST_ITEM", payload: { loadoutId, item } });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Equipment</h1>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" /> New Loadout
        </Button>
      </div>

      {/* Current Equipped Loadout */}
      <div className="mb-6">
        <HudPanel title="Currently Equipped" icon={Shirt}>
          {equippedLoadout ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{equippedLoadout.name}</h3>
                {equippedLoadout.contextTags.length > 0 && (
                  <div className="flex gap-2">
                    {equippedLoadout.contextTags.map((tag) => (
                      <span key={tag} className="tag-chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <LoadoutSlotsGrid slots={equippedLoadout.slots} />

              {/* Checklist */}
              {equippedLoadout.checklist.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <h4 className="text-sm font-medium mb-2">Checklist</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {equippedLoadout.checklist.map((item) => {
                      const isChecked = equippedLoadout.checklistChecked.includes(item);
                      return (
                        <button
                          key={item}
                          onClick={() => toggleChecklistItem(equippedLoadout.id, item)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors",
                            isChecked
                              ? "bg-success/20 text-success"
                              : "bg-secondary/30 text-foreground hover:bg-secondary/50"
                          )}
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 shrink-0" />
                          )}
                          <span className={cn(isChecked && "line-through")}>{item}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Shirt className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No loadout equipped</p>
              <p className="text-sm mt-1">Select a loadout below to equip it</p>
            </div>
          )}
        </HudPanel>
      </div>

      {/* All Loadouts */}
      <h2 className="text-lg font-semibold mb-4">All Loadouts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.loadouts.map((loadout) => (
          <div
            key={loadout.id}
            className={cn(
              "hud-panel",
              loadout.isEquipped && "ring-2 ring-primary"
            )}
          >
            <div className="hud-panel-header">
              <h3 className="font-semibold text-sm flex-1">{loadout.name}</h3>
              {loadout.isEquipped && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                  Equipped
                </span>
              )}
            </div>
            <div className="hud-panel-content">
              {loadout.contextTags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {loadout.contextTags.map((tag) => (
                    <span key={tag} className="tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <LoadoutSlotsGrid slots={loadout.slots} compact />

              {loadout.checklist.length > 0 && (
                <div className="mt-3 text-xs text-muted-foreground">
                  {loadout.checklist.length} checklist items
                </div>
              )}

              <div className="flex gap-2 mt-4">
                {!loadout.isEquipped && (
                  <Button
                    size="sm"
                    onClick={() => handleEquip(loadout.id)}
                    className="flex-1"
                  >
                    <Check className="w-4 h-4 mr-1" /> Equip
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(loadout)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(loadout.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {state.loadouts.length === 0 && (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            <p>No loadouts created yet</p>
            <Button variant="outline" className="mt-3" onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" /> Create Loadout
            </Button>
          </div>
        )}
      </div>

      <LoadoutEditorModal
        open={editorOpen}
        onOpenChange={setEditorOpen}
        editingLoadout={editingLoadout}
      />
    </div>
  );
}
