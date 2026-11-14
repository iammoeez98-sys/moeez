"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Work", href: "#work" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Contact", href: "#contact" },
  ];

  if (!mounted) {
    return (
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-transparent py-4 sm:py-6"
        suppressHydrationWarning
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between" suppressHydrationWarning>
          <a
            href="#"
            className="font-mono text-sm sm:text-base font-bold tracking-wider text-black uppercase opacity-0"
            suppressHydrationWarning
          >
            Moiz.
          </a>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-zinc-200/60 shadow-xs py-3 sm:py-4"
          : "bg-transparent py-4 sm:py-6"
      }`}
      suppressHydrationWarning
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between" suppressHydrationWarning>
        {/* Left: Monogram Logo */}
        <a
          href="#"
          className="font-mono text-sm sm:text-base font-bold tracking-wider text-black uppercase hover:opacity-70 transition-opacity"
          suppressHydrationWarning
        >
          Moiz.
        </a>

        {/* Center: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8" suppressHydrationWarning>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs sm:text-sm font-medium text-zinc-700 hover:text-black transition-colors"
              suppressHydrationWarning
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right: CTA Button (Desktop) & Mobile Toggle */}
        <div className="flex items-center gap-4" suppressHydrationWarning>
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center justify-center px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-black border border-black rounded-full bg-transparent hover:bg-black hover:text-white transition-colors duration-200"
            suppressHydrationWarning
          >
            Let's Talk
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden min-w-11 min-h-11 flex items-center justify-center text-zinc-900 hover:text-black focus:outline-none"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            suppressHydrationWarning
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div id="mobile-navigation" className="md:hidden bg-white/95 backdrop-blur-lg border-b border-zinc-200/80 px-6 py-6 transition-all duration-200 shadow-sm" suppressHydrationWarning>
          <nav className="flex flex-col gap-4" suppressHydrationWarning>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-zinc-800 hover:text-black py-3"
                suppressHydrationWarning
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-black border border-black rounded-full hover:bg-black hover:text-white transition-colors"
              suppressHydrationWarning
            >
              Let's Talk
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
