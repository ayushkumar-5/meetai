"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import GeneratedAvatar from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import Link from "next/link";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { DataPagination } from "@/components/data-pagination";

export const MeetingsView = () => {
  const trpc = useTRPC();
  const [filters, setFilters] = useMeetingsFilters();
  const { data } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({
      search: filters.search || undefined,
      status: (filters as any).status || undefined,
      agentId: filters.agentId || undefined,
      page: filters.page || 1,
    })
  );

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  return (
    <div className="px-4 md:px-8 pb-6 flex flex-col gap-y-3">
      {data.items.map((meeting) => (
        <Link
          key={meeting.id}
          href={`/meetings/${meeting.id}`}
          className="bg-white rounded-lg border px-4 py-4 flex items-start justify-between hover:shadow-sm transition"
        >
          <div className="flex flex-col gap-y-2">
            <div className="text-base font-medium">{meeting.name}</div>
            <div className="flex items-center gap-x-2 text-sm text-gray-600">
              <span>↳</span>
              <GeneratedAvatar
                seed={meeting.agentName ?? meeting.agentId}
                variant="bottts"
                size={18}
                className="rounded-sm border overflow-hidden"
              />
              <span>{meeting.agentName ?? "Unknown Agent"}</span>
            </div>
          </div>
          <div className="flex items-center gap-x-3">
            <Badge variant="secondary" className="capitalize">
              {meeting.status}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-x-2">
              <Clock className="h-4 w-4" />
              No Duration
            </Badge>
          </div>
        </Link>
      ))}
      <div className="pt-2">
        <DataPagination
          page={filters.page}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export const MeetingsViewLoading = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <LoadingState
        title="Loading Agents"
        description="This may take a few seconds"
      />
    </div>
  );
};

export const MeetingsViewError = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <ErrorState
        title="Error Loading Agents"
        description="Something went wrong"
      />
    </div>
  );
};
