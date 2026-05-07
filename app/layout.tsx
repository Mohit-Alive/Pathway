import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PathwayAI - Personalized Learning Roadmap",
  description: "AI-Powered Personalized Learning Pathway Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="h-full font-sans antialiased">{children}</body>
    </html>
  );
}
