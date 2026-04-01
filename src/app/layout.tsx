import type { Metadata } from "next";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { siteUrl, authors } from "@/lib/info";
import { LinkForm } from "@/components/link-form";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ResearchVault",
    template: "%s | ResearchVault",
  },
  description:
    "Save, organise, and manage research links with notes, categories, and tags.",
  keywords: [
    "ResearchVault",
    "research management",
    "link organiser",
    "research links",
    "academic productivity",
    "student research",
    "knowledge management",
  ],
  authors,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ResearchVault",
    description:
      "Save, organise, and manage research links with notes, categories, and tags.",
    url: siteUrl,
    siteName: "ResearchVault",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ResearchVault OG Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ResearchVault",
    description:
      "Save, organise, and manage research links with notes, categories, and tags.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background text-foreground relative h-full font-sans antialiased",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <main className="relative flex min-h-screen flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div className="mx-auto w-full max-w-screen-2xl flex-1 px-4 md:px-8 lg:px-20">
              <div className="grid min-h-dvh gap-12 lg:grid-cols-12 lg:gap-6">
                <div className="lg:col-span-5">
                  <div className="flex flex-col justify-center gap-6 pt-24 lg:sticky lg:top-0 lg:h-dvh lg:pb-24">
                    <Image
                      width={860.27}
                      height={160}
                      src="/logo.svg"
                      loading="eager"
                      alt="ResearchVault logo"
                      className="pointer-events-none w-60 select-none"
                    />
                    <LinkForm />
                  </div>
                </div>
                <div className="lg:col-span-7">{children}</div>
              </div>
            </div>
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
