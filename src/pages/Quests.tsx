import { useState, useMemo } from "react";
import { Plus, MapPin, Filter } from "lucide-react";
import { HudPanel } from "@/components/HudPanel";
import { QuestCard } from "@/components/QuestCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateQuestModal } from "@/components/modals/CreateQuestModal";
import {
  useApp,
  selectActiveQuests,
  selectBacklogQuests,
  selectCompletedQuests,
} from "@/store/AppContext";
import { Quest } from "@/types";

export default function Quests() {
  const { state } = useApp();
  const [questModalOpen, setQuestModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const activeQuests = selectActiveQuests(state);
  const backlogQuests = selectBacklogQuests(state);
  const completedQuests = selectCompletedQuests(state);

  const filterQuests = (quests: Quest[]) => {
    return quests.filter((q) => {
      const matchesSearch =
        q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.steps.some((s) => s.text.toLowerCase().includes(search.toLowerCase()));
      const matchesPriority = priorityFilter === "all" || q.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  };

  // Location markers - group by location
  const locationMarkers = useMemo(() => {
    const markers: Record<string, { quest: Quest; stepText: string }[]> = {};
    [...activeQuests, ...backlogQuests].forEach((quest) => {
      quest.steps.forEach((step) => {
        if (step.locationLabel && !step.done) {
          if (!markers[step.locationLabel]) {
            markers[step.locationLabel] = [];
          }
          markers[step.locationLabel].push({ quest, stepText: step.text });
        }
      });
    });
    return markers;
  }, [activeQuests, backlogQuests]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quest Log</h1>
        <Button onClick={() => setQuestModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> New Quest
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Search quests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {showFilters && (
          <div className="flex gap-3">
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="med">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Quest Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="backlog">
                Backlog ({filterQuests(backlogQuests).length})
              </TabsTrigger>
              <TabsTrigger value="active">
                Active ({filterQuests(activeQuests).length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({filterQuests(completedQuests).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="backlog" className="space-y-3">
              {filterQuests(backlogQuests).length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No backlog quests
                </p>
              ) : (
                filterQuests(backlogQuests).map((quest) => (
                  <QuestCard key={quest.id} quest={quest} showActions={false} />
                ))
              )}
            </TabsContent>

            <TabsContent value="active" className="space-y-3">
              {filterQuests(activeQuests).length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No active quests
                </p>
              ) : (
                filterQuests(activeQuests).map((quest) => (
                  <QuestCard key={quest.id} quest={quest} />
                ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-3">
              {filterQuests(completedQuests).length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No completed quests
                </p>
              ) : (
                filterQuests(completedQuests).map((quest) => (
                  <QuestCard key={quest.id} quest={quest} showActions={false} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Location Markers */}
        <div>
          <HudPanel title="Location Markers" icon={MapPin}>
            {Object.keys(locationMarkers).length === 0 ? (
              <p className="text-center text-muted-foreground py-4 text-sm">
                No location markers
              </p>
            ) : (
              <div className="space-y-4">
                {Object.entries(locationMarkers).map(([location, items]) => (
                  <div key={location}>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-medium text-sm">{location}</span>
                    </div>
                    <div className="space-y-1 pl-6">
                      {items.map((item, i) => (
                        <div key={i} className="text-xs text-muted-foreground">
                          <span className="text-foreground/80">{item.quest.title}:</span>{" "}
                          {item.stepText}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </HudPanel>
        </div>
      </div>

      <CreateQuestModal open={questModalOpen} onOpenChange={setQuestModalOpen} />
    </div>
  );
}
