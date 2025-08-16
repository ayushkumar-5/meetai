"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Video, BookOpen } from "lucide-react";
import Link from "next/link";

export const HomeView = () => {
  return (
    <div className="flex-1 py-4 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to MeetAI</h1>
          <p className="text-gray-600">Your AI-powered meeting platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Demo Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Math Tutor Demo</CardTitle>
              <CardDescription>
                Experience an AI math tutor in a realistic meeting environment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                See how AI agents can enhance your learning experience with interactive video calls and intelligent responses.
              </p>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/demo">
                  <Video className="w-4 h-4 mr-2" />
                  Try Demo
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Create Meeting</CardTitle>
              <CardDescription>
                Start a new meeting with your AI agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Set up meetings with custom AI agents for various purposes like tutoring, support, or collaboration.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/meetings">
                  <Video className="w-4 h-4 mr-2" />
                  New Meeting
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-3">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">AI Agents</CardTitle>
              <CardDescription>
                Manage your custom AI agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Create and customize AI agents with specific instructions and capabilities for different use cases.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/agents">
                  <Bot className="w-4 h-4 mr-2" />
                  Manage Agents
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Site Update Warning */}
        <div className="mt-8 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-lg">
          <p className="text-sm">
            <strong>Site update:</strong> Demo mode provides a fully simulated experience — no real AI calls are performed. In the production SaaS deployment, AI functionality is currently disabled because we do not have an active OpenAI API key with billing enabled (OpenAI requires a funded account to make API requests). As a result, features that depend on the AI backend — such as voice-driven agent interactions, automated meeting summaries, and transcripts — are not available at this time. We also have not yet integrated a payment provider (for example, Stripe).
          </p>
          <p className="mt-2 text-sm">
            We are actively working to enable production AI access and payments. This page will be updated when those features are restored.
          </p>
        </div>

        {/* Thank You Note */}
        <div className="mt-4 text-center text-gray-600">
          <p>Thank you for your patience and support. We will notify users once AI features are enabled.</p>
        </div>
      </div>
    </div>
  );
};
