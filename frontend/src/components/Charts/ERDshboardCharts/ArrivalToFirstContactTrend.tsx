"use client";
import { useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "@/components/theme-provider";
import { useResponsiveScalars } from "@/hooks/useResponsiveScalars";
import { useTranslation } from "react-i18next";
import ArrivalToFirstContactDialogEN from "@/components/ChartDetailsDialogs/ER/ArrivalToFirstContactDialogs/en/ArrivalToFirstContactDialogEN";
import ArrivalToFirstContactDialogAR from "@/components/ChartDetailsDialogs/ER/ArrivalToFirstContactDialogs/ar/ArrivalToFirstContactDialogAR";

type Granularity = "daily" | "weekly";

type TrendPoint = {
  section: string;
  avgMinutes: number;
};

type Props = {
  data: TrendPoint[];
  granularity: Granularity;
  threshold?: number;
};

export default function ArrivalToFirstContactTrend({
  data = [],
  granularity,
  threshold,
}: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { textScalar, barScalar } = useResponsiveScalars();
  const { t, i18n } = useTranslation();
  const chartRef = useRef<any>(null);

  const textColor = isDark ? "#e5e7eb" : "#111827";
  const subTextColor = isDark ? "#9ca3af" : "#6b7280";
  const borderColor = isDark ? "#1f2937" : "#ffffff";

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      backgroundColor: isDark ? "#111827" : "#000000",
      textStyle: { color: "#FFFFFF", fontSize: 11 * textScalar },
      axisPointer: { type: "cross", label: { show: true } },
      formatter: (params: any) => {
        const p = params[0];
        return `
          ${p.axisValue}<br/>
          <strong>${p.data} ${t("er.charts.arrivalToFirstContact.minutes")}</strong><br/>
          <span style="opacity:.7">
            ${
              granularity === "daily"
                ? t("er.charts.arrivalToFirstContact.dailyAverage")
                : t("er.charts.arrivalToFirstContact.weeklyAverage")
            }
          </span>
        `;
      },
    },
    grid: { left: "5%", right: "5%", top: "15%", bottom: "2%" },
    xAxis: {
      type: "category",
      data: data.map((d) => d.section),
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
      axisLabel: {
        formatter: `{value} ${t("er.charts.arrivalToFirstContact.minutes")}`,
        color: subTextColor,
        fontSize: 10 * textScalar,
      },
      axisLine: { lineStyle: { color: subTextColor } },
      splitLine: { lineStyle: { color: isDark ? "#374151" : "#e5e7eb" } },
    },
    series: [
      {
        name: t("er.charts.arrivalToFirstContact.title"),
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 6 * barScalar,
        lineStyle: { width: 2 },
        itemStyle: { color: "var(--chart-1)" },
        emphasis: { itemStyle: { color: "var(--chart-2)" }, focus: "series" },
        data: data.map((d) => d.avgMinutes),
        areaStyle: {
          color: isDark ? "rgba(31,41,55,0.4)" : "rgba(255,255,255,0.2)",
        },
        label: {
          show: true,
          position: "top",
          fontSize: 10 * textScalar,
          color: textColor,
          formatter: "{c} min", // show value above the dot
        },
        markLine: threshold
          ? {
              symbol: "none",
              lineStyle: { type: "dashed", width: 1.5, color: "red" },
              label: {
                formatter: `${t("er.charts.arrivalToFirstContact.threshold")} (${threshold} ${t(
                  "er.charts.arrivalToFirstContact.minutes"
                )})`,
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
    <div
      className={`w-full p-5 card-style relative ${
        threshold && data.filter(d => d.avgMinutes > threshold).length >= 2
          ? "bg-red-700/7"
          : ""
      }`}
    >

      {/* Details Dialog */}
      {i18n.language === "en" ? (
        <ArrivalToFirstContactDialogEN
          data={data}
          granularity={granularity}
          threshold={threshold}
        />
      ) : (
        <ArrivalToFirstContactDialogAR
          data={data}
          granularity={granularity}
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
