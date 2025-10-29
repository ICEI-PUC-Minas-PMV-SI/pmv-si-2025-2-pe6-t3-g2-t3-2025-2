import { Inter } from "next/font/google"
import { AuthProvider } from "./contexts/auth-context";
import "./globals.css"
import type { Metadata } from "next";
import { Providers } from "./services/providers";
import { ToastViewport } from "./components/ui/toast";

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
            <ToastViewport />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
