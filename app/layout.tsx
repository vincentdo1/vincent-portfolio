import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const siteUrl =
  process.env.VERCEL_ENV === "preview"
    ? `https://${process.env.VERCEL_BRANCH_URL}`
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://vmd306.com";

const title = "Vincent Do // Software Engineer";
const description =
  "Software engineer focused on backend, AI/ML, and full-stack product engineering. Current Boeing SWE, former Expedia SDE intern, UIUC CS & Chemistry alum.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title,
    description,
    url: "./",
    siteName: "Vincent Do",
    type: "website",
    // og:image is auto-generated from app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <body
        className={`font-body antialiased ${spaceGrotesk.variable} ${jetBrainsMono.variable} ${bebasNeue.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
