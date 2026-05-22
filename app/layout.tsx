import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Space_Grotesk, JetBrains_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: ["400"],
});

const siteUrl =
  process.env.VERCEL_ENV === "preview"
    ? `https://${process.env.VERCEL_BRANCH_URL}`
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://vmd306.com";

const title = "Vincent Do // Software Engineer";
const description =
  "Software Engineer at Boeing. UIUC CS & Chemistry alum. Building real-time systems, full-stack apps, and ML projects.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "./",
    siteName: "Vincent Do",
    // og:image is auto-generated from app/opengraph-image.tsx
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth shadcn dark">
      {/* Prefetch globe assets as idle background tasks */}
      <head>
        <link rel="prefetch" as="script" href="https://unpkg.com/globe.gl@2.46.1/dist/globe.gl.min.js" />
        <link rel="prefetch" as="image"  href="/projects/earth-night.jpg" />
      </head>
      <body
        className={`font-body antialiased ${spaceGrotesk.variable} ${jetBrainsMono.variable} ${bebasNeue.variable}`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
