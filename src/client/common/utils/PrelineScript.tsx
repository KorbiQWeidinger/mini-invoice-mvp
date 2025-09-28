"use client";

import { useEffect } from "react";

async function loadPreline() {
  return import("preline/dist/index.js");
}

async function loadPrelineSelect() {
  return import("@preline/select");
}

export default function PrelineScript() {
  useEffect(() => {
    const initPreline = async () => {
      await loadPreline();
      await loadPrelineSelect();

      // Initialize Preline components
      if (typeof window !== "undefined" && window.HSStaticMethods) {
        window.HSStaticMethods.autoInit();
      }
    };

    initPreline();
  }, []);

  return null;
}
