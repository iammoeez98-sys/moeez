"use client";

import React, { useState, useEffect } from "react";
import { CursorProvider, Cursor, CursorFollow } from "@/components/ui/cursor";

export function CustomCursorWrapper({ children }: { children: React.ReactNode }) {
  const [isFinePointer, setIsFinePointer] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    // Media query check for fine pointer / desktop mouse
    const mediaQuery = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
    setIsFinePointer(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };
    mediaQuery.addEventListener("change", handleChange);

    // Global event delegation for hovering interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"]), .cursor-pointer, canvas, video'
      );
      setIsHovered(!!interactive);
    };

    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);


  return (
    <div className="relative w-full min-h-screen">
      {isFinePointer && <CursorProvider className="pointer-events-none">
        <Cursor>
          <div className="w-2.5 h-2.5 rounded-full bg-black shadow-xs pointer-events-none" />
        </Cursor>
        <CursorFollow
          align="center"
          sideOffset={0}
          transition={{ stiffness: 450, damping: 32, bounce: 0 }}
        >
          <div
            className={`rounded-full border-2 border-black transition-all duration-200 ease-out pointer-events-none ${
              isHovered
                ? "w-12 h-12 bg-black/10 border-black shadow-xs"
                : "w-8 h-8 bg-transparent border-black"
            }`}
          />
        </CursorFollow>
      </CursorProvider>}
      {children}
    </div>
  );
}
