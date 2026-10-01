import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { SITE_CONFIG } from "../config/site";
import AntdProvider from "./antd-provider";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

const siteDescription =
  "Remeras y buzos mayoristas para mujeres y niñas. Modelos, talles y diseños para tu negocio.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.siteUrl),
  title: {
    default: SITE_CONFIG.siteName,
    template: "%s | SAEL Mayorista",
  },
  description: siteDescription,
  applicationName: SITE_CONFIG.siteName,
  openGraph: {
    title: SITE_CONFIG.siteName,
    description: siteDescription,
    // url: SITE_CONFIG.siteUrl,
    siteName: SITE_CONFIG.siteName,
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/sael-og.png",
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.siteName,
    description: siteDescription,
    images: ["/sael-og.png"],
  },
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
