import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bloombiatch",
  description: "Savage motivation for people doing hard things."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
