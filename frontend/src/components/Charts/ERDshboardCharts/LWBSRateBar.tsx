"use client";
import { useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "@/components/theme-provider";
import { useResponsiveScalars } from "@/hooks/useResponsiveScalars";
import { useTranslation } from "react-i18next";
import LWBSRateBarDialogEN from "@/components/ChartDetailsDialogs/ER/LWBSRateBarDialogs/en/LWBSRateBarDialogEN";
import LWBSRateBarDialogAR from "@/components/ChartDetailsDialogs/ER/LWBSRateBarDialogs/ar/LWBSRateBarDialogAR";

interface LWBSRateBarProps {
  sections: string[];
  lwbsRates: number[];
  threshold?: number;
  critical: boolean;
}

export default function LWBSRateBar({
  sections,
  lwbsRates,
  threshold,
  critical
}: LWBSRateBarProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { textScalar, barScalar, iScalar } = useResponsiveScalars();
  const { t, i18n } = useTranslation();

  const textColor = isDark ? "#FFFFFF" : "#111827";
  const subTextColor = isDark ? "#9ca3af" : "#6b7280";

  const chartRef = useRef<any>(null);

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      backgroundColor: isDark ? "#111827" : "#000000",
      textStyle: { color: "#FFFFFF", fontSize: 12 * textScalar },
      axisPointer: { type: "shadow" },
      formatter: (p: any) =>
        `${p[0].axisValue}<br/>${t("er.charts.lwbsRate.yAxisLabel")}: <b>${p[0].value}%</b>`,
    },
    grid: { left: "2%", right: "6%", bottom: "2%", top: "18%", containLabel: true },
    xAxis: {
      type: "category",
      data: sections,
      axisLabel: {
        color: textColor,
        fontSize: 10 * textScalar,
        interval: 0,          // show all labels
        rotate: 0,            // can rotate if too crowded
        formatter: (val: string) => val, // could wrap manually if needed
      },
      axisLine: { lineStyle: { color: subTextColor, width: 1 * iScalar } },
      splitLine: { show: false },
    },
    yAxis: {
      type: "value",
      name: t("er.charts.lwbsRate.yAxisLabel"),
      axisLabel: { color: textColor, fontSize: 9 * textScalar, formatter: "{value}%" },
      axisLine: { lineStyle: { color: subTextColor, width: 1 * iScalar } },
      splitLine: { lineStyle: { color: isDark ? "#374151" : "#e5e7eb" } },
    },
    series: [
      {
        name: t("er.charts.lwbsRate.title"),
        type: "bar",
        barWidth: 22 * barScalar,
        data: lwbsRates,
        itemStyle: { color: "var(--chart-1)" },
        emphasis: {
          itemStyle: {
            color: "var(--chart-2)", // hover color
            borderWidth: 1.5,
            shadowBlur: 6,
            shadowColor: isDark ? "#000" : "#888",
          },
        },
        label: {
          show: true,
          position: "top",
          color: textColor,
          fontSize: 11 * textScalar,
          formatter: (p: any) => `${p.value}%`,
        },
        markLine: threshold
          ? {
              symbol: "none",
              lineStyle: { type: "dashed", color: "red", width: 1.5 },
              label: {
                formatter: `${t("er.charts.lwbsRate.threshold")} (${threshold}%)`,
                fontSize: 9 * textScalar,
                color: subTextColor,
              },
              data: [{ yAxis: threshold }],
              silent: true,
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
        <LWBSRateBarDialogEN sections={sections} lwbsRates={lwbsRates} />
      ) : (
        <LWBSRateBarDialogAR sections={sections} lwbsRates={lwbsRates} />
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
