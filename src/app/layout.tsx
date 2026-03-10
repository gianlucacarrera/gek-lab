import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GekLab - Blood Analysis Dashboard",
  description: "Interactive blood analysis dashboard with biomarker tracking and nutritional recommendations",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
