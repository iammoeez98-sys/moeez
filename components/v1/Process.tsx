"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { TextType } from "./TextType";
import { BezierDoodle, ArrowDoodle } from "./Doodles";

interface ProcessCardData {
  number: string;
  titleLine1: string;
  titleLine2: string;
  imageSrc: string;
  gradientClass: string;
  imageScaleClass: string;
}

const cardsData: ProcessCardData[] = [
  {
    number: "01",
    titleLine1: "Discover",
    titleLine2: "& Research",
    imageSrc: "/images/process/3.webp", // thinking, hand on chin
    gradientClass: "from-sky-100 via-teal-50 to-emerald-100",
    imageScaleClass: "scale-[1.28] sm:scale-[1.12] origin-top group-hover:scale-[1.30] sm:group-hover:scale-[1.16]",
  },
  {
    number: "02",
    titleLine1: "Design",
    titleLine2: "& Systems",
    imageSrc: "/images/process/2.webp", // sketching with pencil & notebook
    gradientClass: "from-amber-100 via-rose-100 to-pink-100",
    imageScaleClass: "scale-[1.02] sm:scale-[0.96] origin-top translate-y-1 group-hover:scale-[1.06] sm:group-hover:scale-[1.00]",
  },
  {
    number: "03",
    titleLine1: "Prototype",
    titleLine2: "& Iterate",
    imageSrc: "/images/process/1.webp", // holding tablet/phone looking down
    gradientClass: "from-violet-100 via-purple-100 to-indigo-100",
    imageScaleClass: "scale-[1.18] sm:scale-[1.12] origin-top group-hover:scale-[1.22] sm:group-hover:scale-[1.16]",
  },
  {
    number: "04",
    titleLine1: "Deliver",
    titleLine2: "& Handoff",
    imageSrc: "/images/process/4.webp", // presenting box with both hands
    gradientClass: "from-emerald-100 via-green-100 to-lime-100",
    imageScaleClass: "scale-[1.18] sm:scale-[1.12] origin-top group-hover:scale-[1.22] sm:group-hover:scale-[1.16]",
  },
];

export function Process() {
  return (
    <section
      id="process"
      className="relative w-full bg-white text-black pt-16 pb-16 sm:pt-28 sm:pb-28 md:pt-32 md:pb-32 border-t border-zinc-100 select-none overflow-hidden"
      suppressHydrationWarning
    >
      {/* Decorative Outer Margin Doodles (Desktop Only) */}
      <BezierDoodle className="absolute top-16 left-6 lg:left-12 xl:left-20 w-12 h-12 lg:w-14 lg:h-14 text-zinc-400/80 rotate-6 hidden lg:block pointer-events-none select-none transition-transform duration-500 hover:scale-105" />
      <ArrowDoodle className="absolute top-24 right-6 lg:right-12 xl:right-20 w-12 h-12 lg:w-14 lg:h-14 text-zinc-400/80 -rotate-12 hidden lg:block pointer-events-none select-none transition-transform duration-500 hover:scale-105" />

      <div className="max-w-6xl mx-auto px-6 sm:px-12 md:px-16 lg:px-24 flex flex-col" suppressHydrationWarning>
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-1.5 sm:gap-2 mb-8 sm:mb-16 md:mb-20" suppressHydrationWarning>
          <div className="flex items-center">
            <span className="font-[family-name:var(--font-handwriting)] text-[16px] sm:text-2xl font-bold tracking-wide text-zinc-500">
              How I Work
            </span>
          </div>
          <TextType
            text={["From idea to interface"]}
            as="h2"
            typingSpeed={25}
            loop={false}
            showCursor={true}
            hideCursorWhileTyping={false}
            startOnVisible={true}
            cursorCharacter="|"
            className="font-[family-name:var(--font-display)] font-extrabold text-[24px] sm:text-[34px] md:text-[46px] lg:text-[56px] text-zinc-950 tracking-tight leading-snug sm:leading-none"
          />
        </div>

        {/* 2x2 Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 w-full">
          {cardsData.map((card, index) => (
            <motion.div
              key={card.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
              whileHover={{ y: -6 }}
              className="group bg-white rounded-[20px] border border-[#EEEEEE] shadow-xs hover:shadow-xl transition-shadow duration-300 ease-out flex flex-col p-3.5 sm:p-4 overflow-hidden cursor-default"
            >
              {/* Top Visual Image Area with Gradient Background & Multiply Blend Mode */}
              <div
                className={`w-full h-[260px] sm:h-[280px] md:h-[300px] lg:h-[320px] rounded-[14px] bg-gradient-to-br ${card.gradientClass} relative overflow-hidden flex items-start justify-center pt-2 border border-zinc-200/50`}
              >
                {/* Subtle radial dot grid overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.05] pointer-events-none z-0" />

                <Image
                  src={card.imageSrc}
                  alt={`${card.titleLine1} ${card.titleLine2}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                  unoptimized
                  className={`object-cover object-top mix-blend-multiply transition-transform duration-500 z-10 ${card.imageScaleClass}`}
                />
              </div>

              {/* Bottom Card Content: Number + 2-line Title */}
              <div className="flex flex-col pt-4 sm:pt-5 pb-2.5 sm:pb-3 px-3 sm:px-4">
                <span className="font-mono text-[14px] font-medium text-zinc-400 mb-1 tracking-wider">
                  {card.number}
                </span>
                <h3 className="font-[family-name:var(--font-display)] font-extrabold text-[22px] sm:text-3xl lg:text-[32px] text-zinc-950 tracking-tight leading-[1.15]">
                  <div>{card.titleLine1}</div>
                  <div>{card.titleLine2}</div>
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Process;
