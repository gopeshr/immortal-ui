import type { Metadata } from "next";
import { Cormorant_Garamond, Josefin_Sans } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["100", "300", "400"],
  variable: "--font-josefin",
});

export const metadata: Metadata = {
  title: "Immortal — Live Forever in Memory",
  description:
    "Preserve the full texture of who you are — your stories, your face, your sleep, your spirit — so the people you love can hold onto you, always.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${josefin.variable} font-sans`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
