"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { TextType } from "./TextType";
import { PaletteDoodle, WandDoodle } from "./Doodles";

// Custom SVG Icons for Tools & Skills
const FigmaIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 38 57" fill="none" className={className}>
    <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38H19V28.5Z" fill="#1ABCFE" />
    <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
    <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
    <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
    <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
  </svg>
);

const PhotoshopIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    <rect width="100" height="100" rx="22" fill="#001E36" />
    <path d="M26 31H45C52.5 31 58 35.5 58 42.5C58 49.5 52.5 54 45 54H36V70H26V31ZM36 46H44C47.5 46 49.5 44.5 49.5 42.5C49.5 40.5 47.5 39H36V46Z" fill="#31A8FF" />
    <path d="M60 63C62 65 65.5 66.5 69 66.5C72 66.5 73.5 65.5 73.5 64C73.5 62.5 72 61.5 67.5 60.5C61 59 57.5 56.5 57.5 51.5C57.5 46 62.5 42.5 70 42.5C74 42.5 78 43.8 80.5 45.8L76.5 52C74.5 50.5 72 49.5 69.5 49.5C67 49.5 65.5 50.5 65.5 51.8C65.5 53 67 54 71.5 55C78.5 56.5 81.5 59.5 81.5 64C81.5 69.5 76.5 73.5 68.5 73.5C63.5 73.5 59 71.8 56 69.2L60 63Z" fill="#31A8FF" />
  </svg>
);

const CursorIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    <rect width="100" height="100" rx="22" fill="#09090B" />
    <path d="M30 25L75 50L53 57L67 78L56 85L42 64L30 75V25Z" fill="white" stroke="#09090B" strokeWidth="3" strokeLinejoin="round" />
  </svg>
);

const ClaudeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    <rect width="100" height="100" rx="22" fill="#D97757" />
    <path d="M50 20L56.5 40.5L77 34L61 48.5L77 63L56.5 56.5L50 77L43.5 56.5L23 63L39 48.5L23 34L43.5 40.5L50 20Z" fill="white" />
  </svg>
);

const AntigravityIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    <rect width="100" height="100" rx="22" fill="#18181B" />
    <circle cx="50" cy="50" r="16" stroke="#38BDF8" strokeWidth="6" />
    <ellipse cx="50" cy="50" rx="36" ry="14" stroke="#38BDF8" strokeWidth="4" transform="rotate(-30 50 50)" />
    <ellipse cx="50" cy="50" rx="36" ry="14" stroke="#818CF8" strokeWidth="4" transform="rotate(30 50 50)" />
    <circle cx="50" cy="50" r="6" fill="#38BDF8" />
  </svg>
);

const V0Icon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    <rect width="100" height="100" rx="22" fill="#000000" />
    <path d="M26 65L44 35H34L26 50L18 35H8L26 65Z" fill="white" />
    <path d="M54 35C45.7 35 39 41.7 39 50C39 58.3 45.7 65 54 65C62.3 65 69 58.3 69 50C69 41.7 62.3 35 54 35ZM54 57C50.1 57 47 53.9 47 50C47 46.1 50.1 43 54 43C57.9 43 61 46.1 61 50C61 53.9 57.9 57 54 57Z" fill="white" />
  </svg>
);

const SlackIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    <rect width="100" height="100" rx="22" fill="#4A154B" />
    <g transform="translate(18, 18) scale(0.64)">
      <path d="M25 60A10 10 0 1 0 35 70V60H25Z" fill="#E01E5A" />
      <path d="M25 25A10 10 0 0 0 25 45H35V25A10 10 0 0 0 25 25Z" fill="#E01E5A" />
      <path d="M40 25A10 10 0 1 0 30 15H40V25Z" fill="#36C5F0" />
      <path d="M75 25A10 10 0 0 0 55 25V35H75A10 10 0 0 0 75 25Z" fill="#36C5F0" />
      <path d="M75 40A10 10 0 1 0 65 30V40H75Z" fill="#2EB67D" />
      <path d="M75 75A10 10 0 0 0 75 55H65V75A10 10 0 0 0 75 75Z" fill="#2EB67D" />
      <path d="M60 75A10 10 0 1 0 70 85V75H60Z" fill="#ECB22E" />
      <path d="M25 75A10 10 0 0 0 45 75V65H25A10 10 0 0 0 25 75Z" fill="#ECB22E" />
    </g>
  </svg>
);

const JiraIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    <rect width="100" height="100" rx="22" fill="#0052CC" />
    <path d="M51 22L32 41L45 54L64 35L51 22Z" fill="#2684FF" />
    <path d="M51 44L32 63L45 76L64 57L51 44Z" fill="#2684FF" />
    <path d="M32 41L21 52L34 65L45 54L32 41Z" fill="#0052CC" opacity="0.6" />
  </svg>
);

const LovableIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    <rect width="100" height="100" rx="22" fill="#18181B" />
    <path d="M50 78C50 78 22 58 22 37C22 26 31 18 41 18C46.5 18 50 21 50 21C50 21 53.5 18 59 18C69 18 78 26 78 37C78 58 50 78 50 78Z" fill="#FF2E63" />
  </svg>
);

const IllustratorIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    <rect width="100" height="100" rx="22" fill="#330000" />
    <path d="M25 70L38 31H48L61 70H51L48 60H38L35 70H25ZM40 52H46L43 41L40 52Z" fill="#FF9A00" />
    <path d="M66 43H75V70H66V43ZM66 31H75V38H66V31Z" fill="#FF9A00" />
  </svg>
);

const AfterEffectsIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    <rect width="100" height="100" rx="22" fill="#00005C" />
    <path d="M24 70L37 31H47L60 70H50L47 60H37L34 70H24ZM39 52H45L42 41L39 52Z" fill="#D291FF" />
    <path d="M62 55.5C62 48.5 67 43 74.5 43C81.5 43 85.5 48 85.5 55.5V57.5H71C71.5 62 74 64 77.5 64C80.5 64 82.5 62.5 83.5 60.5L89.5 63.5C87.5 68 83.5 71 77.5 71C68.5 71 62 64.5 62 55.5ZM71 52H79.5C79 48.5 77 47 74.5 47C72 47 71 48.5 71 52Z" fill="#D291FF" />
  </svg>
);

const OpenAIIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    <rect width="100" height="100" rx="22" fill="#10A37F" />
    <path d="M50 24C35.6 24 24 35.6 24 50C24 64.4 35.6 76 50 76C64.4 76 76 64.4 76 50C76 35.6 64.4 24 50 24ZM50 32C59.9 32 68 40.1 68 50C68 59.9 59.9 68 50 68C40.1 68 32 59.9 32 50C32 40.1 40.1 32 50 32Z" fill="white" />
    <path d="M50 38C43.4 38 38 43.4 38 50C38 56.6 43.4 62 50 62C56.6 62 62 56.6 62 50C62 43.4 56.6 38 50 38Z" fill="white" opacity="0.8" />
  </svg>
);

interface ToolItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const baseTools: ToolItem[] = [
  { id: "figma", name: "Figma", icon: FigmaIcon },
  { id: "photoshop", name: "Photoshop", icon: PhotoshopIcon },
  { id: "cursor", name: "Cursor", icon: CursorIcon },
  { id: "claude", name: "Claude", icon: ClaudeIcon },
  { id: "antigravity", name: "Antigravity", icon: AntigravityIcon },
  { id: "v0", name: "V0", icon: V0Icon },
  { id: "slack", name: "Slack", icon: SlackIcon },
  { id: "jira", name: "Jira", icon: JiraIcon },
  { id: "lovable", name: "Lovable", icon: LovableIcon },
  { id: "illustrator", name: "Illustrator", icon: IllustratorIcon },
  { id: "aftereffects", name: "After Effects", icon: AfterEffectsIcon },
  { id: "openai", name: "OpenAI", icon: OpenAIIcon },
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

  const IconComp = tool.icon;

  return (
    <motion.div
      ref={ref}
      style={{ scale }}
      className="shrink-0 flex items-center gap-3.5 py-3 px-4 select-none cursor-pointer group"
    >
      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 shrink-0 flex items-center justify-center drop-shadow-sm overflow-hidden">
        <IconComp className="w-full h-full object-contain" />
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
          className="font-[family-name:var(--font-display)] font-extrabold text-xl sm:text-[34px] md:text-[46px] lg:text-[56px] text-zinc-950 tracking-tight leading-none"
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
