import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata: Metadata = {
  title: "Zephy Admin",
  description: "administrador de zephy",
  icons: {
    icon: "/images/zephy.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="flex bg-gray-900">
        {/* Sidebar */}
        <Sidebar />

        {/* Contenido */}
        <main className="flex-1 p-6 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
