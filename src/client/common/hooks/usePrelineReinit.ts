"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function usePrelineReinit() {
  const pathname = usePathname();

  useEffect(() => {
    // Reinitialize Preline components after navigation
    const reinitPreline = () => {
      if (typeof window !== "undefined" && window.HSStaticMethods) {
        // Small delay to ensure DOM is updated
        setTimeout(() => {
          window.HSStaticMethods.autoInit();
        }, 100);
      }
    };

    reinitPreline();
  }, [pathname]); // Reinitialize when pathname changes
}
