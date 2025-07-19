import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NotasApp - Suas notas em qualquer lugar",
  description: "Aplicativo de notas com sincronização em nuvem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous" 
        />
      </head>
      <body className={inter.className}>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
