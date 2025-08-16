import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import {
  CallEndedEvent,
  CallTranscriptionReadyEvent,
  CallSessionParticipantLeftEvent,
  CallRecordingReadyEvent,
  CallSessionStartedEvent,
} from "@stream-io/node-sdk";

import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";

function verifySignatureWithSDK(body: string, signature: string): boolean {
  return streamVideo.verifyWebhook(body, signature);
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-signature");
  const apiKey = req.headers.get("x-api-key");

  if (!signature || !apiKey) {
    return NextResponse.json(
      { error: "Missing signature or API key" },
      { status: 400 }
    );
  }

  const bodyText = await req.text();

  if (!verifySignatureWithSDK(bodyText, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(bodyText);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = payload?.type;

  // ----------------------------
  // 1. SESSION STARTED
  // ----------------------------
  if (eventType === "call.session_started") {
    const event = payload as unknown as CallSessionStartedEvent;
    const meetingId = event.call.custom?.meetingId;

    if (!meetingId) {
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    }

    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(
        and(
          eq(meetings.id, meetingId),
          not(eq(meetings.status, "completed")),
          not(eq(meetings.status, "active")),
          not(eq(meetings.status, "cancelled")),
          not(eq(meetings.status, "processing"))
        )
      );

    if (!existingMeeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    await db
      .update(meetings)
      .set({
        status: "active",
        startedAt: new Date(),
      })
      .where(eq(meetings.id, existingMeeting.id));

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingMeeting.agentId));

    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const call = streamVideo.video.call("default", meetingId);
    const realtimeClient = await streamVideo.video.connectOpenAi({
      call,
      openAiApiKey: process.env.OPENAI_API_KEY!,
      agentUserId: existingAgent.id,
    });

    realtimeClient.updateSession({});
  }

  // ----------------------------
  // 2. PARTICIPANT LEFT
  // ----------------------------
  else if (eventType === "call.session_participant_left") {
    const event = payload as unknown as CallSessionParticipantLeftEvent;
    const meetingId = event.call_cid.split(":")[1];

    if (!meetingId) {
      return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
    }

    await db
      .update(meetings)
      .set({ status: "completed", endedAt: new Date() })
      .where(eq(meetings.id, meetingId));
  }

  // ----------------------------
  // 3. CALL ENDED
  // ----------------------------
  else if (eventType === "call.ended") {
    const event = payload as unknown as CallEndedEvent;
    const meetingId = event.call_cid.split(":")[1];

    const endedAtRaw = (payload as any)?.ended_at ?? (payload as any)?.endedAt;
    await db
      .update(meetings)
      .set({
        status: "completed",
        endedAt: endedAtRaw ? new Date(endedAtRaw) : new Date(),
      })
      .where(eq(meetings.id, meetingId));
  }

  // ----------------------------
  // 4. TRANSCRIPTION READY
  // ----------------------------
  else if (eventType === "call.transcription_ready") {
    const event = payload as unknown as CallTranscriptionReadyEvent;
    const meetingId = event.call_cid.split(":")[1];

    const transcriptionUrl =
      (payload as any)?.transcription?.url ?? (payload as any)?.transcription_url ?? null;
    const summary = (payload as any)?.summary ?? null;
    await db
      .update(meetings)
      .set({
        transcriptUrl: transcriptionUrl,
        summary,
      })
      .where(eq(meetings.id, meetingId));
  }

  // ----------------------------
  // 5. RECORDING READY
  // ----------------------------
  else if (eventType === "call.recording_ready") {
    const event = payload as unknown as CallRecordingReadyEvent;
    const meetingId = event.call_cid.split(":")[1];

    const recordingUrl =
      (payload as any)?.recording?.url ?? (payload as any)?.recording_url ?? null;
    await db
      .update(meetings)
      .set({
        recordingUrl,
      })
      .where(eq(meetings.id, meetingId));
  }

  return NextResponse.json({ status: "ok" });
}
