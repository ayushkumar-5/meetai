"use client";

import { useQueryClient, useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import GeneratedAvatar from "@/components/generated-avatar";
import { VideoIcon } from "lucide-react";
import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { use } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { UpdateAgentDialog} from "../components/update-agent-dialog";
interface Props {
  agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);

  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );
  const removeAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
        router.push('/agents');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are u sure?",
    `The following action will remove ${data.meetingCount} associated meetings`,
  );
  const handleRemoveAgent = async () => {
    const ok = await confirmRemove();
    if (!ok) return;
    await removeAgent.mutateAsync({ id: agentId });
  };
  return (
    <>
    <RemoveConfirmation/>
    <UpdateAgentDialog
    open={updateAgentDialogOpen}
    onOpenChange={setUpdateAgentDialogOpen}
    initialValues={data}/>
    <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
      <AgentIdViewHeader
        agentId={agentId}
        agentName={data.name}
        onEdit={() => setUpdateAgentDialogOpen(true)}
        onRemove={handleRemoveAgent}
      />
      <div className="bg-white rounded-lg border">
        <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
          <div className="flex items-center gap-x-3">
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
      </div>
    </div>
    </>
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