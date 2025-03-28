import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import NextAuthSessionProvider from "./providers/SessionProvider";
import FontProvider from "./providers/font-provider";

// Create a public/paper-texture.png with subtle paper texture.

export const metadata: Metadata = {
  title: "Personal Journal",
  description: "Personal journaling app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <FontProvider>
          <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
          <Toaster />
        </FontProvider>
      </body>
    </html>
  );
}
