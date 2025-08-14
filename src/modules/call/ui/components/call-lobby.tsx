'use client';

import { 
  ToggleAudioPreviewButton, 
  ToggleVideoPreviewButton, 
  useCallStateHooks, 
  VideoPreview 
} from "@stream-io/video-react-sdk";
import { Button } from "@/components/ui/button";
import "@stream-io/video-react-sdk/dist/css/styles.css";

interface Props {
  onJoin: () => void;
}

export const CallLobby = ({ onJoin }: Props) => {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();
  const micState = useMicrophoneState();
  const camState = useCameraState();

  const hasMicPermission = micState.hasBrowserPermission;
  const hasCamPermission = camState.hasBrowserPermission;
  const hasBrowserMediaPermission = hasMicPermission && hasCamPermission;

  return (
    <div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar-accent to-sidebar">
      <div className="py-4 px-8 flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-y-6 bg-background rounded-lg p-10 shadow-sm">
          <div className="flex flex-col gap-y-2 text-center">
            <h6 className="text-lg font-medium">Ready to join?</h6>
            <p className="text-sm">Set up your call before joining</p>
          </div>

          {/* Video Preview */}
          <VideoPreview />

          {/* Audio/Video toggle buttons */}
          <div className="flex gap-x-4">
            <ToggleAudioPreviewButton />
            <ToggleVideoPreviewButton />
          </div>

          {/* Join button */}
          <Button 
            onClick={onJoin} 
            disabled={!hasBrowserMediaPermission}
          >
            Join Call
          </Button>
        </div>
      </div>
    </div>
  );
};
