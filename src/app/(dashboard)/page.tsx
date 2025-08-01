import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { HomeView } from "@/modules/home/ui/views/home-view";

import { caller } from "@/trpc/server";

const Page = async () => {
  const data = await caller.hello({ text: "Ayushh Server" });

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return <p>{data.greeting}</p>;
  // Uncommitted changes
  return <HomeView />;
};

export default Page;
