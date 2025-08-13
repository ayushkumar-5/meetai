import { caller } from '@/trpc/server';
import GeneratedAvatar from '@/components/generated-avatar';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

type PageProps = {
  params: { meetingId: string };
};

export default async function Page({ params }: PageProps) {
  const { meetingId } = params;
  const meeting = await caller.meetings.getOne({ id: meetingId });

  return (
    <div className="py-4 px-4 md:px-8">
      <div className="bg-white rounded-lg border px-4 py-5 flex items-start justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-semibold">{meeting.name}</h1>
          <div className="flex items-center gap-x-2 text-sm text-gray-600">
            <span>↳</span>
            <GeneratedAvatar
              seed={meeting.agentName ?? meeting.agentId}
              variant="bottts"
              size={20}
              className="rounded-sm border overflow-hidden"
            />
            <span>{meeting.agentName ?? 'Unknown Agent'}</span>
          </div>
        </div>
        
      </div>
    </div>
  );
}
