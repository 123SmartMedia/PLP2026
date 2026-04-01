import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Play Like a Pro | Baseball & Softball Training in Hauppauge, NY",
    template: "%s | Play Like a Pro",
  },
  description:
    "Professional baseball and softball lessons, clinics, and facility rentals in Hauppauge, NY. Train with experienced coaches and take your game to the next level.",
  keywords: [
    "baseball lessons",
    "softball lessons",
    "hitting instructor",
    "pitching lessons",
    "baseball clinic",
    "batting cage rental",
    "Hauppauge NY",
    "Long Island baseball",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
