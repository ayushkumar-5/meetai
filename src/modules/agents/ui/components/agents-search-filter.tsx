import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useAgentsFilters } from "../../hooks/use-agents-filters";

export const AgentsSearchFilter = () => {
  const [filters, setFilters] = useAgentsFilters();

  return (
    <div className="relative w-[200px]">
      <Input
        placeholder="Filter by name"
        className="h-9 pl-7 bg-white"
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value })}
      />
      <SearchIcon className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
};
