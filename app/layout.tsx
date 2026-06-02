import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://karlabh.com"),
  title: "Lekha — Stop chasing clients for documents",
  description:
    "The client OS for chartered accountants. WhatsApp reminders, no-login document uploads, and a clean board that tracks every client from pending to filed.",
  keywords: [
    "chartered accountant software",
    "ITR document collection",
    "CA practice management India",
    "WhatsApp client reminders",
  ],
  openGraph: {
    title: "Lekha — The client OS for chartered accountants",
    description:
      "Collect documents over WhatsApp, track filing status on one board, get paid over UPI. Stop chasing clients.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#FBFAF7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
