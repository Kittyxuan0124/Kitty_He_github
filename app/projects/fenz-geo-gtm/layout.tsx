import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fenz AI — GEO / GTM Web Deck",
  description:
    "An interactive web adaptation of Fenz AI's GEO strategy deck: generative search, brand audit, DSS methodology, platform intelligence and prompt architecture.",
};

export default function FenzDeckLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
