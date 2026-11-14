"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function GlobalEasterEggs() {
  const [mounted, setMounted] = useState(false);
  const [isUndoModalOpen, setIsUndoModalOpen] = useState(false);
  const [isGridOpen, setIsGridOpen] = useState(false);

  const okButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Utility to check if a text input or textarea is active
  const isInputFocused = () => {
    const active = document.activeElement;
    if (!active) return false;
    const tagName = active.tagName.toLowerCase();
    return (
      tagName === "input" ||
      tagName === "textarea" ||
      (active as HTMLElement).isContentEditable
    );
  };

  const closeUndoModal = () => {
    setIsUndoModalOpen(false);
    if (previousFocusRef.current && typeof previousFocusRef.current.focus === "function") {
      previousFocusRef.current.focus();
    }
  };

  // Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key closes modal if open
      if (e.key === "Escape" && isUndoModalOpen) {
        e.preventDefault();
        closeUndoModal();
        return;
      }

      // Do NOT trigger easter eggs if user is typing in an input/textarea
      if (isInputFocused()) return;

      // 1. Ctrl+Z / Cmd+Z "Undo" Joke
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (!isUndoModalOpen) {
          previousFocusRef.current = document.activeElement as HTMLElement;
          setIsUndoModalOpen(true);
        }
        return;
      }

      // 2. "G" key Design Grid Overlay Toggle
      if (e.key.toLowerCase() === "g" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setIsGridOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isUndoModalOpen]);

  // Focus modal button when opened
  useEffect(() => {
    if (isUndoModalOpen) {
      setTimeout(() => {
        okButtonRef.current?.focus();
      }, 50);
    }
  }, [isUndoModalOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Continuous Looping Keyboard Easter Egg Hint (Bottom-Right Corner) */}
      <AnimatePresence>
        {!isGridOpen && !isUndoModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{
              opacity: [0.35, 1, 1, 0.35],
              y: [4, 0, 0, 4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="hidden lg:block fixed bottom-5 right-5 z-40 pointer-events-none select-none -rotate-3 transform origin-right"
          >
            <span className="font-[family-name:var(--font-handwriting)] text-base sm:text-lg font-semibold text-zinc-400">
              Psst — try pressing G or Ctrl+Z 👀
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 12-Column Design Grid Overlay */}
      <AnimatePresence>
        {isGridOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] pointer-events-none select-none overflow-hidden"
          >
            {/* Horizontal 24px Baseline Grid */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(239, 68, 68, 0.05) 0px, rgba(239, 68, 68, 0.05) 1px, transparent 1px, transparent 24px)",
              }}
            />

            {/* 12-Column Container matching site layout */}
            <div className="max-w-6xl mx-auto px-6 sm:px-12 md:px-16 lg:px-24 h-full relative">
              <div className="w-full h-full grid grid-cols-12 gap-4 sm:gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-full bg-red-500/[0.035] border-x border-red-500/10 flex flex-col justify-between py-2"
                  >
                    <span className="font-mono text-[9px] text-red-500/50 font-bold px-1 select-none">
                      {i + 1}
                    </span>
                    <span className="font-mono text-[9px] text-red-500/50 font-bold px-1 select-none self-end">
                      {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ctrl+Z / Cmd+Z Undo Joke Modal */}
      <AnimatePresence>
        {isUndoModalOpen && (
          <div
            className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 overflow-hidden"
            onClick={closeUndoModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="bg-white text-zinc-950 max-w-sm w-full p-6 sm:p-7 rounded-2xl shadow-2xl border border-zinc-200 flex flex-col gap-5 text-center select-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-2 items-center">
                <h3 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight">
                  Nice try. 🎨
                </h3>
                <p className="font-sans text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
                  There's no undo button in real life — but there is one in Figma.
                </p>
              </div>

              <button
                ref={okButtonRef}
                onClick={closeUndoModal}
                className="w-full py-2.5 px-4 bg-zinc-950 text-white hover:bg-zinc-800 rounded-xl font-sans text-sm font-bold tracking-wide transition-colors cursor-pointer active:scale-98"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default GlobalEasterEggs;
