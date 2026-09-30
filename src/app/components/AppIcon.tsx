"use client";

import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  CreditCardOutlined,
  FacebookFilled,
  InfoCircleOutlined,
  InstagramFilled,
  ShoppingOutlined,
  TeamOutlined,
  TikTokFilled,
  TruckOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";

export type AppIconName =
  | "arrow"
  | "arrow-left"
  | "check-circle"
  | "credit-card"
  | "facebook"
  | "info-circle"
  | "instagram"
  | "measure"
  | "shopping"
  | "team"
  | "tiktok"
  | "truck"
  | "whatsapp";

export function AppIcon({ name }: { name: AppIconName }) {
  const icon =
    name === "arrow" ? (
      <ArrowRightOutlined className="app-icon" />
    ) : name === "arrow-left" ? (
      <ArrowLeftOutlined className="app-icon" />
    ) : name === "check-circle" ? (
      <CheckCircleOutlined className="app-icon" />
    ) : name === "credit-card" ? (
      <CreditCardOutlined className="app-icon" />
    ) : name === "facebook" ? (
      <FacebookFilled className="app-icon" />
    ) : name === "info-circle" ? (
      <InfoCircleOutlined className="app-icon" />
    ) : name === "instagram" ? (
      <InstagramFilled className="app-icon" />
    ) : name === "measure" ? (
      <span className="anticon app-icon" role="img" aria-hidden="true"><svg width="1em" height="1em" viewBox="0 0 576.58075 431.55264" xmlns="http://www.w3.org/2000/svg" fill="currentColor" focusable="false" aria-hidden="true"><path fill="currentColor" d="m 497.2204,406.31374 h 54 v -116 h -54 z m -126,-140 v -50 c -12.19531,15.21484 -26.75781,27.76953 -43.08203,38.41797 -5.25781,3.42578 -11.58203,6.10156 -16.625,9.33984 -0.99609,0.63672 -1.77343,-0.11328 -1.29297,2.24219 z m 102,24 -286.53906,0.043 c -54.5625,-3.44141 -110.781249,-21.77735 -149.484369,-61.51563 -3.03516,-3.11718 -5.98828,-7.71484 -9.16016,-10.84375 -0.875,-0.86718 -0.83984,-2.1914 -2.80859,-1.67578 1.83203,39.95703 -6.8086,83.36719 13.82422,119.66406 18.6289,32.77735 54.91015,50.83985 90.167959,60.32813 v -49.50003 c 0,-4.30078 6.13282,-9.93359 10.61329,-10.43359 9.0625,-1.00391 13.6914,5.03125 14.42968,13.39453 1.47266,16.72656 -1.17578,35.58984 -0.0469,52.54687 l 44.0039,3.99219 v -30.5 c 0,-8.64844 13.13672,-13.77734 20.35547,-8.35156 1.33594,1.00781 4.64453,6.09375 4.64453,7.35156 v 31.5 h 44 v -58.5 c 0,-0.27344 1.48438,-4.59375 1.79297,-5.21094 3.2461,-6.47656 11.78907,-8.22656 17.71485,-4.29297 1.34765,0.89453 5.49218,6.40625 5.49218,7.50391 v 60.5 h 43 v -33.5 c 0,-4.30859 8.35938,-7.80078 12.53125,-7.57031 4.19532,0.23047 11.46875,4.28125 11.46875,8.57031 v 32.5 h 45 v -62.5 c 0,-4.37109 9.48047,-7.93359 13.50782,-7.54688 4.17187,0.40235 10.49218,5.45313 10.49218,9.54688 v 60.5 h 45 z M 181.01728,24.610606 C 110.87275,29.055926 10.216501,77.684826 27.536811,162.50124 43.579781,241.06374 149.33369,270.93093 218.71259,265.30593 286.38837,259.81765 383.5329,213.99343 370.95087,132.08718 358.45087,50.696546 251.43525,20.145766 181.01728,24.610606 M 396.2204,266.31374 h 164.5 c 4.24219,0 12.98047,8.48437 14.02344,12.98047 2.44922,45.67578 2.44922,92.38672 0,138.04297 -2.45703,6.01953 -7.18359,10.70703 -13.46484,12.53515 -118.95703,3.37891 -238.44922,0.4336 -357.60547,1.49219 C 115.56806,430.39186 7.5641507,394.96608 1.1813407,291.85671 c -2.64453,-42.67188 -0.13672,-92.03516 0.66406,-135.21094 0.56641,-30.57031 1.06641,-46.5 17.9609403,-73.246094 C 99.040721,-42.045644 369.8415,-27.119854 396.0954,135.94265 Z"/><path fill="currentColor" d="m 539.38837,349.80202 c 0,8.20703 -6.65234,14.85938 -14.85937,14.85938 -8.20703,0 -14.86328,-6.65235 -14.86328,-14.85938 0,-8.20703 6.65625,-14.85937 14.86328,-14.85937 8.20703,0 14.85937,6.65234 14.85937,14.85937"/></svg></span>
    ) : name === "shopping" ? (
      <ShoppingOutlined className="app-icon" />
    ) : name === "team" ? (
      <TeamOutlined className="app-icon" />
    ) : name === "tiktok" ? (
      <TikTokFilled className="app-icon" />
    ) : name === "truck" ? (
      <TruckOutlined className="app-icon" />
    ) : (
      <WhatsAppOutlined className="app-icon" />
    );
  return icon;
}
