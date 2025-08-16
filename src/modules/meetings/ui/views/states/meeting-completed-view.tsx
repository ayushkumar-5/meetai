import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, Download, FileTextIcon, Film, Share2, VideoIcon } from 'lucide-react';
import type { MeetingGetOne } from '../../../types';

interface Props {
  meeting: MeetingGetOne;
}

export const MeetingCompletedView = ({ meeting }: Props) => {
  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="text-lg font-medium">{meeting.name}</div>
        <Badge variant="secondary" className="capitalize">{meeting.status}</Badge>
      </div>

      <Tabs defaultValue="summary">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="recording">Recording</TabsTrigger>
          <TabsTrigger value="ask">Ask AI</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Badge variant="secondary">{meeting.agentName ?? 'Agent'}</Badge>
              <span className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                {new Date(meeting.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="text-base font-medium">Meeting completed</div>
            <div className="max-w-2xl text-sm text-gray-700">
              {meeting.summary ?? 'Summary will appear here when ready.'}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transcript" className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">Full transcript</div>
            {meeting.transcriptUrl && (
              <Button asChild size="sm" variant="outline">
                <a href={meeting.transcriptUrl} target="_blank" rel="noreferrer">
                  <Download className="h-4 w-4 mr-2" /> Download
                </a>
              </Button>
            )}
          </div>
          <div className="rounded-md border p-4 text-sm text-gray-700">
            {meeting.transcriptUrl
              ? 'Transcript available at the link above.'
              : 'Transcript will appear here when ready.'}
          </div>
        </TabsContent>

        <TabsContent value="recording" className="mt-4">
          <div className="rounded-md border p-4 flex flex-col gap-3">
            <div className="aspect-video w-full rounded-md bg-gray-100 grid place-items-center">
              <div className="flex flex-col items-center text-gray-500">
                <Film className="h-8 w-8 mb-2" />
                <div className="text-sm">Stream Recording (demo)</div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              {meeting.recordingUrl && (
                <Button asChild size="sm" variant="outline">
                  <a href={meeting.recordingUrl} target="_blank" rel="noreferrer">
                    <Download className="mr-2 h-4 w-4" /> Download MP4
                  </a>
                </Button>
              )}
              <Button size="sm" variant="outline">
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ask" className="mt-4">
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Ask about this meeting..."
            />
            <Button>
              Ask
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-2">Example: "Summarize the steps for completing the square"</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};


