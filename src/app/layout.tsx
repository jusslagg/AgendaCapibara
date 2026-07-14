import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { PWARegistration } from "@/components/PWARegistration";
import { ThemeInitializer } from "@/components/ThemeInitializer";

export const metadata: Metadata = {
  title: { default: "PrismAgenda", template: "%s · PrismAgenda" },
  description: "Tu estudio creativo, fechas y entregas en foco.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "PrismAgenda", statusBarStyle: "black-translucent" },
  icons: { icon: "/prism-icon-192.png", apple: "/prism-icon-192.png" },
};

export const viewport: Viewport = { themeColor: "#0A0A0C", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeInitializer />
        <AuthProvider>{children}</AuthProvider>
        <PWARegistration />
      </body>
    </html>
  );
}
