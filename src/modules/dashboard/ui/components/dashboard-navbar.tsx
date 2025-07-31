"use client";

import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { PanelLeftIcon, PanelLeftCloseIcon } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { DashboardCommand } from "./dashboard-command";

export const DashboardNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar();
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(()=>{
    const down = (e: KeyboardEvent)=>{
        if(e.key==="k" && (e.metaKey || e.ctrlKey)){
            e.preventDefault();
            setCommandOpen((open)=>!open);
        }
    };
    document.addEventListener("keydown",down);
    return () => document.removeEventListener("keydown", down);
  },[]);

  return (
    <>
    <DashboardCommand open={commandOpen} setOpen={setCommandOpen}/>
    <nav className="flex px-4 gap-x-2 items-center py-3 border-b bg-background">
      <Button 
        className="size-9" 
        variant="outline" 
        onClick={toggleSidebar}
      >
        {(state === "collapsed" || isMobile)
          ? <PanelLeftIcon className="size-4" />
          : <PanelLeftCloseIcon className="size-4" />
        }
      </Button>
      <Button
        className="h-9 w-[240px] font-normal text-muted-foreground hover:text-muted-foreground flex items-center justify-between font-sans"
        variant="outline"
        size="sm"
        onClick={()=> setCommandOpen((open)=>!open)}
      >
        <div className="flex items-center gap-2 font-sans">
          <SearchIcon />
          Search
        </div>
        <div className="flex items-center gap-0.5 font-sans">
          <span className="text-xs">&#8984;</span>
          <span>K</span>
        </div>
      </Button>
    </nav>
    </>
  );
};