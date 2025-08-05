"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";

export const MeetingsView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

  return (
    <div>
      {JSON.stringify(data)}
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
