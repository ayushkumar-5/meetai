"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import GeneratedAvatar from "@/components/generated-avatar";
import { VideoIcon } from "lucide-react";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { Badge } from "@/components/ui/badge";

interface Props {
  agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );

  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-y-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-x-4">
        <GeneratedAvatar
          variant="bottts"
          seed={data.name}
          className="size-12"
        />
        <h2 className="text-3xl font-semibold text-gray-900">{data.name}</h2>
      </div>
      <Badge variant="outline" className="w-fit flex items-center gap-x-2 px-3 py-1 text-sm border-gray-300 [&>svg]:size-4">
        <VideoIcon className="text-gray-600" />
        {data.meetingCount} {data.meetingCount === 1 ? "meeting" : "meetings"}
      </Badge>
      <div className="flex flex-col gap-y-4">
        <p className="text-xl font-medium text-gray-700">Instructions</p>
        <p className="text-gray-600 leading-relaxed">{data.instructions}</p>
      </div>
    </div>
  );
};

export const AgentIdViewLoading = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <LoadingState
        title="Loading Agent"
        description="This may take a few seconds"
      />
    </div>
  );
};

export const AgentIdViewError = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <ErrorState
        title="Error Loading Agent"
        description="Something went wrong"
      />
    </div>
  );
};