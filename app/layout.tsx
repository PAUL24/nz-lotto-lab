import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DrawScope — NZ Lotto Statistical Lab",
  description: "Explore NZ Lotto frequency, momentum, return cycles, patterns and transparent modelled sequences.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-NZ">
      <body className="antialiased">{children}</body>
    </html>
  );
}
