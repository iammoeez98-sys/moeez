"use client";

import React, { useRef, useEffect, useState, useMemo, useId, FC, PointerEvent } from "react";
import "./CurvedLoop.css";

interface CurvedLoopProps {
  marqueeText?: string;
  speed?: number;
  className?: string;
  curveAmount?: number;
  direction?: "left" | "right";
  interactive?: boolean;
}

export const CurvedLoop: FC<CurvedLoopProps> = ({
  marqueeText = "",
  speed = 1.5,
  className = "",
  curveAmount = 40,
  direction = "left",
  interactive = true,
}) => {
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    return (hasTrailing ? marqueeText.replace(/\s+$/, "") : marqueeText) + "\u00A0";
  }, [marqueeText]);

  const measureRef = useRef<SVGTextElement | null>(null);
  const textPathRef = useRef<SVGTextPathElement | null>(null);
  const [spacing, setSpacing] = useState(0);
  const [offset, setOffset] = useState(0);

  const uid = useId();
  const pathId = `curve-${uid.replace(/:/g, "")}`;

  // Quadratic curve path centered in 120px viewport: M-100,50 Q700,50+curveAmount 1500,50
  const pathD = `M-100,45 Q700,${45 + curveAmount} 1500,45`;

  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef<"left" | "right">(direction);
  const velRef = useRef(0);
  const offsetRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  // Measure text width once mounted
  useEffect(() => {
    if (measureRef.current) {
      const len = measureRef.current.getComputedTextLength();
      if (len > 0) {
        setSpacing(len);
      }
    }
  }, [text, className]);

  // Total repeated string to ensure zero blank spots along path
  const textLength = spacing;
  const totalText = textLength
    ? Array(Math.ceil(3000 / textLength) + 3)
        .fill(text)
        .join("")
    : text;

  // Animation Loop via requestAnimationFrame
  useEffect(() => {
    if (!spacing) return;

    let animId: number;

    const step = () => {
      let currentVel = speed;

      if (interactive && !dragRef.current && Math.abs(velRef.current) > 0.01) {
        velRef.current *= 0.94; // Smooth momentum decay
        currentVel += Math.abs(velRef.current);
        if (velRef.current < 0) {
          dirRef.current = "left";
        } else if (velRef.current > 0) {
          dirRef.current = "right";
        }
      }

      let nextOffset = offsetRef.current;
      const move = dirRef.current === "left" ? -currentVel : currentVel;
      nextOffset += move;

      // Wrap around spacing for continuous seamless loop
      if (nextOffset <= -spacing) {
        nextOffset += spacing;
      } else if (nextOffset > 0) {
        nextOffset -= spacing;
      }

      offsetRef.current = nextOffset;
      setOffset(nextOffset);

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animId);
  }, [spacing, speed, interactive]);

  // Pointer Event Handlers for Touch & Mouse Dragging
  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    setIsDragging(true);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!interactive || !dragRef.current) return;
    const delta = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;

    velRef.current = delta;
    if (delta !== 0) {
      dirRef.current = delta > 0 ? "right" : "left";
    }

    let nextOffset = offsetRef.current + delta;
    if (spacing > 0) {
      if (nextOffset <= -spacing) {
        nextOffset += spacing;
      } else if (nextOffset > 0) {
        nextOffset -= spacing;
      }
    }
    offsetRef.current = nextOffset;
    setOffset(nextOffset);
  };

  const handlePointerUp = () => {
    if (!interactive) return;
    dragRef.current = false;
    setIsDragging(false);
  };

  return (
    <div
      className={`curved-loop-jacket ${isDragging ? "is-dragging" : ""} ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: "pan-y" }}
      suppressHydrationWarning
    >
      {/* Hidden element for measuring text length */}
      <svg className="absolute opacity-0 pointer-events-none -z-50 w-0 h-0" aria-hidden="true">
        <text ref={measureRef} className="curved-loop-text-style">
          {text}
        </text>
      </svg>

      {/* Main SVG Render Stage */}
      <svg
        className="curved-loop-svg"
        viewBox="0 0 1400 120"
        preserveAspectRatio="xMidYMid meet"
      >
        <path id={pathId} d={pathD} fill="none" stroke="transparent" />
        <text className="curved-loop-text-style">
          <textPath
            ref={textPathRef}
            href={`#${pathId}`}
            startOffset={`${offset}px`}
          >
            {totalText}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default CurvedLoop;
