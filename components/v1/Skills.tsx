"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { TextType } from "./TextType";
import { PaletteDoodle, WandDoodle } from "./Doodles";

/* Brand assets are stored locally; provenance is in public/icons/SOURCES.json. */
interface ToolItem {
  id: string;
  name: string;
  icon: string;
}

const baseTools: ToolItem[] = [
  { id: "figma", name: "Figma", icon: "/icons/figma.svg" },
  { id: "photoshop", name: "Photoshop", icon: "/icons/photoshop.svg" },
  { id: "cursor", name: "Cursor", icon: "/icons/cursor.svg" },
  { id: "claude", name: "Claude", icon: "/icons/claude.svg" },
  { id: "antigravity", name: "Antigravity", icon: "/icons/antigravity.svg" },
  { id: "v0", name: "V0", icon: "/icons/v0.svg" },
  { id: "slack", name: "Slack", icon: "/icons/slack.svg" },
  { id: "jira", name: "Jira", icon: "/icons/jira.svg" },
  { id: "lovable", name: "Lovable", icon: "/icons/lovable.svg" },
  { id: "illustrator", name: "Illustrator", icon: "/icons/illustrator.svg" },
  { id: "aftereffects", name: "After Effects", icon: "/icons/aftereffects.svg" },
  { id: "openai", name: "OpenAI", icon: "/icons/openai.svg" },
];

const baseToolsRow1: ToolItem[] = [
  baseTools[0],  // Figma
  baseTools[2],  // Cursor
  baseTools[4],  // Antigravity
  baseTools[6],  // Slack
  baseTools[8],  // Lovable
  baseTools[10], // After Effects
];

const baseToolsRow2: ToolItem[] = [
  baseTools[1],  // Photoshop
  baseTools[3],  // Claude
  baseTools[5],  // V0
  baseTools[7],  // Jira
  baseTools[9],  // Illustrator
  baseTools[11], // OpenAI
];

// Sets of tools for seamless infinite marquee across wide screens
const marqueeToolsRow1 = [
  ...baseToolsRow1.map((t, i) => ({ ...t, key: `r1-s1-${i}-${t.id}` })),
  ...baseToolsRow1.map((t, i) => ({ ...t, key: `r1-s2-${i}-${t.id}` })),
  ...baseToolsRow1.map((t, i) => ({ ...t, key: `r1-s3-${i}-${t.id}` })),
  ...baseToolsRow1.map((t, i) => ({ ...t, key: `r1-s4-${i}-${t.id}` })),
];

const marqueeToolsRow2 = [
  ...baseToolsRow2.map((t, i) => ({ ...t, key: `r2-s1-${i}-${t.id}` })),
  ...baseToolsRow2.map((t, i) => ({ ...t, key: `r2-s2-${i}-${t.id}` })),
  ...baseToolsRow2.map((t, i) => ({ ...t, key: `r2-s3-${i}-${t.id}` })),
  ...baseToolsRow2.map((t, i) => ({ ...t, key: `r2-s4-${i}-${t.id}` })),
];

// Unboxed Tool Item with Magnetic Distance-Based Scaling
function ToolItemView({
  tool,
  mouseX,
  isDockHovered,
  isMobile,
}: {
  tool: ToolItem & { key: string };
  mouseX: any;
  isDockHovered: boolean;
  isMobile: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    if (isMobile || !isDockHovered) return Infinity;
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return Infinity;
    return val - bounds.x - bounds.width / 2;
  });

  // Base scale = 1, Max scale = 1.38, Distance falloff = 150px
  const scaleSync = useTransform(distance, [-150, 0, 150], [1, 1.38, 1]);
  const scale = useSpring(scaleSync, { mass: 0.1, stiffness: 180, damping: 14 });



  return (
    <motion.div
      ref={ref}
      style={{ scale }}
      className="shrink-0 flex items-center gap-3.5 py-3 px-4 select-none cursor-pointer group"
    >
      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 shrink-0 flex items-center justify-center drop-shadow-sm overflow-hidden">
        <img src={tool.icon} alt={`${tool.name} logo`} width={44} height={44} className="w-full h-full object-contain" />
      </div>
      <span className="font-mono text-sm sm:text-base md:text-lg font-bold text-zinc-900 tracking-wider whitespace-nowrap">
        {tool.name}
      </span>
    </motion.div>
  );
}

export function Skills() {
  const mouseX1 = useMotionValue(Infinity);
  const mouseX2 = useMotionValue(Infinity);

  const [isHoveredRow1, setIsHoveredRow1] = useState(false);
  const [isHoveredRow2, setIsHoveredRow2] = useState(false);

  const [scrollX1, setScrollX1] = useState(0);
  const [scrollX2, setScrollX2] = useState(0);

  const scrollX1Ref = useRef(0);
  const scrollX2Ref = useRef(0);

  const isHoveredRow1Ref = useRef(false);
  const isHoveredRow2Ref = useRef(false);

  const singleSet1Ref = useRef<HTMLDivElement>(null);
  const singleSet2Ref = useRef<HTMLDivElement>(null);

  const singleSetWidth1Ref = useRef(0);
  const singleSetWidth2Ref = useRef(0);

  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Measure exact width of Row 1 & Row 2
  useEffect(() => {
    const updateWidths = () => {
      if (singleSet1Ref.current) {
        const w1 = singleSet1Ref.current.offsetWidth;
        if (w1 > 0) singleSetWidth1Ref.current = w1;
      }
      if (singleSet2Ref.current) {
        const w2 = singleSet2Ref.current.offsetWidth;
        if (w2 > 0) singleSetWidth2Ref.current = w2;
      }
    };

    updateWidths();

    let observer1: ResizeObserver | null = null;
    let observer2: ResizeObserver | null = null;

    if (typeof ResizeObserver !== "undefined") {
      if (singleSet1Ref.current) {
        observer1 = new ResizeObserver(updateWidths);
        observer1.observe(singleSet1Ref.current);
      }
      if (singleSet2Ref.current) {
        observer2 = new ResizeObserver(updateWidths);
        observer2.observe(singleSet2Ref.current);
      }
    }

    const timer1 = setTimeout(updateWidths, 50);
    const timer2 = setTimeout(updateWidths, 300);

    return () => {
      if (observer1) observer1.disconnect();
      if (observer2) observer2.disconnect();
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [mounted]);

  // Sync refs for requestAnimationFrame closures
  useEffect(() => {
    isHoveredRow1Ref.current = isHoveredRow1;
  }, [isHoveredRow1]);

  useEffect(() => {
    isHoveredRow2Ref.current = isHoveredRow2;
  }, [isHoveredRow2]);

  // Continuous Marquee Animation Loop - Row 1 (Moves Left @ -0.75px)
  useEffect(() => {
    let animId: number;

    const step1 = () => {
      if (!isHoveredRow1Ref.current || isMobile) {
        scrollX1Ref.current -= 0.75;

        const width = singleSetWidth1Ref.current || singleSet1Ref.current?.offsetWidth || 0;
        if (width > 0 && Math.abs(scrollX1Ref.current) >= width) {
          scrollX1Ref.current += width;
        }

        setScrollX1(scrollX1Ref.current);
      }

      animId = requestAnimationFrame(step1);
    };

    animId = requestAnimationFrame(step1);
    return () => cancelAnimationFrame(animId);
  }, [isMobile]);

  // Continuous Marquee Animation Loop - Row 2 (Moves Right @ +0.60px - 20% slower opposite direction)
  useEffect(() => {
    let animId: number;

    const step2 = () => {
      if (!isHoveredRow2Ref.current || isMobile) {
        scrollX2Ref.current += 0.60;

        const width = singleSetWidth2Ref.current || singleSet2Ref.current?.offsetWidth || 0;
        if (width > 0 && scrollX2Ref.current >= 0) {
          scrollX2Ref.current -= width;
        }

        setScrollX2(scrollX2Ref.current);
      }

      animId = requestAnimationFrame(step2);
    };

    animId = requestAnimationFrame(step2);
    return () => cancelAnimationFrame(animId);
  }, [isMobile]);

  return (
    <section
      id="skills"
      className="relative w-full bg-[#F7F7F5] text-black pt-16 pb-16 sm:pt-20 sm:pb-20 md:pt-24 md:pb-24 border-t border-zinc-200/60 select-none overflow-hidden"
      suppressHydrationWarning
    >
      {/* Decorative Outer Margin Doodles (Desktop Only) */}
      <PaletteDoodle className="absolute top-12 left-6 lg:left-12 xl:left-20 w-12 h-12 lg:w-14 lg:h-14 text-zinc-400/80 -rotate-6 hidden lg:block pointer-events-none select-none transition-transform duration-500 hover:scale-105" />
      <WandDoodle className="absolute top-16 right-6 lg:right-12 xl:right-20 w-12 h-12 lg:w-14 lg:h-14 text-zinc-400/80 rotate-15 hidden lg:block pointer-events-none select-none transition-transform duration-500 hover:scale-105" />

      {/* Section Header */}
      <div className="max-w-6xl mx-auto px-6 sm:px-12 md:px-16 lg:px-24 flex flex-col items-center text-center gap-2 mb-6 sm:mb-8" suppressHydrationWarning>
        <div className="flex items-center">
          <span className="font-[family-name:var(--font-handwriting)] text-xl sm:text-2xl font-bold tracking-wide text-zinc-500">
            Tools I Use
          </span>
        </div>
        <TextType
          text={["What's in my toolkit"]}
          as="h2"
          typingSpeed={25}
          loop={false}
          showCursor={true}
          hideCursorWhileTyping={false}
          startOnVisible={true}
          cursorCharacter="|"
          className="font-[family-name:var(--font-display)] font-extrabold text-[24px] sm:text-[34px] md:text-[46px] lg:text-[56px] text-zinc-950 tracking-tight leading-none"
        />
      </div>

      {/* 2-Row Full-Width Edge-to-Edge Marquee Container */}
      <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 w-full relative select-none">
        {/* Left & Right Smooth Edge Fade Gradients */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-28 md:w-36 bg-gradient-to-r from-[#F7F7F5] via-[#F7F7F5]/95 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-28 md:w-36 bg-gradient-to-l from-[#F7F7F5] via-[#F7F7F5]/95 to-transparent z-20 pointer-events-none" />

        {/* Row 1: Left-scrolling Marquee */}
        <div
          onMouseEnter={() => setIsHoveredRow1(true)}
          onMouseLeave={() => {
            setIsHoveredRow1(false);
            mouseX1.set(Infinity);
          }}
          onMouseMove={(e) => mouseX1.set(e.clientX)}
          className="relative w-full overflow-hidden py-2 select-none cursor-grab active:cursor-grabbing"
        >
          <div
            className="flex items-center gap-8 sm:gap-12 md:gap-16 w-max py-2"
            style={{ transform: `translateX(${scrollX1}px)`, willChange: "transform" }}
          >
            {/* Row 1 Measurement Set */}
            <div ref={singleSet1Ref} className="flex items-center gap-8 sm:gap-12 md:gap-16">
              {baseToolsRow1.map((t) => (
                <ToolItemView
                  key={`r1-meas-${t.id}`}
                  tool={{ ...t, key: `r1-meas-${t.id}` }}
                  mouseX={mouseX1}
                  isDockHovered={isHoveredRow1}
                  isMobile={isMobile}
                />
              ))}
            </div>

            {/* Row 1 Loop Sets */}
            {marqueeToolsRow1.slice(baseToolsRow1.length).map((tool) => (
              <ToolItemView
                key={tool.key}
                tool={tool}
                mouseX={mouseX1}
                isDockHovered={isHoveredRow1}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>

        {/* Row 2: Right-scrolling Marquee (Opposite Direction & ~20% Slower) */}
        <div
          onMouseEnter={() => setIsHoveredRow2(true)}
          onMouseLeave={() => {
            setIsHoveredRow2(false);
            mouseX2.set(Infinity);
          }}
          onMouseMove={(e) => mouseX2.set(e.clientX)}
          className="relative w-full overflow-hidden py-2 select-none cursor-grab active:cursor-grabbing"
        >
          <div
            className="flex items-center gap-8 sm:gap-12 md:gap-16 w-max py-2"
            style={{ transform: `translateX(${scrollX2}px)`, willChange: "transform" }}
          >
            {/* Row 2 Measurement Set */}
            <div ref={singleSet2Ref} className="flex items-center gap-8 sm:gap-12 md:gap-16">
              {baseToolsRow2.map((t) => (
                <ToolItemView
                  key={`r2-meas-${t.id}`}
                  tool={{ ...t, key: `r2-meas-${t.id}` }}
                  mouseX={mouseX2}
                  isDockHovered={isHoveredRow2}
                  isMobile={isMobile}
                />
              ))}
            </div>

            {/* Row 2 Loop Sets */}
            {marqueeToolsRow2.slice(baseToolsRow2.length).map((tool) => (
              <ToolItemView
                key={tool.key}
                tool={tool}
                mouseX={mouseX2}
                isDockHovered={isHoveredRow2}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Skills;
