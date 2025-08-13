import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VideoIcon, CircleXIcon } from 'lucide-react';
import type { MeetingGetOne } from '../../../types';

interface Props {
  meeting: MeetingGetOne;
  onCancel?: () => void;
  onStart?: () => void;
}

export const MeetingUpcomingView = ({ meeting, onCancel, onStart }: Props) => {
  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="text-lg font-medium">{meeting.name}</div>
        <Badge variant="secondary" className="capitalize">{meeting.status}</Badge>
      </div>
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <div className="w-72 h-24 rounded-md bg-gray-100 border flex items-center gap-3 px-3">
          <div className="p-2 rounded-md bg-white border">
            <VideoIcon className="h-5 w-5 text-gray-700" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-3 w-40 bg-gray-200 rounded" />
            <div className="h-3 w-28 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="text-base font-medium">Not started yet</div>
        <div className="text-sm text-gray-600">Once you start this meeting, a summary will appear here</div>
        <div className="flex items-center gap-3 mt-2">
          <Button variant="outline" onClick={onCancel}>
            <CircleXIcon className="h-4 w-4 mr-2" />
            Cancel meeting
          </Button>
          <Button onClick={onStart}>
            <VideoIcon className="h-4 w-4 mr-2" />
            Start meeting
          </Button>
        </div>
      </div>
    </div>
  );
};


