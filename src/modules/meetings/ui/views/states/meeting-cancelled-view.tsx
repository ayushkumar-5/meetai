import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RotateCcwIcon } from 'lucide-react';
import type { MeetingGetOne } from '../../../types';

interface Props {
  meeting: MeetingGetOne;
  onReopen?: () => void;
}

export const MeetingCancelledView = ({ meeting, onReopen }: Props) => {
  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="text-lg font-medium">{meeting.name}</div>
        <Badge variant="secondary" className="capitalize">{meeting.status}</Badge>
      </div>
      <div className="flex flex-col items-center justify-center py-10 gap-3">
        <div className="text-base font-medium">Meeting cancelled</div>
        <div className="text-sm text-gray-600">You can reopen this meeting if needed.</div>
        <div className="flex items-center gap-3 mt-2">
          <Button variant="outline" onClick={onReopen}>
            <RotateCcwIcon className="h-4 w-4 mr-2" />
            Reopen
          </Button>
        </div>
      </div>
    </div>
  );
};


