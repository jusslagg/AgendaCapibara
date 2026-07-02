import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { PWARegistration } from "@/components/PWARegistration";

export const metadata: Metadata = {
  title: { default: "CapiAgenda", template: "%s · CapiAgenda" },
  description: "Organizá tus tareas sin entrar en pánico.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "CapiAgenda", statusBarStyle: "default" },
  icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
};

export const viewport: Viewport = { themeColor: "#4B2E1F", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
        <PWARegistration />
      </body>
    </html>
  );
}
