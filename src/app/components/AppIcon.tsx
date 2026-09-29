"use client";

import {
  ArrowRightOutlined,
  CreditCardOutlined,
  InstagramOutlined,
  ShoppingOutlined,
  TikTokOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";

export type AppIconName =
  | "arrow"
  | "credit-card"
  | "instagram"
  | "shopping"
  | "tiktok"
  | "whatsapp";

type AppIconProps = {
  name: AppIconName;
};

export function AppIcon({ name }: AppIconProps) {
  switch (name) {
    case "arrow":
      return <ArrowRightOutlined />;

    case "credit-card":
      return <CreditCardOutlined />;

    case "instagram":
      return <InstagramOutlined />;

    case "shopping":
      return <ShoppingOutlined />;

    case "tiktok":
      return <TikTokOutlined />;

    case "whatsapp":
      return <WhatsAppOutlined />;

    default:
      return null;
  }
}