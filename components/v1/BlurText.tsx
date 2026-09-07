"use client";

import { useRef, useEffect, useState } from "react";
import { motion, Easing } from "framer-motion";

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, any>;
  animationTo?: Array<Record<string, any>>;
  easing?: Easing;
  stepDuration?: number;
  onAnimationComplete?: () => void;
}

export default function BlurText({
  text = "",
  delay = 100,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing = "easeOut",
  stepDuration = 0.4,
  onAnimationComplete,
}: BlurTextProps) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultFrom =
    direction === "top"
      ? { filter: "blur(10px)", opacity: 0, y: -20 }
      : { filter: "blur(10px)", opacity: 0, y: 20 };

  const defaultTo = [
    {
      filter: "blur(0px)",
      opacity: 1,
      y: 0,
    },
  ];

  const from = animationFrom || defaultFrom;
  const to = animationTo || defaultTo;

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} suppressHydrationWarning>
      {elements.map((element, i) => (
        <motion.span
          key={i}
          initial={from}
          animate={inView ? to[0] : from}
          transition={{
            duration: stepDuration,
            delay: (i * delay) / 1000,
            ease: easing,
          }}
          onAnimationComplete={
            i === elements.length - 1 ? onAnimationComplete : undefined
          }
          className="inline-block whitespace-pre"
          suppressHydrationWarning
        >
          {element}
          {animateBy === "words" && i < elements.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </div>
  );
}
