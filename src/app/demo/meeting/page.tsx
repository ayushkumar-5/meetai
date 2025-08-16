"use client";
import './ai-response.css';

import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Download, FileText, Mic, Search, Share2, Home, Send } from "lucide-react";
import Link from "next/link";

interface ChatMessage {
  id: string;
  question: string;
  answer: string;
  timestamp: string;
}

interface TranscriptEntry {
  time: string;
  speaker: string;
  text: string;
}

const CompletedMeetingDemo = () => {
  const meetingTitle = "Math Consultations 3";
  const meetingDate = "May 23rd, 2025";
  const agentName = "Math Tutor";
  const sessionId = useMemo(() => {
    try {
      return crypto.randomUUID();
    } catch {
      return `demo-${Date.now()}`;
    }
  }, []);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Real transcript data from the document
  const transcriptData: TranscriptEntry[] = [
    { time: "00:04", speaker: "Mia Buljan", text: "Here's your new numbers. Put your heads up. I want you to read it with me but be quiet. When you put your head up, you're quiet. Here's your new numbers. Are you guys ready for this?" },
    { time: "00:15", speaker: "Student", text: "That's easy." },
    { time: "00:17", speaker: "Mia Buljan", text: "We'll see. Everybody, let's read it." },
    { time: "00:20", speaker: "Students", text: "Diva had 67 stickers. She goes to the store and buys 83 stickers more. How many stickers does she have now?" },
    { time: "00:30", speaker: "Mia Buljan", text: "Tragically, three kids weren't reading." },
    { time: "00:33", speaker: "Students", text: "Who?" },
    { time: "00:34", speaker: "Mia Buljan", text: "Doesn't matter. Everybody read. Diva..." },
    { time: "00:37", speaker: "Students", text: "Diva had..." },
    { time: "00:39", speaker: "Mia Buljan", text: "Giancarlo was testing me. He was doing this. Is that reading? Boys and girls, if you are currently sitting at groups five, six, or seven, go get your math bags." },
    { time: "01:15", speaker: "Mia Buljan", text: "There's so many. Oh, what's this? Why did you do this? How many is this?" },
    { time: "01:20", speaker: "Student", text: "1, 2, 3, 4, 5, 6, 7, 8." },
    { time: "01:24", speaker: "Mia Buljan", text: "Huh?" },
    { time: "01:25", speaker: "Student", text: "Wait. 1, 2, 3, 4, 5, 6, 7, 8, 9, 10. Ooh!" },
    { time: "01:30", speaker: "Mia Buljan", text: "So how are you going to count that?" },
    { time: "01:33", speaker: "Student", text: "10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140." },
    { time: "01:45", speaker: "Mia Buljan", text: "Rehaan, get your math bag." },
    { time: "01:48", speaker: "Student", text: "Ms. B, I..." },
    { time: "01:50", speaker: "Mia Buljan", text: "Nalani, Rehaan just said, 'I don't know how to count after 100.' Can you show him what you did?" },
    { time: "02:00", speaker: "Student", text: "Okay. So here, Rehaan." },
    { time: "02:03", speaker: "Student", text: "Yeah?" },
    { time: "02:04", speaker: "Student", text: "So, so this... So it's like...so, so let's count by tens first." },
    { time: "02:10", speaker: "Students", text: "10, 20, 30, 40, 50, 60, 70, 80, 90, 100." },
    { time: "02:18", speaker: "Student", text: "So Rehaan. 110, 120, 130." },
    { time: "02:22", speaker: "Student", text: "130, 140…" },
    { time: "02:25", speaker: "Student", text: "140, 150..." },
    { time: "02:28", speaker: "Student", text: "151...51. 152." },
    { time: "03:30", speaker: "Mia Buljan", text: "Can you watch her count? She did what you did and she saw that she had enough to make a ten, Nalani,, so she's going to count all of these as tens. Count for her." },
    { time: "03:45", speaker: "Students", text: "60, 70, 80, 90, 100, 101, 102, 103." },
    { time: "03:52", speaker: "Student", text: "One hundred and...wait. Ah! I'm dumb." },
    { time: "03:55", speaker: "Student", text: "50, 60, 70..." },
    { time: "03:58", speaker: "Mia Buljan", text: "Did you count those together?" },
    { time: "04:00", speaker: "Student", text: "Yeah." },
    { time: "04:01", speaker: "Mia Buljan", text: "And what was your answer?" },
    { time: "04:03", speaker: "Student", text: "One hundred and forty." },
    { time: "04:05", speaker: "Mia Buljan", text: "You don't sound very convinced." },
    { time: "04:07", speaker: "Student", text: "Mine was 105." },
    { time: "04:10", speaker: "Mia Buljan", text: "Ah, you two, go. Okay, I'm convinced. And what's over here? 10, 20, 30, 40, 50, 60, 70, 71, 72, 73, 74, 75, 76, 77, 78. What number are you trying to make up here, Diva? Check your problem." },
    { time: "04:45", speaker: "Student", text: "Ms. B, I know the answer." },
    { time: "04:47", speaker: "Mia Buljan", text: "You think so? Don't say it. Don't say it. She's still working. Find somebody who's done and see if you got the same answer. Can you guys count together? Watch her count. Janiya, I want you to watch her count and then I want her to watch you count. See if you guys can work that out." },
    { time: "05:15", speaker: "Mia Buljan", text: "When you put those ones together, do you think you're going to have enough to make a ten?" },
    { time: "05:20", speaker: "Student", text: "Let's see. 1, 2, 3, 4, 5, 6, 7, 8, 9, 10." },
    { time: "05:28", speaker: "Mia Buljan", text: "Okay, so...so what can we do with those?" },
    { time: "05:32", speaker: "Student", text: "[Inaudible]" },
    { time: "05:34", speaker: "Mia Buljan", text: "Oh, sure! That sounds good. Watch her count. Say it nice and loud, Diva. Start over. Nice and loud." },
    { time: "05:45", speaker: "Student", text: "10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 130…120, 130, 140, 150." },
    { time: "05:58", speaker: "Mia Buljan", text: "Okay, count yours." },
    { time: "06:00", speaker: "Student", text: "This is how I did it." },
    { time: "06:02", speaker: "Mia Buljan", text: "Oh, I beg your pardon." },
    { time: "06:04", speaker: "Student", text: "Okay, I count like this: 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 101, 102, 103, 104, 105." },
    { time: "06:15", speaker: "Mia Buljan", text: "Okay." },
    { time: "06:16", speaker: "Student", text: "Because I made that into a ten." },
    { time: "06:18", speaker: "Mia Buljan", text: "I hear you. Here's 100. Diva, show us 100. What was your answer? And what was her answer? Okay, Janiya, you come over here, and you go over there. Get a whiteboard. Hey, hey, hey, hey! Bibi, ssh." },
    { time: "06:40", speaker: "Mia Buljan", text: "Here's 100?" },
    { time: "06:42", speaker: "Student", text: "Yeah." },
    { time: "06:43", speaker: "Mia Buljan", text: "And this is 100? Okay, now you count the rest. You have 100 and then what?" },
    { time: "06:48", speaker: "Student", text: "101...I mean 100, 110, 120, 130, 140..." },
    { time: "06:55", speaker: "Student", text: "Oh, now I see why she counts that, because these are all..." },
    { time: "06:58", speaker: "Mia Buljan", text: "Go to the carpet. Go tell her. Go tell her." },
    { time: "07:02", speaker: "Mia Buljan", text: "You got 105?" }
  ];

  // Filter transcript based on search term
  const filteredTranscript = searchTerm
    ? transcriptData.filter(entry =>
        entry.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.speaker.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : transcriptData;

  // Generate downloadable transcript
  const generateTranscriptText = () => {
    const header = `${meetingTitle} - ${meetingDate}\nTranscript\n\n`;
    const content = transcriptData
      .map(entry => `${entry.time} ${entry.speaker}: ${entry.text}`)
      .join('\n\n');
    return header + content;
  };

  // Download transcript function
  const downloadTranscript = () => {
    const transcriptText = generateTranscriptText();
    const blob = new Blob([transcriptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meetingTitle.replace(/\s+/g, '_')}_transcript.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const formatAIResponse = (text: string): string => {
    if (!text || typeof text !== 'string') {
      return '<p>No response received.</p>';
    }
  
    let formattedText = text.trim();
    
    // Handle escaped newlines from API responses
    formattedText = formattedText.replace(/\\n/g, '\n');
    
    // Handle other escaped characters
    formattedText = formattedText.replace(/\\t/g, '\t');
    formattedText = formattedText.replace(/\\\\/g, '\\');
    formattedText = formattedText.replace(/\\"/g, '"');
    
    // Split into sections based on double newlines or clear breaks
    const sections = formattedText.split(/\n\s*\n|\n(?=[A-Z][a-z]+:)|(?<=:)\n(?=[A-Z])/);
    
    const formatSection = (section: string): string => {
      section = section.trim();
      if (!section) return '';
      
      // Check if it's a step or numbered instruction
      if (/^\d+\.\s/.test(section) || /^Step \d+/i.test(section)) {
        const lines = section.split('\n');
        const title = lines[0];
        const content = lines.slice(1).join('<br>');
        return `<div class="step"><strong>${title}</strong>${content ? '<br>' + content : ''}</div>`;
      }
      
      // Check if it's a question or instruction
      if (section.endsWith('?') || /^(What|How|Why|Where|When)/i.test(section)) {
        return `<div class="question"><strong>${section}</strong></div>`;
      }
      
      // Check if it's a title or header (ends with colon)
      if (/^[^:]+:$/.test(section.split('\n')[0])) {
        const lines = section.split('\n');
        const title = lines[0];
        const content = lines.slice(1).join('<br>');
        return `<div class="section"><h4>${title}</h4>${content ? '<p>' + content + '</p>' : ''}</div>`;
      }
      
      // Handle mathematical expressions and formulas
      section = section.replace(/x\^(\d+)/g, 'x<sup>$1</sup>');
      section = section.replace(/\^(\d+)/g, '<sup>$1</sup>');
      
      // Handle bold patterns
      section = section.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      section = section.replace(/(?:^|\s)([A-Z][A-Z\s]+):(?=\s|$)/g, ' <strong>$1:</strong>');
      
      // Convert single newlines to <br>
      section = section.replace(/\n/g, '<br>');
      
      return `<p>${section}</p>`;
    };
    
    const formattedSections = sections
      .map(formatSection)
      .filter(section => section)
      .join('');
    
    return formattedSections || `<p>${formattedText.replace(/\n/g, '<br>')}</p>`;
  };
  
  // Alternative approach - more aggressive formatting for structured content
  const formatStructuredAIResponse = (text: string): string => {
    if (!text || typeof text !== 'string') {
      return '<p>No response received.</p>';
    }
  
    let formattedText = text.trim();
    
    // Handle escaped characters from JSON/API
    formattedText = formattedText.replace(/\\n/g, '\n');
    formattedText = formattedText.replace(/\\t/g, '    ');
    formattedText = formattedText.replace(/\\\\/g, '\\');
    formattedText = formattedText.replace(/\\"/g, '"');
    
    // Split into logical chunks
    const chunks = formattedText.split(/\n(?=\d+\.|\n|[A-Z][a-z]+\s+[a-z]+)/);
    
    let htmlOutput = '';
    
    for (let chunk of chunks) {
      chunk = chunk.trim();
      if (!chunk) continue;
      
      // Handle numbered steps
      if (/^\d+\.\s/.test(chunk)) {
        const match = chunk.match(/^(\d+\.\s+)(.+)/s);
        if (match) {
          const number = match[1];
          const content = match[2].replace(/\n/g, '<br>');
          htmlOutput += `<div class="numbered-step"><strong>${number}</strong>${content}</div>`;
        }
        continue;
      }
      
      // Handle questions
      if (chunk.includes('?')) {
        const content = chunk.replace(/\n/g, '<br>');
        htmlOutput += `<div class="question"><em>${content}</em></div>`;
        continue;
      }
      
      // Handle headers (text ending with colon)
      if (chunk.includes(':') && chunk.split('\n')[0].endsWith(':')) {
        const lines = chunk.split('\n');
        const header = lines[0];
        const body = lines.slice(1).join('<br>');
        htmlOutput += `<div class="header-section"><h4>${header}</h4>${body ? '<p>' + body + '</p>' : ''}</div>`;
        continue;
      }
      
      // Regular paragraph
      const content = chunk.replace(/\n/g, '<br>');
      htmlOutput += `<p>${content}</p>`;
    }
    
    return htmlOutput || `<p>${formattedText.replace(/\n/g, '<br>')}</p>`;
  };
  
  // Updated handleAsk function with better error handling
  const handleAsk = async () => {
    const chatInput = question.trim();
    if (!chatInput) return;
    setIsLoading(true);
  
    try {
      const res = await fetch(
        "https://Ayush5-n8n.hf.space/webhook/e5616171-e3b5-4c39-81d4-67409f9fa60a/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, chatInput }),
        }
      );
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const text = await res.text();
      console.log('Raw response:', text); // Debug log
      
      let parsed: any = null;
      try { 
        parsed = JSON.parse(text); 
        console.log('Parsed response:', parsed); // Debug log
      } catch (e) {
        console.log('Response is not JSON, using as plain text');
      }
      
      const reply =
        typeof parsed === "string"
          ? parsed
          : parsed?.reply ?? parsed?.message ?? parsed?.answer ?? parsed?.output ?? text;

      console.log('Final reply:', reply); // Debug log
      
      // Try the structured formatter first, fall back to regular if needed
      const formattedReply = formatStructuredAIResponse(reply) || formatAIResponse(reply);

      const newMessage: ChatMessage = {
        id: crypto.randomUUID(),
        question: chatInput,
        answer: formattedReply,
        timestamp: new Date().toLocaleTimeString([], { 
          hour: "2-digit", 
          minute: "2-digit" 
        }),
      };

      // Add new message to the end instead of beginning
      setChatHistory((prev) => [...prev, newMessage]);
      setQuestion("");
      
    } catch (e) {
      console.error('Error in handleAsk:', e); // Debug log
      const errorMessage = e instanceof Error ? e.message : "Failed to reach AI service.";
      const formattedError = `<p class="error">Error: ${errorMessage}</p>`;
      
      // Add error message to the end instead of beginning
      setChatHistory((prev) => [
        ...prev,
        { 
          id: crypto.randomUUID(), 
          question: chatInput, 
          answer: formattedError, 
          timestamp: new Date().toLocaleTimeString([], { 
            hour: "2-digit", 
            minute: "2-digit" 
          }) 
        }
      ]);
      setQuestion("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center ring-2 ring-blue-100">
            <span className="text-white font-semibold text-base">M</span>
          </div>
          <div>
            <h1 className="font-semibold text-xl text-gray-900">{meetingTitle}</h1>
            <p className="text-sm text-gray-500">Completed Meeting</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="capitalize bg-green-100 text-green-800">
            Completed
          </Badge>
          <Button asChild variant="outline" size="sm" className="hover:bg-blue-50">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Homepage
            </Link>
          </Button>
        </div>
      </motion.div>

      <div className="flex-1 py-8 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 text-sm text-muted-foreground flex items-center"
          >
            <span>My Meetings</span>
            <span className="mx-3">›</span>
            <span className="text-foreground font-medium">{meetingTitle}</span>
          </motion.div>

          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white rounded-lg p-1 shadow-sm">
              {["summary", "transcript", "recording", "ask"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="capitalize text-sm data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="summary" className="mt-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl">{meetingTitle}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-800">
                          <Mic className="h-4 w-4" /> {agentName}
                        </Badge>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <CalendarDays className="h-4 w-4" /> {meetingDate}
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <div className="grid gap-3">
                      <h4 className="font-semibold text-lg">Highlights</h4>
                      <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-2">
                        <li>Worked on addition word problem: "Diva had 67 stickers. She goes to the store and buys 83 stickers more. How many stickers does she have now?"</li>
                        <li>Students practiced counting by tens and making groups of ten</li>
                        <li>Collaborative problem-solving with peer support and explanation</li>
                        <li>Focus on place value understanding and counting strategies</li>
                      </ul>
                    </div>
                    <div className="grid gap-3">
                      <h4 className="font-semibold text-lg">Action Items</h4>
                      <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-2">
                        <li>Continue practicing addition with regrouping using manipulatives</li>
                        <li>Work on counting patterns beyond 100</li>
                        <li>Encourage students to explain their thinking process</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="transcript" className="mt-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl">Transcript</CardTitle>
                    <CardDescription>2nd-Grade Math Lesson - Addition & Subtraction Word Problems with Unknowns</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <input
                          className="w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          placeholder="Search in transcript..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                      <Button 
                        onClick={downloadTranscript} 
                        variant="outline" 
                        size="sm" 
                        className="hover:bg-blue-50"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                      <strong>Example Problem:</strong> "Diva had 67 stickers. She goes to the store and buys 83 stickers more. How many stickers does she have now?"
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto space-y-3 text-sm border rounded-lg p-4 bg-gray-50">
                      {filteredTranscript.map((entry, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                          className="flex items-start gap-3 py-1"
                        >
                          <span className="text-muted-foreground min-w-[50px] text-xs font-mono">
                            {entry.time}
                          </span>
                          <span className={`font-medium min-w-[100px] text-xs ${
                            entry.speaker === 'Mia Buljan' 
                              ? 'text-blue-700' 
                              : entry.speaker === 'Students' 
                                ? 'text-green-700'
                                : 'text-purple-700'
                          }`}>
                            {entry.speaker}:
                          </span>
                          <span className="text-gray-700 text-xs leading-relaxed">
                            {entry.text}
                          </span>
                        </motion.div>
                      ))}
                      {filteredTranscript.length === 0 && searchTerm && (
                        <div className="text-center text-muted-foreground py-4">
                          No results found for "{searchTerm}"
                        </div>
                      )}
                    </div>
                    
                    <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                      <strong>Total entries:</strong> {filteredTranscript.length} of {transcriptData.length}
                      {searchTerm && (
                        <span className="ml-2">
                          (filtered by "{searchTerm}")
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="recording" className="mt-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl">Recording</CardTitle>
                    <CardDescription>Playback the recorded session</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-video w-full rounded-lg bg-black overflow-hidden shadow-inner">
                      <video className="h-full w-full" controls preload="metadata">
                        <source src="/file.mp4" type="video/mp4" />
                        <source src="/file.webm" type="video/webm" />
                        <source src="/file.mov" type="video/quicktime" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Tip: place a video named <code>file.mp4</code>, <code>file.webm</code>, or <code>file.mov</code> in the <code>public/</code> folder. It will be available at <code>/file.mp4</code> etc.
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" /> 42m 18s • {meetingDate}
                      </div>
                      <div className="flex items-center gap-3">
                        <Button asChild variant="outline" size="sm" className="hover:bg-blue-50">
                          <a href="/file.mp4" download>
                            <Download className="mr-2 h-4 w-4" /> Download
                          </a>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="hover:bg-blue-50">
                          <a href="/file.mp4" target="_blank" rel="noreferrer">
                            <Share2 className="mr-2 h-4 w-4" /> Open
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="ask" className="mt-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl">Ask AI</CardTitle>
                    <CardDescription>Query the meeting for insights</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Chat History */}
                    <div 
                      ref={chatContainerRef}
                      className="max-h-96 overflow-y-auto space-y-4 pr-2 scroll-smooth"
                    >
                      <AnimatePresence>
                        {chatHistory.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-sm text-muted-foreground text-center"
                          >
                            No questions asked yet. Start by asking about the meeting!
                          </motion.div>
                        ) : (
                          chatHistory.map((message) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              className="space-y-2"
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-muted-foreground text-xs min-w-[50px]">{message.timestamp}</span>
                                <div className="bg-blue-50 p-3 rounded-lg shadow-sm w-full">
                                  <p className="font-medium text-blue-800">You:</p>
                                  <p className="text-sm">{message.question}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-muted-foreground text-xs min-w-[50px]">{message.timestamp}</span>
                                <div className="bg-gray-100 p-3 rounded-lg shadow-sm w-full ai-response">
                                  <p className="font-medium text-gray-800">AI:</p>
                                  <div
                                    className="text-sm prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: message.answer }}
                                  />
                                </div>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Input Area */}
                    <div className="flex gap-3">
                      <input
                        className="flex-1 rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        placeholder="Ask about this meeting..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                      />
                      <Button
                        onClick={handleAsk}
                        disabled={isLoading || !question.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Send className="mr-2 h-4 w-4" /> {isLoading ? "Asking..." : "Ask"}
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Example: "Summarize the steps for completing the square"
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CompletedMeetingDemo;