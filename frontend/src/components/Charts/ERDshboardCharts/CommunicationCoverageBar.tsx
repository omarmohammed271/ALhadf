"use client";
import { useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "@/components/theme-provider";
import { useResponsiveScalars } from "@/hooks/useResponsiveScalars";
import { useTranslation } from "react-i18next";
import CommunicationCoverageDialogEN from "@/components/ChartDetailsDialogs/ER/CommunicationCoverageDialogs/en/CommunicationCoverageDialogEN";
import CommunicationCoverageDialogAR from "@/components/ChartDetailsDialogs/ER/CommunicationCoverageDialogs/ar/CommunicationCoverageDialogAR";

export default function CommunicationCoverageBar({
  sections,
  coverage,
  threshold, // always required
  critical
}: {
  sections: string[];
  coverage: number[];
  threshold: number;
  critical: boolean;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { textScalar, barScalar } = useResponsiveScalars();
  const { t, i18n } = useTranslation();

  const textColor = isDark ? "#FFFFFF" : "#111827";
  const gridLine = isDark ? "#374151" : "#e5e7eb";

  const chartRef = useRef<any>(null);

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      backgroundColor: isDark ? "#111827" : "#000000",
      textStyle: { color: "#FFFFFF", fontSize: 11 * textScalar },
      formatter: (params: any) => `${params.name}<br/>Coverage: ${params.value}%`,
    },
    xAxis: {
      type: "category",
      data: sections,
      axisLabel: {
        color: textColor,
        fontSize: 10 * textScalar,
        rotate: 45,       // rotate labels for better readability
        interval: 0,      // show all labels
        formatter: (val: string) =>
          val.length > 10 ? val.slice(0, 10) + "…" : val, // truncate long labels
      },
      axisLine: { lineStyle: { color: gridLine } },
    },
    yAxis: {
      type: "value",
      max: 100,
      axisLabel: { color: textColor, fontSize: 10 * textScalar, formatter: "{value}%" },
      splitLine: { lineStyle: { color: gridLine } },
      axisLine: { lineStyle: { color: gridLine } },
    },
    grid: { left: "5%", right: "5%", bottom: "2%", top: "15%", containLabel: true },
    series: [
      // Thin bars
      {
        name: t("er.charts.communicationCoverage.title") || "Coverage",
        type: "bar",
        data: coverage,
        barWidth: 4 * barScalar, // thin bar
        itemStyle: { color: "var(--chart-1)" },
        emphasis: { itemStyle: { color: "var(--chart-2)" } },
        label: {
          show: true,
          color: textColor,
          fontSize: 10 * textScalar,
          formatter: "{c}%",
        },
      },
      // Scatter points at the tip
      {
        name: "Coverage Points",
        type: "scatter",
        data: coverage.map((v, idx) => [idx, v]),
        symbol: "circle",
        symbolSize: 10 * barScalar,
        itemStyle: { color: "var(--chart-1)"},
        emphasis: { itemStyle: { color: "var(--chart-2)", borderWidth: 2 } },
      },
      // Threshold line
      {
        name: "Threshold",
        type: "line",
        data: Array(sections.length).fill(threshold),
        lineStyle: { type: "dashed", color: "red", width: 1.5 },
        silent: true,
      },
    ],
  };

  useEffect(() => {
    const chart = chartRef.current?.getEchartsInstance();
    const handleResize = () => chart?.resize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`w-full p-5 card-style relative ` + (critical ? `bg-red-700/7` : ``)}>
      {/* Details Dialog */}
      {i18n.language === "en" ? (
        <CommunicationCoverageDialogEN sections={sections} coverage={coverage} threshold={threshold} />
      ) : (
        <CommunicationCoverageDialogAR sections={sections} coverage={coverage} threshold={threshold} />
      )}

      {/* Chart */}
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ width: "100%", height: "100%" }}
        opts={{ renderer: "svg" }}
      />
    </div>
  );
}
