import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marcelo Store",
  description: "Tienda de ropa — catálogo online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
