"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  PhoneOff, 
  Volume2,
  Share,
  Users,
  MoreVertical
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DemoPage = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [callEnded, setCallEnded] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const callStartTime = useRef<number>(0);
  const router = useRouter();

  // Timer effect for call duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInCall) {
      callStartTime.current = Date.now();
      interval = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - callStartTime.current) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isInCall]);

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle joining call
  const handleJoinCall = async () => {
    try {
      // Request camera and microphone permissions first
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      // Set the stream and enable video
      setStream(mediaStream);
      setIsVideoOn(true);
      setIsMuted(false); // Unmute by default
      
      // Set video element
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = mediaStream;
      }
      
      setIsInCall(true);
    } catch (error) {
      console.error('Error accessing camera/microphone:', error);
      // Still join call even if camera/mic access is denied
      setIsInCall(true);
      setIsVideoOn(false);
      setIsMuted(true);
    }
  };

  // Handle ending call
  const handleEndCall = () => {
    // Stop user media streams
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    // Reset states
    setIsInCall(false);
    setCallEnded(true);
    setIsMuted(true);
    setIsVideoOn(false);
    setIsSharing(false);
    setShowParticipants(false);
    setShowMenu(false);
  };

  // Start user video
  const startUserVideo = async () => {
    try {
      // If we already have a stream, just enable video tracks
      if (stream) {
        stream.getVideoTracks().forEach(track => {
          track.enabled = true;
        });
        setIsVideoOn(true);
        return;
      }
      
      // Otherwise, request new permissions
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: !isMuted 
      });
      setStream(mediaStream);
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = mediaStream;
      }
      setIsVideoOn(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsVideoOn(false);
    }
  };

  // Stop user video
  const stopUserVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => track.stop());
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = null;
      }
    }
  };

  // Toggle video
  const toggleVideo = async () => {
    if (!isVideoOn) {
      await startUserVideo();
    } else {
      if (stream) {
        stream.getVideoTracks().forEach(track => {
          track.enabled = false;
          track.stop();
        });
      }
      setIsVideoOn(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
    }
  };

  // Handle screen sharing
  const handleShare = async () => {
    try {
      if (!isSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true, 
          audio: true 
        });
        setIsSharing(true);
        
        // Stop sharing when user ends it
        screenStream.getVideoTracks()[0].onended = () => {
          setIsSharing(false);
        };
      } else {
        setIsSharing(false);
      }
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">M</span>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">Math Consultations</h1>
            <p className="text-sm text-gray-500">Math Tutor Agent</p>
          </div>
          {isInCall && (
            <div className="ml-4 text-sm text-gray-600">
              Call duration: {formatDuration(callDuration)}
            </div>
          )}
        </div>
                 <div className="flex items-center gap-2">
           <Badge variant="secondary" className="capitalize">
             {isInCall ? "In Call" : "Active"}
           </Badge>
           <Button asChild variant="outline" size="sm" className="text-black">
             <Link href="/demo/meeting">View Completed Demo</Link>
           </Button>
         </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 bg-gray-800 relative">
        {callEnded ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-32 h-32 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhoneOff className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Call Ended</h2>
              <p className="text-gray-300 mb-6">Thank you for using Math Consultations</p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => router.push('/')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Back to Homepage
                </Button>
                <Button 
                  onClick={() => router.push('/demo/meeting')}
                  variant="outline"
                  className="border-white text-black hover:bg-white hover:text-gray-900"
                >
                  View Completed Demo
                </Button>
              </div>
            </div>
          </div>
        ) : !isInCall ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-semibold text-4xl">J</span>
              </div>
              <h2 className="text-2xl font-semibold mb-2">Math Consultations</h2>
              <p className="text-gray-300 mb-6">Join to start learning with your AI math tutor</p>
              <Button onClick={handleJoinCall} className="bg-blue-600 hover:bg-blue-700">
                <Phone className="w-4 h-4 mr-2" />
                Join Call
              </Button>
            </div>
          </div>
        ) : (
          <>
             {/* Main Video Feed - AI Tutor */}
             <div className="h-full flex items-center justify-center">
                <div className="relative">
                  <div className="w-[800px] h-[600px] bg-gray-700 rounded-lg overflow-hidden">
                    {/* Try to load video file, fallback to avatar */}
                    <video
                      ref={videoRef}
                      autoPlay
                      loop
                      muted
                      className="w-full h-full object-cover"
                      onError={() => {
                        // Fallback to avatar if video fails to load
                        if (videoRef.current) {
                          videoRef.current.style.display = 'none';
                        }
                      }}
                    >
                      <source src="/file.mp4" type="video/mp4" />
                      <source src="/file.mov" type="video/quicktime" />
                      <source src="/file.webm" type="video/webm" />
                    </video>
                     
                    {/* Fallback Avatar */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-1 bg-white mb-1"></div>
                          <div className="flex gap-1">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                
                {/* Math Tutor Label */}
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Math Tutor
                  {isSharing && (
                    <span className="text-green-400 text-xs ml-2">● Presenting</span>
                  )}
                </div>
              </div>
            </div>

            {/* User Video Feed */}
            <div className="absolute top-4 right-4">
              <div className="w-32 h-24 bg-gray-700 rounded-lg overflow-hidden relative">
                {isVideoOn && stream ? (
                  <video
                    ref={userVideoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">J</span>
                    </div>
                  </div>
                )}
                {!isVideoOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <VideoOff className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="text-white text-sm mt-2 text-center flex items-center justify-center gap-1">
                You
                {isMuted && <MicOff className="w-3 h-3 text-red-400" />}
              </div>
            </div>

            {/* Participants Panel */}
            {showParticipants && (
              <div className="absolute top-4 left-4 bg-black bg-opacity-80 rounded-lg p-4 text-white min-w-48">
                <h3 className="font-semibold mb-3">Participants (2)</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-xs">M</div>
                    <span className="text-sm">Math Tutor</span>
                    <Volume2 className="w-3 h-3 ml-auto" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs">J</div>
                    <span className="text-sm">You</span>
                    {isMuted && <MicOff className="w-3 h-3 ml-auto text-red-400" />}
                  </div>
                </div>
              </div>
            )}

            {/* Menu Panel */}
            {showMenu && (
              <div className="absolute bottom-24 right-6 bg-black bg-opacity-80 rounded-lg p-2 text-white">
                <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-sm">
                  Settings
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-sm">
                  Recording
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-700 rounded text-sm">
                  Chat
                </button>
                <button 
                  onClick={handleEndCall}
                  className="w-full text-left px-3 py-2 hover:bg-red-600 rounded text-sm text-red-400 hover:text-white"
                >
                  Leave Call
                </button>
              </div>
            )}

            {/* Muted Status Message */}
            {isMuted && (
              <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2">
                <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">i</span>
                  </div>
                  <span className="text-sm">You are muted. Unmute to speak.</span>
                </div>
              </div>
            )}

            {/* Call Controls */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-4 bg-black bg-opacity-50 rounded-full px-6 py-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className={`rounded-full w-12 h-12 ${isMuted ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-white text-gray-900 hover:bg-gray-200'}`}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleVideo}
                  className={`rounded-full w-12 h-12 ${!isVideoOn ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-white text-gray-900 hover:bg-gray-200'}`}
                >
                  {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>
                
                <Button
                  onClick={handleEndCall}
                  className="rounded-full w-12 h-12 bg-red-600 hover:bg-red-700"
                >
                  <PhoneOff className="w-5 h-5 text-white" />
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleShare}
                  className={`rounded-full w-12 h-12 ${isSharing ? 'bg-green-600 text-white' : 'bg-gray-600 text-white hover:bg-gray-500'}`}
                >
                  <Share className="w-5 h-5" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowParticipants(!showParticipants)}
                  className={`rounded-full w-12 h-12 ${showParticipants ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white hover:bg-gray-500'}`}
                >
                  <Users className="w-5 h-5" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowMenu(!showMenu)}
                  className={`rounded-full w-12 h-12 ${showMenu ? 'bg-blue-600 text-black' : 'bg-gray-600 text-white hover:bg-gray-500'}`}
                >
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DemoPage;