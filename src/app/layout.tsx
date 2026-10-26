import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "México 26 · Nuestro fin de semana",
  description:
    "Tu guía personal del Gran Premio de México 2026: agenda, accesos, asientos y la emoción de la pista.",
  applicationName: "México 26",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "México 26" },
  icons: { icon: "/icon.svg", apple: "/icons/icon-192.png" },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#173d35",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-MX">
      <body>{children}</body>
    </html>
  );
}
