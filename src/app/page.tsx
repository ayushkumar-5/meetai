import {auth} from "@/lib/auth";
import { headers } from "next/headers";
import {redirect} from "next/navigation";
import { SignOutButton } from "@/components/sign-out-button";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col p-4 gap-y-4">
      <h1>Welcome, {session.user.name}!</h1>
      <p>You are successfully logged in.</p>
      <SignOutButton />
    </div>
  );
};

export default Page;
