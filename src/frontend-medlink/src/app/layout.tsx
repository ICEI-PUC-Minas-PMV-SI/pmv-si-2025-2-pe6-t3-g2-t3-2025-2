import type { Metadata } from "next";
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./services/providers";
import { AuthProvider } from "./contexts/auth-context";

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
    <html lang="pt-BR" className={`${inter.className} antialiased`}>
      <body>
        <Providers>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
