import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kitty-h-portfolio.vercel.app"),
  title: "Xuan He (Kitty) — AI, Creator Ecosystems & Global Communities",
  description: "Xuan He is a connector across AI startups, creator ecosystems and global communities — working across strategy, partnerships and growth.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Xuan He (Kitty) — Quiet Strength, Patient Bloom",
    description: "A connector across AI startups, creator ecosystems and global communities.",
    images: [{ url: "/og.png", width: 1792, height: 941, alt: "Xuan He interactive portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Xuan He (Kitty) — Quiet Strength, Patient Bloom",
    description: "A connector across AI startups, creator ecosystems and global communities.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
