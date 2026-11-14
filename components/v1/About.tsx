"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { CurvedLoop } from "./CurvedLoop";
import { PencilDoodle, SparklesDoodle } from "./Doodles";

interface WordProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const Word: React.FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  const color = useTransform(
    progress,
    range,
    ["rgb(212, 212, 216)", "rgb(9, 9, 11)"] // zinc-300 to zinc-950
  );

  return (
    <span className="relative inline-block mr-[0.28em] last:mr-0 select-none">
      <motion.span style={{ opacity, color }}>
        {children}
      </motion.span>
    </span>
  );
};

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const paragraphText =
    "I've spent the last 4+ years turning complex problems into interfaces people actually enjoy using. From SaaS dashboards to mobile apps, across HealthTech, FinTech, EdTech, PropTech, and AI — I design experiences that don't just look good, they work.";

  const words = paragraphText.split(" ");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.4"],
  });

  return (
    <section 
      id="about" 
      className="relative w-full bg-[#F7F7F5] text-black pt-24 pb-24 sm:pt-28 sm:pb-28 md:pt-32 md:pb-32 px-6 sm:px-12 md:px-16 lg:px-24 overflow-hidden border-t border-zinc-200/60" 
      suppressHydrationWarning
    >
      {/* Decorative Outer Margin Doodles (Desktop Only) */}
      <PencilDoodle className="absolute top-16 left-6 lg:left-12 xl:left-20 w-12 h-12 lg:w-14 lg:h-14 text-zinc-400/80 -rotate-12 hidden lg:block pointer-events-none select-none transition-transform duration-500 hover:scale-105" />
      <SparklesDoodle className="absolute top-24 right-6 lg:right-12 xl:right-20 w-12 h-12 lg:w-14 lg:h-14 text-zinc-400/80 rotate-12 hidden lg:block pointer-events-none select-none transition-transform duration-500 hover:scale-105" />

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center" suppressHydrationWarning>
        {/* Section Tag / Header */}
        <div className="flex items-center select-none mb-3" suppressHydrationWarning>
          <span className="font-[family-name:var(--font-handwriting)] text-xl sm:text-2xl font-bold tracking-wide text-zinc-500">
            About Me
          </span>
        </div>

        {/* Part 1: Scroll-Highlighted Paragraph */}
        <div ref={containerRef} className="max-w-5xl mb-8 sm:mb-10 md:mb-12" suppressHydrationWarning>
          {mounted ? (
            <p className="font-[family-name:var(--font-sans)] font-semibold text-[18px] sm:text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.3] text-zinc-950">
              {words.map((word, i) => {
                const start = i / words.length;
                const end = start + 1 / words.length;
                return (
                  <Word key={i} progress={scrollYProgress} range={[start, end]}>
                    {word}
                  </Word>
                );
              })}
            </p>
          ) : (
            <p className="font-[family-name:var(--font-sans)] font-semibold text-[18px] sm:text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.3] text-zinc-300">
              {paragraphText}
            </p>
          )}
        </div>

        {/* Part 2: Interactive CurvedLoop Stats Strip (Text Only) */}
        <div className="w-full relative select-none overflow-hidden" suppressHydrationWarning>
          {/* Left & Right subtle edge fade gradients */}
          <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-[#F7F7F5] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-[#F7F7F5] to-transparent z-10 pointer-events-none" />

          {mounted && (
            <CurvedLoop
              marqueeText="4+ Years Experience ✦ 5 Industries ✦ Multi-Module SaaS Products ✦ 4+ Companies Worked With ✦"
              speed={1.5}
              curveAmount={40}
              direction="left"
              interactive={true}
            />
          )}
        </div>
      </div>
    </section>
  );
}
