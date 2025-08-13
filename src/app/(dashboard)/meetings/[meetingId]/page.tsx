import { getQueryClient, trpc } from '@/trpc/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Suspense } from 'react';
import { MeetingIdView } from '@/modules/meetings/ui/views/meeting-id-view';

interface Props {
  params: {
    meetingId: string;
  };
}

export default async function Page({ params }: Props) {
  const { meetingId } = params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/sign-in");
  }
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div />}> 
        <MeetingIdView meetingId={meetingId} />
      </Suspense>
    </HydrationBoundary>
  );
}
