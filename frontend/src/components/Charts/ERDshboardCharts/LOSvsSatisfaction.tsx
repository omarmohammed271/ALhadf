"use client";
import { useEffect, useRef } from "react";
import ReactECharts from "echarts-for-react";
import { useTheme } from "@/components/theme-provider";
import { useResponsiveScalars } from "@/hooks/useResponsiveScalars";
import { useTranslation } from "react-i18next";
import LOSvsSatisfactionDialogEN from "@/components/ChartDetailsDialogs/ER/LOSvsSatisfactionDialogs/en/LOSvsSatisfactionDialogEN";
import LOSvsSatisfactionDialogAR from "@/components/ChartDetailsDialogs/ER/LOSvsSatisfactionDialogs/ar/LOSvsSatisfactionDialogAR";

interface LOSvsSatisfactionProps {
  lengthsOfStay: number[];      // X-axis
  satisfactionScores: number[]; // Y-axis
  threshold?: number; 
  critical: boolean;
}

export default function LOSvsSatisfaction({
  lengthsOfStay,
  satisfactionScores,
  threshold,
  critical
}: LOSvsSatisfactionProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { textScalar, iScalar } = useResponsiveScalars();
  const { t, i18n } = useTranslation();

  const textColor = isDark ? "#FFFFFF" : "#111827";
  const subTextColor = isDark ? "#9ca3af" : "#6b7280";
  const gridLineColor = isDark ? "#374151" : "#e5e7eb";

  const chartRef = useRef<any>(null);

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      formatter: (params: any) =>
        `${t("er.charts.losVsSatisfaction.title") || "Satisfaction vs LOS"}<br/>` +
        `${t("er.charts.losVsSatisfaction.labels.los")}: ${params.data[0]}<br/>` +
        `${t("er.charts.losVsSatisfaction.labels.satisfaction")}: ${params.data[1]}`,
      backgroundColor: isDark ? "#111827" : "#000000",
      textStyle: { color: "#FFFFFF", fontSize: 11 * textScalar },
    },
    xAxis: {
      type: "value",
      name: t("er.charts.losVsSatisfaction.labels.los") || "Length of Stay",
      axisLabel: { color: textColor, fontSize: 10 * textScalar },
      axisLine: { lineStyle: { color: subTextColor } },
      splitLine: { lineStyle: { color: gridLineColor } },
    },
    yAxis: {
      type: "value",
      name: t("er.charts.losVsSatisfaction.labels.satisfaction") || "Satisfaction",
      axisLabel: { color: textColor, fontSize: 10 * textScalar },
      axisLine: { lineStyle: { color: subTextColor } },
      splitLine: { lineStyle: { color: gridLineColor } },
    },
    grid: { left: "5%", right: "10%", top: "18%", bottom: "2%", containLabel: true },
    series: [
      {
        name: t("er.charts.losVsSatisfaction.title") || "LOS vs Satisfaction",
        type: "scatter",
        data: lengthsOfStay.map((los, idx) => [los, satisfactionScores[idx]]),
        symbolSize: 12 * iScalar,
        itemStyle: { color: "var(--chart-1)" },
        emphasis: { 
          itemStyle: { color: "var(--chart-2)" } 
        },
        label: {
          show: true,
          position: "top",           // label appears above the point
          formatter: (p: any) => `${p.value[1]}%`, // show satisfaction
          color: isDark ? "#e5e7eb" : "#111827",
          fontSize: 9 * textScalar,
        },
        markLine: threshold
          ? {
              symbol: "none",
              lineStyle: { type: "dashed", width: 1.5, color: "red" },
              label: {
                formatter: `${t("er.charts.losVsSatisfaction.threshold")} (${threshold})`,
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
    <div className={`w-full p-5 card-style relative ` + (critical ? `bg-red-700/7` : ``)}>
      {/* Details Dialog */}
      {i18n.language === "en" ? (
        <LOSvsSatisfactionDialogEN
          lengthsOfStay={lengthsOfStay}
          satisfactionScores={satisfactionScores}
          threshold={threshold}
        />
      ) : (
        <LOSvsSatisfactionDialogAR
          lengthsOfStay={lengthsOfStay}
          satisfactionScores={satisfactionScores}
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
