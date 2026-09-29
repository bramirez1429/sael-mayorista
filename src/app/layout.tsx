import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import AntdProvider from "./antd-provider";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SAEL Mayorista | Indumentaria para tu emprendimiento",
  description: "Modelos, talles y diseños de SAEL para emprendedores y comercios.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={geist.variable}>
        <AntdRegistry>
          <AntdProvider>{children}</AntdProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
