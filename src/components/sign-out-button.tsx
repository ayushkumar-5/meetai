"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => router.push("/sign-in")
        }
      });
    } catch (error) {
      console.error("Sign out error:", error);
      // Fallback redirect
      router.push("/sign-in");
    }
  };

  return (
    <Button
  onClick={handleSignOut}
  className="bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 rounded w-fit"
>
  Sign out
</Button>
  );
}; 