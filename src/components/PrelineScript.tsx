"use client";

import { useEffect } from "react";

async function loadPreline() {
  return import("preline/dist/index.js");
}

export default function PrelineScript() {
  useEffect(() => {
    const initPreline = async () => {
      await loadPreline();
    };

    initPreline();
  }, []);

  return null;
}
