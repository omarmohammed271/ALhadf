"use client";
import { useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "@/components/theme-provider";
import { useResponsiveScalars } from "@/hooks/useResponsiveScalars";
import { useTranslation } from "react-i18next";
import TimeToFirstCommunicationLineDialogEN from "@/components/ChartDetailsDialogs/ER/TimeToFirstCommunicationLineDialogs/en/TimeToFirstCommunicationLineDialogEN";
import TimeToFirstCommunicationLineDialogAR from "@/components/ChartDetailsDialogs/ER/TimeToFirstCommunicationLineDialogs/ar/TimeToFirstCommunicationLineDialogAR";

interface TimeToFirstCommunicationLineProps {
  sections: string[];
  avgMinutes: number[];
  threshold: number;
}

export default function TimeToFirstCommunicationLine({
  sections,
  avgMinutes,
  threshold,
}: TimeToFirstCommunicationLineProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { textScalar, barScalar } = useResponsiveScalars();
  const { t, i18n } = useTranslation();

  const textColor = isDark ? "#FFFFFF" : "#111827";
  const subTextColor = isDark ? "#9ca3af" : "#6b7280";
  const gridLineColor = isDark ? "#374151" : "#e5e7eb";

  const chartRef = useRef<any>(null);

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross", label: { show: true } },
      backgroundColor: isDark ? "#111827" : "#000000",
      textStyle: { color: "#FFFFFF", fontSize: 11 * textScalar },
      formatter: (params: any) => {
        const p = params[0];
        return `${p.axisValue}<br/><strong>${t("er.charts.timeToFirstCommunication.title")}</strong>: ${p.value} min`;
      },
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
      axisLine: { lineStyle: { color: subTextColor } },
    },
    yAxis: {
      type: "value",
      name: t("er.charts.timeToFirstCommunication.yAxisLabel") || "Minutes",
      axisLabel: { color: textColor, fontSize: 10 * textScalar },
      axisLine: { lineStyle: { color: subTextColor } },
      splitLine: { lineStyle: { color: gridLineColor } },
    },
    grid: { left: "10%", right: "10%", top: "15%", bottom: "2%", containLabel: true },
    series: [
      {
        name: t("er.charts.timeToFirstCommunication.title"),
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 8 * barScalar,  // dot at each point
        lineStyle: { width: 2 * barScalar, color: "var(--chart-1)" }, // thin line
        areaStyle: {
          color: isDark ? "rgba(31,41,55,0.4)" : "rgba(255,255,255,0.2)",
        },
        itemStyle: { color: "var(--chart-1)" },
        data: avgMinutes,
        label: {
          show: true,
          position: "top",
          fontSize: 10 * textScalar,
          color: textColor,
          formatter: "{c} min", // show value above the dot
        },
        emphasis: {
          itemStyle: {
            color: "var(--chart-2)",
            shadowBlur: 6,
            shadowColor: isDark ? "#000" : "#888",
          },
          lineStyle: { width: 2 * barScalar },
        },
        markLine: threshold
          ? {
              symbol: "none",
              lineStyle: { type: "dashed", width: 1.5, color: "red" },
              label: {
                formatter: `${t("er.charts.timeToFirstCommunication.threshold")} (${threshold} min)`,
                color: subTextColor,
                fontSize: 9 * textScalar,
              },
              data: [{ yAxis: threshold }],
              silent: true,
            }
          : undefined,
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
    <div className="w-full p-5 card-style relative">
      {/* Details Dialog */}
      {i18n.language === "en" ? (
        <TimeToFirstCommunicationLineDialogEN
          sections={sections}
          avgMinutes={avgMinutes}
          threshold={threshold}
        />
      ) : (
        <TimeToFirstCommunicationLineDialogAR
          sections={sections}
          avgMinutes={avgMinutes}
          threshold={threshold}
        />
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
