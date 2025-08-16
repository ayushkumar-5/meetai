"use client";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { BotIcon, VideoIcon, StarIcon , UserRound} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { DashboardUserButton } from "./dashboard-user-button";

// Sidebar sections
const firstSection = [
    {
        icon: VideoIcon,
        label: "Meetings",
        href: "/meetings",
    },
    {
        icon: BotIcon,
        label: "Agents",
        href: "/agents",
    },
    {
        icon: UserRound,
        label: "Demo",
        href: "/demo",
    },
];

const upgradeSection = [
    {
        icon: StarIcon,
        label: "Upgrade",
        href: "/upgrade",
    },
];

export const DashboardSidebar = () => {
    const pathname = usePathname();
    
    return (
        <Sidebar>
            <SidebarHeader className="text-sidebar-accent-foreground">
                <Link href="/" className="flex items-center gap-2 px-2 pt-2">
                    <Image src="/logo.svg" height={36} width={36} alt="Meet AI" />           
                    <p className="text-2xl font-semibold">Meet AI</p>
                </Link>
            </SidebarHeader>

            <div className="px-4 py-2">
                <Separator className="opacity-10 text-[#5D6B6E]" />
            </div>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {firstSection.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton 
                                        asChild
                                        className={cn(
                                            "h-10 border border-transparent",
                                            "hover:border-[#5D6B68]/10",
                                            "hover:bg-gradient-to-r hover:from-[#8B9DC3]/20 hover:to-[#8B9DC3]/10",
                                            pathname === item.href && "bg-gradient-to-r from-[#8B9DC3]/20 to-[#8B9DC3]/10 border-[#5D6B68]/10"
                                        )}
                                    >
                                        <Link href={item.href} className="flex items-center gap-2 w-full">
                                            <item.icon className="w-4 h-4" />
                                            <span className="text-sm font-medium tracking-tight">
                                                {item.label}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator className="my-4" />

                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {upgradeSection.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton 
                                        asChild
                                        className={cn(
                                            "h-10 border border-transparent",
                                            "hover:border-[#7B68EE]/20",
                                            "hover:bg-gradient-to-r hover:from-[#7B68EE]/30 hover:via-[#00B7FA]/30 hover:to-[#7B68EE]/30",
                                            pathname === item.href && "bg-gradient-to-r from-[#8B9DC3]/20 to-[#8B9DC3]/10 border-[#5D6B68]/10"
                                        )}
                                    >
                                        <Link href={item.href} className="flex items-center gap-2 w-full">
                                            <item.icon className="w-4 h-4" />
                                            <span className="text-sm font-medium tracking-tight">
                                                {item.label}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="text-white">
<DashboardUserButton />
</SidebarFooter>
        </Sidebar>
    );
};