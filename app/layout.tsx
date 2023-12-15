import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Particles from "../components/particles";
import { Hotkeys } from "../util/hotkeys";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tommy Portfolio",
  description: "Digital Portfolio of Tommy De Leon",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <Particles
          className="absolute inset-0 -z-10 animate-fade-in"
          quantity={1000}
        ></Particles>
        <Hotkeys></Hotkeys>
        {children}
      </body>
    </html>
  );
}
