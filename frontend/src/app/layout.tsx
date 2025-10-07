import "./globals.css";
import { Providers } from "../providers";

export const metadata = {
  title: "KEY Protocol - Shared Ledger for Social Impact",
  description:
    "Dashboard de impacto social para financiadores - Visión integral y en tiempo real del progreso y el impacto de los proyectos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-poppins">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
