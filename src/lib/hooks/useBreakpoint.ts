"use client";

import { useState, useEffect } from "react";

interface BreakpointState {
  isMobile: boolean;
  isTablet: boolean;
  isLargeScreen: boolean;
  width: number;
}

export function useBreakpoint(): BreakpointState {
  const [breakpoint, setBreakpoint] = useState<BreakpointState>({
    isMobile: false,
    isTablet: false,
    isLargeScreen: false,
    width: 0,
  });

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;

      setBreakpoint({
        isMobile: width < 768, // md breakpoint
        isTablet: width >= 768 && width < 1024, // md to lg breakpoint
        isLargeScreen: width >= 1024, // lg breakpoint and above
        width,
      });
    };

    // Check on mount
    updateBreakpoint();

    // Listen for resize events
    window.addEventListener("resize", updateBreakpoint);

    return () => {
      window.removeEventListener("resize", updateBreakpoint);
    };
  }, []);

  return breakpoint;
}
