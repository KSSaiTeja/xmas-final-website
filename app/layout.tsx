import type { Metadata } from "next";
import { Lobster, Parisienne, Great_Vibes } from "next/font/google";
import "./globals.css";

const lobster = Lobster({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-lobster",
});

const parisienne = Parisienne({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-parisienne",
});

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
});

export const metadata: Metadata = {
  title: "Christmas Landing Page",
  description: "A magical Christmas experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${lobster.variable} ${parisienne.variable} ${greatVibes.variable} font-lobster`}
      >
        {children}
      </body>
    </html>
  );
}
