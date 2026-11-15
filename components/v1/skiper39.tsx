"use client";

import { gsap } from "gsap";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


interface CrowdCanvasProps {
  src: string;
  rows?: number;
  cols?: number;
}

const CrowdCanvas = ({ src, rows = 15, cols = 7 }: CrowdCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const config = {
      src,
      rows,
      cols,
    };

    // UTILS
    const randomRange = (min: number, max: number) =>
      min + Math.random() * (max - min);
    const randomIndex = (array: any[]) => randomRange(0, array.length) | 0;
    const removeFromArray = (array: any[], i: number) => array.splice(i, 1)[0];
    const removeItemFromArray = (array: any[], item: any) =>
      removeFromArray(array, array.indexOf(item));
    const removeRandomFromArray = (array: any[]) =>
      removeFromArray(array, randomIndex(array));
    const getRandomFromArray = (array: any[]) => array[randomIndex(array) | 0];

    // Excluded sprite indices
    const excludedSpriteIndices = new Set([
      0, 53, 58, 84, 89, 97,
      88, 60, 12, 63,
      73, 8, 23, 38, 68, 83, 98,
      49, 18, 103,
      77, 62, 17, 47, 92, 101,
      41, 56, 26, 71, 86, 11,
      10, 25, 40, 55, 70, 85, 100,
    ]);

    // TWEEN FACTORIES
    const resetPeep = ({ stage, peep }: { stage: any; peep: any }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const compact = stage.width < 1024;
      const offsetY = compact ? peep.height * (0.35 - 0.55 * Math.random()) : 100 - 250 * gsap.parseEase("power2.in")(Math.random());
      let startY = stage.height - peep.height + offsetY;

      // NO-ENTRY EXCLUSION ZONE CONSTRAINT:
      // Ensure no crowd sprite head enters the horizontal band above stage.height * 0.37
      // 12px buffer accounts for the walking animation bobbing (y: startY - 10)
      const topCeiling = stage.height * (compact ? 0.25 : 0.37);
      const minYAllowed = topCeiling + 12;
      if (startY < minYAllowed) {
        startY = minYAllowed;
      }

      let startX: number;
      let endX: number;

      if (direction === 1) {
        startX = -peep.width;
        endX = stage.width;
        peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width;
        endX = 0;
        peep.scaleX = -1;
      }

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      return {
        startX,
        startY,
        endX,
      };
    };

    const normalWalk = ({ peep, props }: { peep: any; props: any }) => {
      const { startX, startY, endX } = props;
      const xDuration = 10;
      const yDuration = 0.25;

      const tl = gsap.timeline();
      tl.timeScale(randomRange(0.95, 1.05));
      tl.to(
        peep,
        {
          duration: xDuration,
          x: endX,
          ease: "none",
        },
        0,
      );
      tl.to(
        peep,
        {
          duration: yDuration,
          repeat: xDuration / yDuration,
          yoyo: true,
          y: startY - 10,
        },
        0,
      );

      return tl;
    };

    const walks = [normalWalk];

    // TYPES
    type Peep = {
      image: HTMLImageElement;
      rect: number[];
      width: number;
      height: number;
      drawArgs: any[];
      x: number;
      y: number;
      anchorY: number;
      scaleX: number;
      walk: any;
      setRect: (rect: number[]) => void;
      render: (ctx: CanvasRenderingContext2D) => void;
    };

    // FACTORY FUNCTIONS
    const createPeep = ({
      image,
      rect,
    }: {
      image: HTMLImageElement;
      rect: number[];
    }): Peep => {
      const peep: Peep = {
        image,
        rect: [],
        width: 0,
        height: 0,
        drawArgs: [],
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        setRect: (rect: number[]) => {
          peep.rect = rect;
          peep.width = rect[2];
          peep.height = rect[3];
          peep.drawArgs = [peep.image, ...rect, 0, 0, peep.width, peep.height];
        },
        render: (ctx: CanvasRenderingContext2D) => {
          ctx.save();
          ctx.translate(peep.x, peep.y);
          ctx.scale(peep.scaleX, 1);
          ctx.drawImage(
            peep.image,
            peep.rect[0],
            peep.rect[1],
            peep.rect[2],
            peep.rect[3],
            0,
            0,
            peep.width,
            peep.height,
          );
          ctx.restore();
        },
      };

      peep.setRect(rect);
      return peep;
    };

    // MAIN
    const img = document.createElement("img");
    const stage = {
      width: 0,
      height: 0,
    };

    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];

    const createPeeps = () => {
      const { rows, cols } = config;
      const { naturalWidth: width, naturalHeight: height } = img;
      const total = rows * cols;
      const rectWidth = width / rows;
      const rectHeight = height / cols;

      allPeeps.length = 0;
      for (let i = 0; i < total; i++) {
        if (excludedSpriteIndices.has(i)) continue;

        allPeeps.push(
          createPeep({
            image: img,
            rect: [
              (i % rows) * rectWidth,
              ((i / rows) | 0) * rectHeight,
              rectWidth,
              rectHeight,
            ],
          }),
        );
      }
    };

    const populateAvailablePool = () => {
      availablePeeps.length = 0;
      allPeeps.forEach((p) =>
        availablePeeps.push(createPeep({ image: p.image, rect: p.rect }))
      );
      allPeeps
        .slice(0, Math.floor(allPeeps.length * 0.45))
        .forEach((p) =>
          availablePeeps.push(createPeep({ image: p.image, rect: p.rect }))
        );
    };

    const initCrowd = () => {
      const limit = stage.width < 1024 ? Math.max(12, Math.round(stage.width / 22)) : availablePeeps.length;
      while (availablePeeps.length && crowd.length < limit) {
        addPeepToCrowd().walk.progress(Math.random());
      }
    };

    const addPeepToCrowd = () => {
      const peep = removeRandomFromArray(availablePeeps);
      const walk = getRandomFromArray(walks)({
        peep,
        props: resetPeep({
          peep,
          stage,
        }),
      }).eventCallback("onComplete", () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      peep.walk = walk;

      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);

      return peep;
    };

    const removePeepFromCrowd = (peep: Peep) => {
      removeItemFromArray(crowd, peep);
      availablePeeps.push(peep);
    };

    const render = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(Math.min(window.devicePixelRatio || 1, 2), Math.min(window.devicePixelRatio || 1, 2));

      crowd.forEach((peep) => {
        peep.render(ctx);
      });

      ctx.restore();
    };

    const resize = () => {
      if (!canvas || !img.complete || !img.naturalWidth) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      canvas.width = stage.width * dpr;
      canvas.height = stage.height * dpr;

      crowd.forEach((peep) => {
        peep.walk.kill();
      });

      crowd.length = 0;
      populateAvailablePool();
      if (stage.width < 1024) {
        const targetHeight = Math.min(310, Math.max(250, stage.width * 0.72), stage.height * 0.82);
        availablePeeps.forEach((peep) => { peep.width = peep.rect[2] * targetHeight / peep.rect[3]; peep.height = targetHeight; });
      }
      initCrowd();
    };

    const init = () => {
      createPeeps();
      resize();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    };

    img.onload = init;
    img.src = config.src;

    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!isVisible) {
              isVisible = true;
              crowd.forEach((peep) => peep.walk?.resume());
              gsap.ticker.add(render);
            }
          } else {
            if (isVisible) {
              isVisible = false;
              crowd.forEach((peep) => peep.walk?.pause());
              gsap.ticker.remove(render);
            }
          }
        });
      },
      { threshold: 0.05 }
    );

    if (canvas) {
      observer.observe(canvas);
      gsap.ticker.add(render);
    }

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(canvas);

    return () => {
      img.onload = null;
      observer.disconnect();
      resizeObserver.disconnect();
      gsap.ticker.remove(render);
      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });
    };
  }, [src, rows, cols]);

  return (
    <canvas ref={canvasRef} className="absolute bottom-0 h-full w-full" suppressHydrationWarning />
  );
};

interface CrowdMemberLabel {
  key: number;
  name: string;
  x: number;
  y: number;
}

const Skiper39 = () => {
  const [mounted, setMounted] = useState(false);
  const headlineDone = true;
  const [isHovered, setIsHovered] = useState(false);

  // Easter Egg State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [activeLabel, setActiveLabel] = useState<CrowdMemberLabel | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleEasterEggSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = nameInput.trim().slice(0, 20);
    if (!sanitized) return;

    // Pick random crowd position avoiding main character (55%-75%)
    const useLeft = Math.random() < 0.65;
    const x = useLeft
      ? 15 + Math.random() * 30 // 15% to 45%
      : 76 + Math.random() * 12; // 76% to 88%
    const y = 64 + Math.random() * 20; // 64% to 84% height

    if (timerRef.current) clearTimeout(timerRef.current);

    setActiveLabel({
      key: Date.now(),
      name: sanitized,
      x,
      y,
    });

    setIsFormOpen(false);
    setNameInput("");

    // Auto-fade after 5.5 seconds
    timerRef.current = setTimeout(() => {
      setActiveLabel(null);
    }, 5500);
  };

  const scrollToWork = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const workElem = document.getElementById("work");
    if (workElem) {
      workElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="hero-scene relative h-full w-full bg-white text-black min-h-screen overflow-hidden" suppressHydrationWarning>
      {/* Easter Egg Crowd Label Pointer */}
      <AnimatePresence>
        {activeLabel && (
          <motion.div
            key={activeLabel.key}
            initial={{ opacity: 0, scale: 0.75, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.75, y: -10 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            style={{ left: `${activeLabel.x}%`, top: `${activeLabel.y}%` }}
            className="absolute z-30 -translate-x-1/2 -translate-y-full pointer-events-none select-none"
          >
            <div className="relative bg-zinc-950 text-white px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 whitespace-nowrap border border-zinc-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[11px] sm:text-xs font-bold tracking-tight">
                ← {activeLabel.name} is here too
              </span>
            </div>
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-zinc-950 mx-auto -mt-px" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Text Header with BlurText Animation */}
      {(
        <div
          className="hero-copy absolute top-16 sm:top-24 md:top-28 left-6 sm:left-12 md:left-16 lg:left-24 max-w-[calc(100vw-48px)] sm:max-w-[48vw] lg:max-w-[42vw] xl:max-w-[45vw] z-30 pointer-events-none select-none"
          suppressHydrationWarning
        >
          {/* Animated Hero Headline via BlurText */}
          <h1 className="hero-headline-text font-[family-name:var(--font-display)] font-extrabold text-[24px] sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-zinc-950 tracking-tight leading-[1.12] drop-shadow-sm flex flex-col items-start gap-0.5 sm:gap-1">
            <span>One face in every crowd</span>
            <span>that designs the experience.</span>
          </h1>

          {/* Signature / Attribution Line (Line 3) - Smooth fade in after headline reveal */}
          <p
            className={`hero-signature-text mt-2 sm:mt-4 text-[14px] sm:text-sm md:text-base font-medium text-zinc-500 tracking-wide flex items-center gap-2 transition-opacity duration-700 ${
              headlineDone ? "opacity-100" : "opacity-0"
            }`}
          >

            Moiz Tahir, UI/UX Designer
          </p>
        </div>
      )}

      {/* Easter Egg Discovery Trigger / Inline Form in Upper-Right Open White Space */}
      {(
        <div
          className={`hero-invitation absolute top-20 sm:top-24 md:top-28 right-5 sm:right-12 md:right-16 lg:right-24 xl:right-32 z-30 pointer-events-auto select-none transition-opacity duration-700 ${
            headlineDone ? "opacity-100" : "opacity-0"
          }`}
        >
          {!isFormOpen ? (
            <button
              onClick={() => setIsFormOpen(true)}
              className="font-[family-name:var(--font-handwriting)] text-base sm:text-lg md:text-xl font-semibold text-zinc-400 hover:text-zinc-800 transition-colors flex items-center gap-1 group cursor-pointer -rotate-3 hover:-rotate-1 transform origin-right"
            >
              <span className="group-hover:underline decoration-zinc-400 underline-offset-4">
                <span className="hidden lg:inline">psst — think you belong in this crowd? →</span><span className="lg:hidden">Join the crowd <span aria-hidden="true">＋</span></span>
              </span>
            </button>
          ) : (
            <form
              onSubmit={handleEasterEggSubmit}
              className="flex items-center gap-2 bg-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-zinc-200 shadow-md -rotate-1 transform origin-right"
            >
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Your name"
                maxLength={20}
                autoFocus
                className="font-[family-name:var(--font-handwriting)] text-base sm:text-lg font-medium bg-transparent border-b border-zinc-900 text-zinc-950 placeholder:text-zinc-400 focus:outline-none pb-0.5 w-32 sm:w-40"
              />
              <button
                type="submit"
                className="font-mono text-xs font-bold text-zinc-950 hover:text-zinc-600 transition-colors px-1 cursor-pointer"
                title="Submit"
              >
                ↵
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setNameInput("");
                }}
                className="font-mono text-xs text-zinc-400 hover:text-zinc-600 transition-colors ml-0.5 cursor-pointer"
                title="Cancel"
              >
                ✕
              </button>
            </form>
          )}
        </div>
      )}

      {/* Dominant Foreground Character - Standing flush at bottom baseline with Hover to Wave & Tooltip */}
      {(
        <div
          className="hero-character absolute bottom-[-8px] sm:bottom-0 left-1/2 sm:left-[66%] md:left-[68%] lg:left-[65%] -translate-x-1/2 z-20 flex flex-col items-center justify-end pointer-events-auto cursor-pointer select-none group p-2"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          onClick={scrollToWork}
          role="button"
          tabIndex={0}
          aria-label="Explore my work"
          onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); scrollToWork(); } }}
          suppressHydrationWarning
        >
          {/* Animated Speech Bubble Tooltip positioned to the LEFT of the character */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, x: 12 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.85, x: 12 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="hero-tooltip absolute top-4 sm:top-8 right-[98%] mr-2 sm:mr-3 z-30 whitespace-nowrap pointer-events-auto"
                onClick={scrollToWork}
              >
                <div className="relative bg-white text-zinc-950 px-4 sm:px-5 py-2.5 rounded-2xl border-2 border-zinc-900 shadow-2xl flex flex-col items-center text-center">
                  <p className="font-sans font-extrabold text-xs sm:text-sm tracking-tight leading-snug">
                    Hi, I'm Moiz 👋
                  </p>
                  <p className="font-sans font-medium text-[11px] sm:text-xs text-zinc-600 tracking-tight mt-0.5">
                    Wanna see my work? <span className="font-bold text-zinc-950 underline decoration-zinc-400 underline-offset-2">Click here.</span>
                  </p>

                  {/* Downward/Right pointing speech bubble tail pointing towards Moiz */}
                  <div className="absolute top-1/2 -right-[9px] -translate-y-1/2 w-3.5 h-3.5 bg-white border-r-2 border-t-2 border-zinc-900 rotate-45" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Soft Radial Spotlight Glow behind upper body & head */}
          <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-b from-amber-100/70 via-slate-200/50 to-transparent blur-3xl -z-10 pointer-events-none opacity-90" />

          {/* Character Container with 100% Identical Height & Body Proportions */}
          <div className="hero-character-size relative h-[52vh] sm:h-[55vh] md:h-[60vh] lg:h-[62vh] max-h-[520px] w-auto flex items-end justify-center">
            {/* Both poses share the same scale; their source head-to-body proportions match */}
            <img
              src="/images/self-character.webp"
              alt="Self Character Default"
              width={650} height={1200} fetchPriority="high" decoding="async"
              className={`h-full w-auto max-w-none scale-[1.15] origin-bottom object-contain object-bottom drop-shadow-[0_0_16px_rgba(255,255,255,0.95)] drop-shadow-[0_0_30px_rgba(255,255,255,0.6)] drop-shadow-[0_16px_32px_rgba(0,0,0,0.22)] transition-opacity duration-200 ease-in-out ${
                isHovered ? "opacity-0" : "opacity-100"
              }`}
            />

            {/* Waving Pose */}
            <img
              src="/images/waving-character.webp"
              alt="Self Character Waving"
              width={750} height={1200} decoding="async" fetchPriority="low"
              className={`absolute bottom-0 left-1/2 -translate-x-[56%] h-full w-auto max-w-none scale-[1.15] origin-bottom object-contain object-bottom drop-shadow-[0_0_16px_rgba(255,255,255,0.95)] drop-shadow-[0_0_30px_rgba(255,255,255,0.6)] drop-shadow-[0_16px_32px_rgba(0,0,0,0.22)] transition-opacity duration-200 ease-in-out ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>

          {/* Soft flat dark ellipse drop shadow under feet flush with crowd baseline */}
          <div className="hero-ground-shadow absolute bottom-0 left-1/2 -translate-x-1/2 w-40 sm:w-56 md:w-72 h-4 sm:h-6 bg-black/40 rounded-[50%] blur-[6px] -z-10" />
        </div>
      )}

      {/* Subtle Top White Gradient Overlay */}
      <div
        className="absolute top-0 left-0 right-0 h-28 sm:h-36 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none"
        suppressHydrationWarning
      />

      {/* Subtle Bottom White Gradient Transition (between 1st section and 2nd section) */}
      <div
        className="hero-bottom-fade absolute bottom-0 left-0 right-0 pointer-events-none"
        suppressHydrationWarning
      />

      {/* Crowd Canvas at bottom */}
      <div className="hero-crowd absolute bottom-0 h-full w-full z-0 overflow-hidden" suppressHydrationWarning>
        {mounted && <CrowdCanvas src="/images/peeps/all-peeps.png" rows={15} cols={7} />}
      </div>
    </div>
  );
};

export { CrowdCanvas, Skiper39 };
