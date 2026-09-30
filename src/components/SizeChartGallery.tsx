"use client";

import { Image } from "antd";
export type SizeChart = { id: string; title: string; src: string; alt: string };

export default function SizeChartGallery({ charts }: { charts: SizeChart[] }) {
  return <Image.PreviewGroup><div className="size-chart-grid">{charts.map((chart) => <section className="size-chart-section" key={chart.id}><div className="title-divider"><span>{chart.title}</span></div><div className="size-chart size-chart-card"><Image src={chart.src} alt={chart.alt} preview /></div></section>)}</div></Image.PreviewGroup>;
}
