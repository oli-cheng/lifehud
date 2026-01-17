import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Scroll, Sparkles, Shirt, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useApp } from "@/store/AppContext";
import { cn } from "@/lib/utils";

interface SearchResult {
  type: "quest" | "effect" | "loadout";
  id: string;
  title: string;
  subtitle?: string;
}

export const GlobalSearch = () => {
  const { state } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results: SearchResult[] = query.trim()
    ? [
        ...state.quests
          .filter(
            (q) =>
              q.title.toLowerCase().includes(query.toLowerCase()) ||
              q.steps.some((s) => s.text.toLowerCase().includes(query.toLowerCase()))
          )
          .map((q) => ({
            type: "quest" as const,
            id: q.id,
            title: q.title,
            subtitle: `${q.status} • ${q.steps.length} steps`,
          })),
        ...state.effects
          .filter((e) => e.name.toLowerCase().includes(query.toLowerCase()))
          .map((e) => ({
            type: "effect" as const,
            id: e.id,
            title: e.name,
            subtitle: e.kind,
          })),
        ...state.loadouts
          .filter((l) => l.name.toLowerCase().includes(query.toLowerCase()))
          .map((l) => ({
            type: "loadout" as const,
            id: l.id,
            title: l.name,
            subtitle: l.isEquipped ? "Equipped" : "",
          })),
      ]
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (result: SearchResult) => {
    setQuery("");
    setIsOpen(false);
    if (result.type === "quest") {
      navigate(`/quests/${result.id}`);
    } else if (result.type === "effect") {
      navigate("/effects");
    } else {
      navigate("/equipment");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "quest":
        return Scroll;
      case "effect":
        return Sparkles;
      case "loadout":
        return Shirt;
      default:
        return Search;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search..."
          className="pl-9 pr-8 bg-secondary/50 border-border/50 focus:border-primary/50 h-9"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-50">
          {results.slice(0, 8).map((result) => {
            const Icon = getIcon(result.type);
            return (
              <button
                key={`${result.type}-${result.id}`}
                onClick={() => handleSelect(result)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-secondary/50 text-left"
              >
                <Icon className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{result.title}</div>
                  {result.subtitle && (
                    <div className="text-xs text-muted-foreground">{result.subtitle}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
