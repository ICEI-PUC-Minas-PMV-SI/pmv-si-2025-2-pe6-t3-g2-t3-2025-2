import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastViewport } from "./components/ui/toast";
import { AuthProvider } from "./contexts/auth-context";
import { Providers } from "./services/providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "Medlink",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.className} antialiased`}>
      <body>
        <Providers>
          <AuthProvider>
            {children}
            <ToastViewport />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
