"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

type User = { name: string };
type Session = { user: User } | null;

export const HomeView = () => {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await authClient.getSession();
      if (sessionData && 'user' in sessionData) {
        setSession(sessionData as Session);
      } else {
        setSession(null);
      }
    };
    fetchSession();
  }, []);

  if (!session || !session.user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col p-4 gap-y-4">
      <p>Logged in as {session.user.name}</p>
      <Button onClick={() => authClient.signOut({fetchOptions: {onSuccess: () => router.push("/sign-in")}})}>
        Sign out
      </Button>
    </div>
  );
};
