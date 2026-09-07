"use client";

import React from "react";

export const PencilDoodle = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 52L20 50L48 22C50.2 19.8 50.2 16.2 48 14C45.8 11.8 42.2 11.8 40 14L12 42L10 50L12 52Z" />
    <path d="M36 18L44 26" />
    <path d="M12 42L20 50" />
    <path d="M8 56C12 55 14 53 14 53" />
  </svg>
);

export const SparklesDoodle = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M32 8C32 20 20 32 8 32C20 32 32 44 32 56C32 44 44 32 56 32C44 32 32 20 32 8Z" />
    <path d="M48 10C48 14 44 18 40 18C44 18 48 22 48 26C48 22 52 18 56 18C52 18 48 14 48 10Z" />
  </svg>
);

export const BezierDoodle = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 46 C 20 14, 44 14, 54 46" />
    <rect x="6" y="42" width="8" height="8" rx="1" />
    <rect x="50" y="42" width="8" height="8" rx="1" />
    <line x1="10" y1="42" x2="20" y2="18" strokeDasharray="3 3" />
    <circle cx="20" cy="18" r="3" />
    <line x1="54" y1="42" x2="44" y2="18" strokeDasharray="3 3" />
    <circle cx="44" cy="18" r="3" />
  </svg>
);

export const CursorDoodle = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 12L44 32L30 36L40 52L34 55L24 39L16 46V12Z" />
    <path d="M46 14C50 18 50 24 46 28" strokeDasharray="2 2" />
  </svg>
);

export const PaletteDoodle = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M32 10C18 10 8 20 8 34C8 46 18 54 30 54C34 54 36 51 36 48C36 46.5 35 45 35 43.5C35 41 37 39 39.5 39H44C51 39 56 34 56 27C56 17 45 10 32 10Z" />
    <circle cx="20" cy="24" r="3" />
    <circle cx="32" cy="20" r="3" />
    <circle cx="44" cy="24" r="3" />
    <circle cx="22" cy="36" r="3" />
  </svg>
);

export const ArrowDoodle = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 48 C 24 40, 36 16, 50 22" />
    <path d="M42 16L52 22L46 32" />
  </svg>
);

export const WandDoodle = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 52L40 24" strokeWidth="2" />
    <path d="M44 14L44 8" />
    <path d="M50 20L56 20" />
    <path d="M48 10L54 16" />
    <path d="M38 18L34 14" />
  </svg>
);
