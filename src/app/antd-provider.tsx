'use client';

import type { ReactNode } from "react";
import { ConfigProvider } from "antd";

export default function AntdProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#E30613",
          colorText: "#111111",
          borderRadius: 20,
          fontFamily: "var(--font-geist-sans), Arial, sans-serif",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
