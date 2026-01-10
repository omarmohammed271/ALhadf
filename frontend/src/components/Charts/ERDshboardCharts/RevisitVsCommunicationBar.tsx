"use client";
import { useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "@/components/theme-provider";
import { useResponsiveScalars } from "@/hooks/useResponsiveScalars";
import { useTranslation } from "react-i18next";
import RevisitVsCommunicationBarDialogEN from "@/components/ChartDetailsDialogs/ER/RevisitVsCommunicationDialogs/en/RevisitVsCommunicationBarDialogEN";
import RevisitVsCommunicationBarDialogAR from "@/components/ChartDetailsDialogs/ER/RevisitVsCommunicationDialogs/ar/RevisitVsCommunicationBarDialogAR";

interface RevisitVsCommunicationBarProps {
  categories: string[];          // Yes / No OR Communication / No Communication
  revisitRates: number[];        // %
  threshold?: number;
  critical: boolean;     
}

export default function RevisitVsCommunicationBar({
  categories,
  revisitRates,
  threshold,
  critical
}: RevisitVsCommunicationBarProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { textScalar, barScalar, iScalar } = useResponsiveScalars();
  const { t, i18n } = useTranslation();

  const textColor = isDark ? "#e5e7eb" : "#111827";
  const subTextColor = isDark ? "#9ca3af" : "#6b7280";

  const chartRef = useRef<any>(null);

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: isDark ? "#111827" : "#000000",
      textStyle: { color: "#FFFFFF", fontSize: 10 * textScalar },
      formatter: (p: any) =>
        `${p[0].axisValue}<br/>${t(
          "er.charts.revisitVsCommunication.yAxisLabel"
        )}: <b>${p[0].value}%</b>`,
    },
    grid: {
      left: "2%",
      right: "6%",
      bottom: "2%",
      top: "18%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: categories,
      axisLabel: {
        color: textColor,
        fontSize: 9 * textScalar,
        interval: 0,           // show all labels
        overflow: 'break',     // automatically wrap text if too long
        align: 'center',       // center-align wrapped text
        margin: 15,
      },
      axisLine: {
        lineStyle: { color: subTextColor, width: 1 * iScalar },
      },
    },
    yAxis: {
      type: "value",
      name: t("er.charts.revisitVsCommunication.yAxisLabel"),
      axisLabel: {
        color: textColor,
        fontSize: 9 * textScalar,
        formatter: "{value}%",
      },
      axisLine: {
        lineStyle: { color: subTextColor, width: 1 * iScalar },
      },
      splitLine: {
        lineStyle: { color: isDark ? "#374151" : "#e5e7eb" },
      },
    },
    series: [
      {
        name: t("er.charts.revisitVsCommunication.title"),
        type: "bar",
        barWidth: 26 * barScalar,
        data: revisitRates,
        itemStyle: { color: "var(--chart-1)" },
        label: {
          show: true,
          position: "top",
          color: textColor,
          fontSize: 11 * textScalar,
          formatter: (p: any) => `${p.value}%`,
        },
        emphasis: {
          itemStyle: {
            color: "var(--chart-2)",      // hover color
            shadowBlur: 6,                // subtle shadow on hover
            shadowColor: isDark ? "#000" : "#888", // shadow color
          },
        },
        markLine: threshold
          ? {
              symbol: "none",
              lineStyle: { type: "dashed", width: 1.5, color: "#ef4444" },
              label: {
                formatter: `${t(
                  "er.charts.revisitVsCommunication.threshold"
                )} (${threshold}%)`,
                fontSize: 9 * textScalar,
                color: subTextColor,
              },
              data: [{ yAxis: threshold }],
            }
          : undefined,
      },
    ],
  };

  useEffect(() => {
    chartRef.current?.getEchartsInstance()?.resize();
  }, [textScalar, barScalar, iScalar]);

  return (
    <div className={`w-full p-5 card-style relative ` + (critical ? `bg-red-700/7` : ``)}>
      {i18n.language === "en" ? (
        <RevisitVsCommunicationBarDialogEN
          categories={categories}
          revisitRates={revisitRates}
          threshold={threshold}
        />
      ) : (
        <RevisitVsCommunicationBarDialogAR
          categories={categories}
          revisitRates={revisitRates}
          threshold={threshold}
        />
      )}

      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ width: "100%", height: "100%" }}
        opts={{ renderer: "svg" }}
      />
    </div>
  );
}
