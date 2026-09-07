"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Project {
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

const projects: Project[] = [
  {
    title: "PEAK",
    subtitle: "Protein Drink Branding & Web Design",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/e9ced5254021817.Y3JvcCwxNDQ3LDExMzIsNDIsMA.png",
    href: "https://www.behance.net/gallery/254021817/PEAK-Protein-Drink-Branding-Web-Design",
  },
  {
    title: "Aria AI",
    subtitle: "Mobile App UI/UX Case Study",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/28a74b253987195.Y3JvcCwxNDQwLDExMjYsMCww.png",
    href: "https://www.behance.net/gallery/253987195/Aria-AI-Mobile-App-UIUX-Case-Study",
  },
  {
    title: "VALENCE",
    subtitle: "Streetwear & Garment Construction UI",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/d23f2b253305503.Y3JvcCwzOTM4LDMwODAsMTc1LDM4.png",
    href: "https://www.behance.net/gallery/253305503/VALENCE-Streetwear-Garment-Construction-UI",
  },
  {
    title: "Portfolio Dashboard",
    subtitle: "UI/UX Design",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/023c2d250360135.Y3JvcCw0NTY4LDM1NzIsMCw0NQ.png",
    href: "https://www.behance.net/gallery/250360135/Portfolio-Dashboard-UI-UX-Design",
  },
  {
    title: "Faucet",
    subtitle: "Crypto Trading App UI/UX Design",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/876ac4228706511.Y3JvcCwzMTc4LDI0ODYsMTU3LDA.png",
    href: "https://www.behance.net/gallery/228706511/Faucet-Crypto-Trading-App-UIUX-Design",
  },
  {
    title: "ZIJ",
    subtitle: "Image to Video Generation App UI/UX",
    image: "https://mir-s3-cdn-cf.behance.net/projects/404/c84428227222937.Y3JvcCwxNzQyLDEzNjMsMCww.png",
    href: "https://www.behance.net/gallery/227222937/ZIJ-Image-to-Video-Generation-App-UIUX",
  },
];

// Continuous wrapped circular offset calculation (-N/2 to N/2)
const getWrappedOffset = (idx: number, activeProgress: number, total: number) => {
  let normalizedActive = activeProgress % total;
  if (normalizedActive < 0) normalizedActive += total;

  let diff = idx - normalizedActive;
  while (diff > total / 2) diff -= total;
  while (diff <= -total / 2) diff += total;
  return diff;
};

export function Work() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);

  // Continuous progress float value driving 3D rotation seamlessly across loops
  const [progressVal, setProgressVal] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Drag Gesture States for Mouse & Touch
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDeltaX, setDragDeltaX] = useState(0);

  const numProjects = projects.length;

  // Normalized active integer index for counter and active project details (0..5)
  const normalizedIndex = ((Math.round(progressVal) % numProjects) + numProjects) % numProjects;

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // GSAP ScrollTrigger Pinned 3D Arc Controller (Slow, Smooth, Deliberate Scroll Runway)
  useEffect(() => {
    if (!mounted || isMobile || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      stRef.current = ScrollTrigger.create({
        trigger: sectionRef.current,
        pin: true,
        anticipatePin: 1,
        scrub: 1.2, // Heavy smooth scrub
        start: "top top",
        end: () => `+=${numProjects * 180}vh`, // 180vh per project for slow controlled scrolling
        onUpdate: (self) => {
          // Map scroll progress 0..1 to continuous progressVal
          const targetProgress = self.progress * (numProjects - 1);
          setProgressVal(targetProgress);
        },
      });

      ScrollTrigger.refresh();
      const timer = setTimeout(() => ScrollTrigger.refresh(), 300);
      return () => clearTimeout(timer);
    }, sectionRef);

    return () => ctx.revert();
  }, [mounted, isMobile, numProjects]);

  // Continuous, seamless loop handlers (ZIJ -> PEAK slides forward without scroll jump)
  const handlePrev = () => {
    setProgressVal((prev) => prev - 1);
  };

  const handleNext = () => {
    setProgressVal((prev) => prev + 1);
  };

  // Drag Event Handlers (Natural direction: drag left moves cards left)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragDeltaX(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - dragStartX;
    setDragDeltaX(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragDeltaX < -40) {
      handleNext();
    } else if (dragDeltaX > 40) {
      handlePrev();
    }
    setDragDeltaX(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    setDragDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientX - dragStartX;
    setDragDeltaX(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragDeltaX < -40) {
      handleNext();
    } else if (dragDeltaX > 40) {
      handlePrev();
    }
    setDragDeltaX(0);
  };

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative w-full bg-white text-black overflow-hidden border-t border-zinc-100 select-none"
      suppressHydrationWarning
    >
      {/* DESKTOP & TABLET: Pinned 3D Arc Scroll Carousel View */}
      {!isMobile ? (
        <div className="relative w-full h-screen flex flex-col justify-center items-center py-8 sm:py-10 px-6 sm:px-12 md:px-16 lg:px-24 overflow-hidden">
          {/* Section Header with Project Counter */}
          <div className="relative max-w-7xl w-full mx-auto flex items-center justify-center z-30 shrink-0 mb-4 sm:mb-6 md:mb-8">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="flex items-center">
                <span className="font-[family-name:var(--font-handwriting)] text-xl sm:text-2xl font-bold tracking-wide text-zinc-500">
                  Selected Work
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-display)] font-extrabold text-xl sm:text-[34px] md:text-[46px] lg:text-[56px] text-zinc-950 tracking-tight leading-none">
                Explore the work
              </h2>
            </div>

            {/* Monospace Project Counter */}
            <div className="absolute right-0 bottom-0 flex items-center gap-1.5 font-mono text-sm sm:text-base font-bold tracking-widest text-zinc-400">
              <span className="text-zinc-950 text-base sm:text-lg">
                {String(normalizedIndex + 1).padStart(2, "0")}
              </span>
              <span className="text-zinc-300">/</span>
              <span>{String(numProjects).padStart(2, "0")}</span>
            </div>
          </div>

          {/* Interactive 3D Perspective Arc Stage with Drag & Continuous Loop */}
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`relative w-full flex items-center justify-center my-2 py-2 ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
          >
            {/* Left & Right Seamless White Edge Fade Gradients (Eliminates vertical edge line artifacts) */}
            <div className="absolute -top-4 -bottom-4 -left-6 sm:-left-12 md:-left-16 lg:-left-24 w-36 sm:w-52 md:w-72 lg:w-96 xl:w-[440px] bg-gradient-to-r from-white via-white/95 to-transparent z-25 pointer-events-none" />
            <div className="absolute -top-4 -bottom-4 -right-6 sm:-right-12 md:-right-16 lg:-right-24 w-36 sm:w-52 md:w-72 lg:w-96 xl:w-[440px] bg-gradient-to-l from-white via-white/95 to-transparent z-25 pointer-events-none" />

            <div
              className="relative w-[270px] sm:w-[310px] md:w-[330px] lg:w-[350px] xl:w-[370px] h-[320px] sm:h-[350px] md:h-[370px] lg:h-[390px] xl:h-[410px] flex items-center justify-center"
              style={{ transformStyle: "preserve-3d" }}
            >
              {projects.map((project, idx) => {
                // Continuous wrapped circular offset calculation (-N/2 to N/2)
                const baseOffset = getWrappedOffset(idx, progressVal, numProjects);
                const isVisible = Math.abs(baseOffset) <= 1.75;

                if (!isVisible) return null;

                const isActive = Math.abs(baseOffset) < 0.5;

                // Natural Drag Direction: dragging left (dragDeltaX < 0) shifts cards left (+)
                const dragFactor = isDragging ? dragDeltaX / 320 : 0;
                const effectiveOffset = baseOffset + dragFactor;

                const translateX = effectiveOffset * 320; // horizontal separation
                const translateZ = -Math.abs(effectiveOffset) * 120; // depth offset
                const rotateY = effectiveOffset * -25; // 3D rotation angle
                const scale = Math.max(0.75, 1 - Math.abs(effectiveOffset) * 0.1);
                
                // Continuous smooth opacity falloff dissolving into white edge gradient (fades to 0 at absOffset >= 1.6)
                const absOffset = Math.abs(effectiveOffset);
                const opacity = absOffset < 0.5
                  ? 1
                  : absOffset <= 1.1
                  ? 0.55
                  : Math.max(0, 0.55 * (1 - (absOffset - 1.1) / 0.5));

                const zIndex = 50 - Math.round(absOffset * 10);

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (Math.abs(dragDeltaX) < 10) setProgressVal(idx);
                    }}
                    style={{
                      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                      opacity,
                      zIndex,
                      backfaceVisibility: "hidden",
                      willChange: "transform, opacity",
                      transformStyle: "preserve-3d",
                    }}
                    className={`absolute inset-0 rounded-2xl bg-zinc-900 border border-zinc-200/80 shadow-2xl transition-all duration-300 ease-out overflow-hidden ${
                      isActive ? "ring-2 ring-zinc-950/15 pointer-events-auto" : "pointer-events-auto"
                    }`}
                  >
                    {/* Full Card Image Background */}
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="500px"
                      unoptimized
                      priority={idx <= 2}
                      className="object-cover object-center transition-transform duration-700 ease-out"
                    />

                    {/* Active Card ONLY: Single layer dark gradient overlay & Text */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-5 sm:p-6 md:p-7 z-20 rounded-2xl">
                        <motion.div
                          key={project.title}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          className="flex flex-col items-start gap-1.5 sm:gap-2"
                        >
                          <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-widest text-zinc-300 uppercase">
                            {project.subtitle}
                          </span>
                          <h3 className="font-sans font-extrabold text-lg sm:text-2xl lg:text-3xl text-white tracking-tight leading-snug">
                            {project.title}
                          </h3>

                          <a
                            href={project.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="mt-2 sm:mt-3 inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white text-zinc-950 font-mono text-xs font-bold tracking-wider uppercase hover:bg-zinc-100 transition-colors shadow-lg active:scale-95 cursor-pointer"
                          >
                            <span>View Case</span>
                            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-950" />
                          </a>
                        </motion.div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Arrow Navigation Buttons */}
          <div className="max-w-7xl w-full mx-auto flex items-center justify-center gap-4 z-30 shrink-0 mt-4 sm:mt-6">
            <button
              onClick={handlePrev}
              aria-label="Previous project"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-zinc-950 text-white hover:bg-zinc-800 flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next project"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-zinc-950 text-white hover:bg-zinc-800 flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </div>
        </div>
      ) : (
        /* MOBILE: Clean Touch Swipeable Horizontal Scroll-Snap View */
        <div className="w-full pt-20 pb-20 px-6 sm:px-12 flex flex-col gap-8">
          {/* Mobile Header with Counter */}
          <div className="flex flex-col items-center text-center gap-3">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center">
                <span className="font-[family-name:var(--font-handwriting)] text-xl font-bold tracking-wide text-zinc-500">
                  Selected Work
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-display)] font-extrabold text-[26px] text-zinc-950 tracking-tight leading-none">
                Explore the work
              </h2>
            </div>

            <div className="font-mono text-xs font-bold tracking-widest text-zinc-400">
              <span className="text-zinc-950">{String(normalizedIndex + 1).padStart(2, "0")}</span>
              <span>/</span>
              <span>{String(numProjects).padStart(2, "0")}</span>
            </div>
          </div>

          {/* Mobile Scroll-Snap Container */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-4 -mx-6 px-6 scrollbar-none">
            {projects.map((project, idx) => (
              <div
                key={idx}
                className="snap-center shrink-0 w-[290px] sm:w-[320px] rounded-2xl bg-zinc-900 border border-zinc-200/90 shadow-md overflow-hidden relative aspect-[3/4] flex flex-col justify-end p-6"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="320px"
                  unoptimized
                  className="object-cover object-center"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10" />
                <div className="relative z-20 flex flex-col items-start gap-2">
                  <span className="font-mono text-[10px] font-semibold tracking-widest text-zinc-300 uppercase">
                    {project.subtitle}
                  </span>
                  <h3 className="font-sans font-bold text-xl text-white tracking-tight leading-snug">
                    {project.title}
                  </h3>
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-zinc-950 font-mono text-xs font-bold tracking-wider uppercase shadow-md"
                  >
                    <span>View Case</span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-950" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Navigation Arrows */}
          <div className="flex items-center justify-center gap-3 pt-6 sm:pt-8">
            <button
              onClick={handlePrev}
              className="w-11 h-11 rounded-full bg-zinc-950 text-white flex items-center justify-center shadow-md active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-11 h-11 rounded-full bg-zinc-950 text-white flex items-center justify-center shadow-md active:scale-95"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
