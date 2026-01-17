import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface HudPanelProps {
  title: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const HudPanel = ({ title, icon: Icon, actions, children, className }: HudPanelProps) => {
  return (
    <div className={cn("hud-panel", className)}>
      <div className="hud-panel-header">
        {Icon && <Icon className="w-4 h-4 text-primary" />}
        <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground/90 flex-1">
          {title}
        </h3>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="hud-panel-content">{children}</div>
    </div>
  );
};
