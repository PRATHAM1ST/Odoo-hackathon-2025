import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skill Swap Platform - Learn and Share Skills",
  description: "Connect with talented individuals to exchange skills and knowledge. Join our community of learners and teachers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}