import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/components/WalletProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "我的 Aptos 钱包",
  description: "基于 Aptos 的简单网页钱包",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body
        className={`${inter.variable} font-sans antialiased bg-gray-100`}
      >
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
