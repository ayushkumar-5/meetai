import * as React from "react"
import { useIsMobile } from "./use-mobile"

type SidebarState = "expanded" | "collapsed"

export function useSidebar() {
  const [state, setState] = React.useState<SidebarState>("expanded")
  const isMobile = useIsMobile()

  const toggleSidebar = React.useCallback(() => {
    setState(prev => prev === "expanded" ? "collapsed" : "expanded")
  }, [])

  return {
    state,
    toggleSidebar,
    isMobile
  }
} 