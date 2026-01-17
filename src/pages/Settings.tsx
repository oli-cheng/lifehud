import { useState, useEffect } from "react";
import { RotateCcw, Moon, Sun, Database, Info } from "lucide-react";
import { HudPanel } from "@/components/HudPanel";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useApp } from "@/store/AppContext";
import { CURRENT_SCHEMA_VERSION } from "@/store/seedData";
import { toast } from "sonner";

export default function Settings() {
  const { state, dispatch } = useApp();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("light");
    } else {
      root.classList.add("light");
    }
  }, [isDark]);

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      dispatch({ type: "RESET_DATA" });
      toast.success("Data reset to demo state");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Theme */}
        <HudPanel title="Appearance" icon={isDark ? Moon : Sun}>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="theme-toggle" className="text-base font-medium">
                Dark Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Toggle between dark and light theme
              </p>
            </div>
            <Switch
              id="theme-toggle"
              checked={isDark}
              onCheckedChange={setIsDark}
            />
          </div>
        </HudPanel>

        {/* Data Management */}
        <HudPanel title="Data Management" icon={Database}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Reset Demo Data</p>
                <p className="text-sm text-muted-foreground">
                  Reset all data to the initial demo state
                </p>
              </div>
              <Button variant="destructive" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" /> Reset Data
              </Button>
            </div>

            <div className="pt-4 border-t border-border/50">
              <h4 className="font-medium mb-3">Statistics</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <div className="text-muted-foreground">Total Quests</div>
                  <div className="text-2xl font-bold">{state.quests.length}</div>
                </div>
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <div className="text-muted-foreground">Total XP</div>
                  <div className="text-2xl font-bold">{state.xpTotal}</div>
                </div>
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <div className="text-muted-foreground">Effects</div>
                  <div className="text-2xl font-bold">{state.effects.length}</div>
                </div>
                <div className="bg-secondary/30 p-3 rounded-lg">
                  <div className="text-muted-foreground">Loadouts</div>
                  <div className="text-2xl font-bold">{state.loadouts.length}</div>
                </div>
              </div>
            </div>
          </div>
        </HudPanel>

        {/* System Info */}
        <HudPanel title="System Info" icon={Info}>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Schema Version</span>
              <span className="font-mono">{CURRENT_SCHEMA_VERSION}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Storage Type</span>
              <span className="font-mono">localStorage</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">App Version</span>
              <span className="font-mono">1.0.0</span>
            </div>
          </div>
        </HudPanel>

        {/* About */}
        <div className="text-center text-sm text-muted-foreground py-4">
          <p>LifeHUD - Your real-life video game HUD</p>
          <p className="mt-1">Inspired by WoW & RuneScape</p>
        </div>
      </div>
    </div>
  );
}
