import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zona Libre Brunchy",
  description: "Programa de beneficios para miembros locales verificados de Brunchy."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
