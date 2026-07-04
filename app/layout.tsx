import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { ConditionalLayout } from "@/components/layout/conditional-layout";
import { AuthProviders } from "@/components/auth/auth-providers";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MAYA",
  description: "Discover the finest Indo-Latin fusion wear. Handcrafted excellence that celebrates tradition while embracing contemporary design.",
  keywords: ["ethnic wear", "indian fashion", "sarees", "kurtas", "handcrafted", "luxury fashion", "MAYA"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProviders>
          <ConditionalLayout>{children}</ConditionalLayout>
        </AuthProviders>
      </body>
    </html>
  );
}
