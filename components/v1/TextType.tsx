"use client";

import React, { useState, useEffect, useRef } from "react";
import "./TextType.css";

export interface TextTypeProps {
  text: string | string[];
  as?: React.ElementType;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  initialDelay?: number;
  loop?: boolean;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorCharacter?: string;
  startOnVisible?: boolean;
  className?: string;
  [key: string]: any;
}

export function TextType({
  text,
  as: Component = "span",
  typingSpeed = 30,
  deletingSpeed = 20,
  pauseDuration = 2500,
  initialDelay = 0,
  loop = false,
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = "|",
  startOnVisible = true,
  className = "",
  ...props
}: TextTypeProps) {
  const textArray = Array.isArray(text) ? text : [text];

  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isStarted, setIsStarted] = useState(!startOnVisible);

  const containerRef = useRef<HTMLElement>(null);
  const hasStartedRef = useRef(false);

  // 1. IntersectionObserver to trigger when scrolled into view
  useEffect(() => {
    if (!startOnVisible) {
      setIsStarted(true);
      return;
    }

    const element = containerRef.current;
    if (!element || hasStartedRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStartedRef.current) {
          hasStartedRef.current = true;
          setIsStarted(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -20px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [startOnVisible]);

  // 2. Robust, bulletproof async loop triggered once when isStarted becomes true
  useEffect(() => {
    if (!isStarted) return;

    let isCancelled = false;

    const runLoop = async () => {
      if (initialDelay > 0) {
        await new Promise((res) => setTimeout(res, initialDelay));
      }

      let arrayIdx = 0;

      while (!isCancelled) {
        const fullText = textArray[arrayIdx % textArray.length] || "";

        // TYPING PHASE
        setIsTyping(true);
        setIsCompleted(false);

        for (let i = 1; i <= fullText.length; i++) {
          if (isCancelled) return;
          setDisplayedText(fullText.slice(0, i));
          await new Promise((res) => setTimeout(res, typingSpeed));
        }

        // FINISHED TYPING
        setIsTyping(false);
        setIsCompleted(true);

        if (!loop) {
          // If no loop, stop permanently at full text
          return;
        }

        // PAUSE AT FULL TEXT
        await new Promise((res) => setTimeout(res, pauseDuration));

        if (isCancelled) return;

        // DELETING PHASE
        setIsTyping(true);
        setIsCompleted(false);

        for (let i = fullText.length - 1; i >= 0; i--) {
          if (isCancelled) return;
          setDisplayedText(fullText.slice(0, i));
          await new Promise((res) => setTimeout(res, deletingSpeed));
        }

        setIsTyping(false);
        arrayIdx++;
      }
    };

    runLoop();

    return () => {
      isCancelled = true;
    };
  }, [isStarted]);

  const shouldShowCursor =
    showCursor &&
    isStarted &&
    (displayedText.length > 0 || isTyping) &&
    (hideCursorWhileTyping ? !isTyping && isCompleted : true);

  return (
    <Component
      ref={containerRef}
      className={`text-type-container ${className}`}
      suppressHydrationWarning
      {...props}
    >
      <span>{displayedText}</span>
      {shouldShowCursor && (
        <span className="text-type-cursor" aria-hidden="true">
          {cursorCharacter}
        </span>
      )}
    </Component>
  );
}

export default TextType;
