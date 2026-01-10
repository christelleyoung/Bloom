import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bloombiatch",
  description: "Savage motivation for people doing hard things.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-neutral-100">
        {children}
      </body>
    </html>
  );
}
