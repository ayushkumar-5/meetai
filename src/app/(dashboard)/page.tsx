import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { HomeView } from "@/modules/home/ui/views/home-view";

import { caller } from "@/trpc/server";

const Page = async () => {
  

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

 
  // Uncommitted changes
  return <HomeView />;
};

export default Page;
