import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileTextIcon, VideoIcon } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center py-10 gap-4">
        <div className="text-base font-medium">Meeting completed</div>
        {meeting.summary ? (
          <div className="max-w-xl text-center text-sm text-gray-700">{meeting.summary}</div>
        ) : (
          <div className="text-sm text-gray-600">Summary will appear here when ready.</div>
        )}
        <div className="flex items-center gap-3 mt-2">
          {meeting.recordingUrl && (
            <Button asChild variant="outline">
              <a href={meeting.recordingUrl} target="_blank" rel="noreferrer">
                <VideoIcon className="h-4 w-4 mr-2" />
                Recording
              </a>
            </Button>
          )}
          {meeting.transcriptUrl && (
            <Button asChild>
              <a href={meeting.transcriptUrl} target="_blank" rel="noreferrer">
                <FileTextIcon className="h-4 w-4 mr-2" />
                Transcript
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};


