// components/FontProvider.tsx
"use client";

import { Fugaz_One, Alumni_Sans } from "next/font/google";
import { ReactNode } from "react";

const fugaz = Fugaz_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-fugaz",
  display: "swap",
});

const alumni = Alumni_Sans({
  subsets: ["latin"],
  variable: "--font-alumni",
  display: "swap",
  // Adjust weights as needed
  weight: ["400", "600", "700"],
});

export default function FontProvider({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${fugaz.variable} ${alumni.variable} font-sans`}
      style={{
        // Fallback fonts in case the variables don't work
        fontFamily: `${fugaz.style.fontFamily}, ${alumni.style.fontFamily}, sans-serif`,
      }}
    >
      {children}
    </div>
  );
}
