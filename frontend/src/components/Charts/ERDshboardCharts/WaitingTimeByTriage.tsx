"use client";
import { useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "@/components/theme-provider";
import { useResponsiveScalars } from "@/hooks/useResponsiveScalars";
import { useTranslation } from "react-i18next";
import WaitingTimeByTriageDialogEN from "@/components/ChartDetailsDialogs/ER/WaitingTimeByTriageDialogs/en/WaitingTimeByTriageDialogEN";
import WaitingTimeByTriageDialogAR from "@/components/ChartDetailsDialogs/ER/WaitingTimeByTriageDialogs/ar/WaitingTimeByTriageDialogAR";

export default function WaitingTimeByTriage({
  data,
  threshold,
  critical
}: {
  data: { level: string; minutes: number[] }[];
  threshold: number; // always required
  critical: boolean;
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { textScalar, barScalar } = useResponsiveScalars();
  const { t, i18n } = useTranslation();

  const textColor = isDark ? "#e5e7eb" : "#111827";
  const subTextColor = isDark ? "#9ca3af" : "#6b7280";
  const borderColor = isDark ? "#1f2937" : "#ffffff";

  const chartRef = useRef<any>(null);

  const levels = data.map(d => d.level);
  const avgTimes = data.map(d => {
    const count = d.minutes.length;
    return count ? d.minutes.reduce((a, b) => a + b, 0) / count : 0;
  });

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const p = params[0];
        return `${p.axisValue}<br/>Average Wait: ${p.data.toFixed(1)} min`;
      },
      backgroundColor: isDark ? "#111827" : "#000000",
      textStyle: { color: "#FFFFFF", fontSize: 13 * textScalar },
    },
    xAxis: {
      type: "category",
      data: levels,
      axisLine: { lineStyle: { color: subTextColor } },
      axisLabel: { color: subTextColor, fontSize: 10 * textScalar },
    },
    yAxis: {
      type: "value",
      name: t("er.charts.waitingTimeByTriage.yAxisLabel") || "Minutes",
      axisLine: { lineStyle: { color: subTextColor } },
      axisLabel: { color: subTextColor, fontSize: 10 * textScalar },
      splitLine: { lineStyle: { color: subTextColor } },
    },
    grid: { left: "10%", right: "10%", bottom: "5%", top: "15%" },
    series: [
      {
        name: t("er.charts.waitingTimeByTriage.title") || "Waiting Time",
        type: "bar",
        data: avgTimes,
        itemStyle: {
          color: "var(--chart-1)",
          borderColor,
        },
        emphasis: { 
          itemStyle: { color: "var(--chart-2)" } // changed hover color
        },
        barWidth: 4 * barScalar, // thin bar
        label: {
          show: true,
          color: textColor,
          fontSize: 10 * textScalar,
          formatter: "{c}%",
        },
      },
      {
        name: "Coverage Points",
        type: "scatter",
        data: avgTimes,
        symbol: "circle",
        symbolSize: 10 * barScalar,
        itemStyle: { color: "var(--chart-1)"},
        emphasis: { itemStyle: { color: "var(--chart-2)", borderWidth: 2 } },
      },
      {
        name: "Threshold",
        type: "line",
        data: Array(levels.length).fill(threshold),
        lineStyle: { type: "dashed", color: "red" },
      },
    ],
  };

  const scale = (base: number, scalar: number) => Math.round(base * scalar);

  useEffect(() => {
    const chart = chartRef.current?.getEchartsInstance();
    const handleResize = () => chart?.resize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`flex items-center justify-center w-full p-5 card-style relative ` + (critical ? `bg-red-700/7` : ``)}>
      {/* Details Dialog */}
      {i18n.language === "en" ? (
        <WaitingTimeByTriageDialogEN data={data} threshold={threshold} />
      ) : (
        <WaitingTimeByTriageDialogAR data={data} threshold={threshold} />
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
