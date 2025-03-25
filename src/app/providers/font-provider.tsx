"use client";

import { Cormorant_Garamond } from "next/font/google";
import { ReactNode } from "react";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-serif",
});

export default function FontProvider({ children }: { children: ReactNode }) {
  return <div className={`${serif.variable} font-sans`}>{children}</div>;
}
