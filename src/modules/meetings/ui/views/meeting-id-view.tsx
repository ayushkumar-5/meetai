"use client";

import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { useState } from "react";
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
      {JSON.stringify(data, null, 2)}
    </div>
    </>
  );
};
