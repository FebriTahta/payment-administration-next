"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Prevent rendering until the component is mounted to avoid mismatch
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}