import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PrelineScript from "@/client/common/utils/PrelineScript";
import { ThemeProvider } from "@/client/features/theme/ThemeProvider";
import { SettingsProvider } from "@/client/features/settings/SettingsProvider";
import DockNavigation from "@/client/features/dock-navigation/DockNavigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beleg Buddy",
  description: "A invoice management system for small businesses",
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
