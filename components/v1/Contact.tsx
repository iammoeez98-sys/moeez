"use client";

import React, { useState, useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { TextType } from "./TextType";

interface SocialLink {
  name: string;
  href: string;
}

const socialLinks: SocialLink[] = [
  { name: "Instagram", href: "https://www.instagram.com/moeezdesigns/" },
  { name: "Behance", href: "https://www.behance.net/moiztahir36" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/moiz-tahir-44266128a/" },
  { name: "Arc.dev", href: "https://arc.dev/@moiztahir" },
];

export function Contact() {
  const [mounted, setMounted] = useState(false);
  const [peekState, setPeekState] = useState<"hidden" | "peeking">("hidden");
  const footerRef = useRef<HTMLElement>(null);
  const hasPeekedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const footerElem = footerRef.current;
    if (!footerElem) return;

    let isCancelled = false;

    const startPeekLoop = async () => {
      // Initial 1s delay when section scrolls into view
      await new Promise((res) => setTimeout(res, 1000));

      while (!isCancelled) {
        // Slide in / Peek
        setPeekState("peeking");
        await new Promise((res) => setTimeout(res, 3800)); // Stay visible for 3.8s

        if (isCancelled) return;

        // Slide back out / Hide
        setPeekState("hidden");
        await new Promise((res) => setTimeout(res, 2000)); // Wait 2s hidden before repeating
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPeekedRef.current) {
          hasPeekedRef.current = true;
          startPeekLoop();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(footerElem);
    return () => {
      isCancelled = true;
      observer.disconnect();
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="relative w-full bg-[#0F0F0F] text-white pt-[136px] pb-[88px] sm:pt-[184px] sm:pb-[120px] md:pt-[200px] md:pb-[136px] select-none overflow-hidden"
      suppressHydrationWarning
    >
      {/* Scroll-Triggered Peeking Character (Left Edge) */}
      {mounted && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: peekState === "peeking" ? "0%" : "-100%" }}
          transition={{ duration: 0.75, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="absolute left-0 top-[18%] sm:top-[20%] z-10 hidden sm:block pointer-events-none select-none"
        >
          <img
            src="/images/peek-character.png"
            alt="Peeking Character"
            className="w-36 sm:w-44 md:w-52 lg:w-60 h-auto object-contain drop-shadow-2xl"
          />
        </motion.div>
      )}
      <div className="max-w-5xl mx-auto px-6 sm:px-12 md:px-16 flex flex-col items-center text-center" suppressHydrationWarning>
        {/* Monospace Section Tag */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center mb-4 sm:mb-6"
        >
          <span className="font-[family-name:var(--font-handwriting)] text-xl sm:text-2xl font-bold tracking-wide text-zinc-400">
            Get in Touch
          </span>
        </motion.div>

        {/* Large Bold Display Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full flex justify-center"
        >
          <TextType
            text={["Let's build something beautiful together."]}
            as="h2"
            typingSpeed={25}
            deletingSpeed={18}
            pauseDuration={2500}
            loop={true}
            showCursor={true}
            hideCursorWhileTyping={false}
            startOnVisible={true}
            cursorCharacter="|"
            className="font-[family-name:var(--font-display)] font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[84px] text-white tracking-tight leading-[1.05] max-w-4xl mb-8 sm:mb-12 min-h-[2.1em]"
          />
        </motion.div>

        {/* Prominent Clickable Email Link with Left-to-Right Underline Hover Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4 sm:mb-6"
        >
          <a
            href="mailto:iammoeez@gmail.com"
            className="group relative inline-flex items-center gap-2 font-mono text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight transition-colors duration-300 hover:text-zinc-200"
          >
            <TextType
              text={["iammoeez@gmail.com"]}
              as="span"
              typingSpeed={35}
              loop={false}
              showCursor={true}
              hideCursorWhileTyping={true}
              startOnVisible={true}
              cursorCharacter="|"
              initialDelay={400}
            />
            <ArrowUpRight className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            <span className="absolute bottom-0 left-0 w-full h-[2px] sm:h-[3px] bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
          </a>
        </motion.div>

        {/* Secondary Phone Number Link */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-12 sm:mb-16 md:mb-20"
        >
          <a
            href="tel:+923044247985"
            className="font-mono text-sm sm:text-base md:text-lg font-semibold text-[#A3A3A3] hover:text-white transition-colors tracking-widest"
          >
            +92 304 4247985
          </a>
        </motion.div>

        {/* Social Links Row with Dash Dividers */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-8 pt-8 border-t border-zinc-800/80 w-full"
        >
          {socialLinks.map((social, idx) => (
            <React.Fragment key={social.name}>
              {idx > 0 && (
                <span className="text-zinc-600 font-mono text-xs select-none">•</span>
              )}
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold tracking-widest text-[#A3A3A3] hover:text-white uppercase transition-colors"
              >
                <span>{social.name}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </React.Fragment>
          ))}
        </motion.div>

        {/* Copyright Footer */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="font-mono text-[11px] font-medium text-zinc-500 tracking-wider uppercase">
            © {new Date().getFullYear()} Moiz Tahir. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Contact;
