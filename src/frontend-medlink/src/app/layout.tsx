import type { Metadata } from "next";
import { Inter } from "next/font/google"
import "./globals.css"

export const metadata: Metadata = {
  title: "Medlink",
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
