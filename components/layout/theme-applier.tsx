"use client";

import { useEffect } from "react";

// Theme lives client-side now (no server session). Default is dark; if the
// user chose light (stored in localStorage), remove the `dark` class.
export function ThemeApplier() {
  useEffect(() => {
    const theme = window.localStorage.getItem("somnia_theme") || "light";
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);
  return null;
}
