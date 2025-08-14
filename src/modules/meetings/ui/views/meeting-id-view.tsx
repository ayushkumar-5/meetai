"use client";

import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { useState } from "react";
import { MeetingActiveView } from "./states/meeting-active-view";
import { MeetingUpcomingView } from "./states/meeting-upcoming-view";
import { MeetingCompletedView } from "./states/meeting-completed-view";
import { MeetingCancelledView } from "./states/meeting-cancelled-view";
interface Props {
  meetingId: string;
}

export const MeetingIdView = ({ meetingId }: Props) => {
  const trpc = useTRPC();
  const router = useRouter();
  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure?",
    "The following action will remove this meeting"
    );
  const queryClient=useQueryClient();
  const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] =useState(false);
  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );

  const removeMeeting = useMutation(
    trpc.meetings.remove.mutationOptions({
    onSuccess:() => {
      queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
      router.push("/meetings");
    },
    
    }),
    );
    const handleRemoveMeeting = async () => {
      
      const ok = await confirmRemove();
      if (!ok) return;
      await removeMeeting.mutateAsync({ id: meetingId });
      };

      const isActive = data.status === "active";
const isUpcoming = data.status === "upcoming";
const isCancelled = data.status === "cancelled";
const isCompleted = data.status === "completed";
const isProcessing = data.status === "processing";
  return (
    <>
    <RemoveConfirmation/>
    <UpdateMeetingDialog
    open={updateMeetingDialogOpen}
    onOpenChange={setUpdateMeetingDialogOpen}
    initialValues={data}
    />
    <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
      <MeetingIdViewHeader
        meetingId={meetingId}
        meetingName={data.name}
        onEdit={() => setUpdateMeetingDialogOpen(true)}
        onRemove={handleRemoveMeeting}
      />
      {isCancelled && <MeetingCancelledView meeting={data} onReopen={() => { /* TODO */ }} />}
      {isProcessing && (
        <div className="bg-white rounded-lg border p-6 flex flex-col items-center justify-center py-10 gap-3">
          <div className="h-4 w-40 bg-gray-200 rounded" />
          <div className="text-base font-medium">Processing</div>
          <div className="text-sm text-gray-600">We are finalizing your meeting details...</div>
        </div>
      )}
      {isCompleted && <MeetingCompletedView meeting={data} />}
      {isActive && (
        <MeetingActiveView
          meeting={data}
          onJoin={() => {
            router.push(`/call/${meetingId}`);
          }}
        />
      )}
      {isUpcoming && (
        <MeetingUpcomingView
          meeting={data}
          onCancel={handleRemoveMeeting}
          onStart={() => {
            router.push(`/call/${meetingId}`);
          }}
        />
      )}
    </div>
    </>
  );
};
