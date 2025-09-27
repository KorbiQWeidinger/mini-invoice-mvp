import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PrelineScript from "@/components/PrelineScript";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SettingsProvider } from "@/components/SettingsProvider";
import DockNavigation from "@/components/DockNavigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mini-Invoice MVP",
  description:
    "A minimal viable product for invoice management with real-time preview and CRUD operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <SettingsProvider>
            <div className="min-h-screen bg-bg-primary">
              <main className="pb-20">{children}</main>
              <DockNavigation />
            </div>
            <PrelineScript />
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
