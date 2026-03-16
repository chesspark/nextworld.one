import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "NEXTWORLD — The Future Is Now",
  description:
    "A global think-tank summit. 1000 leaders, 200 countries, 10 days. Discover the next frontier.",
  keywords: ["nextworld", "think-tank", "summit", "global", "leaders"],
  openGraph: {
    title: "NEXTWORLD — The Future Is Now",
    description: "A global think-tank summit. 1000 leaders, 200 countries, 10 days.",
    url: "https://nextworld.one",
    siteName: "NEXTWORLD",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
