'use client';

import React, { useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '@/components/theme-provider';
import { useResponsiveScalars } from '@/hooks/useResponsiveScalars';
import { useTranslation } from 'react-i18next';
import DissatisfactionRiskBySectionDialogEN from '@/components/ChartDetailsDialogs/ER/DissatisfactionRiskBySectionDialogs/en/DissatisfactionRiskBySectionDialogEN';
import DissatisfactionRiskBySectionDialogAR from '@/components/ChartDetailsDialogs/ER/DissatisfactionRiskBySectionDialogs/ar/DissatisfactionRiskBySectionDialogAR';

interface ERSectionRisk {
  section: string;
  riskScore: number; // 0-100
}

interface DissatisfactionRiskBySectionProps {
  data: ERSectionRisk[];
}

export default function DissatisfactionRiskBySection({ data }: DissatisfactionRiskBySectionProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const chartRef = useRef<any>(null);
  const { t, i18n } = useTranslation();
  const { textScalar, iScalar } = useResponsiveScalars();

  const textColor = isDark ? "#FFFFFF" : "#111827";
  const subTextColor = isDark ? "#9ca3af" : "#6b7280";
  const gridLineColor = isDark ? "#374151" : "#e5e7eb";

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (p: any) =>
        `<strong>${p.name}</strong><br/>
         ${t('er.charts.dissatisfactionRiskBySection.riskScore')}: <b>${p.data}</b>`,
      backgroundColor: isDark ? '#111827' : '#000000',
      textStyle: { color: '#FFFFFF', fontSize: 10 * textScalar },
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.section),
      axisLabel: {
        color: textColor,
        fontSize: 10 * textScalar,
        rotate: 45,       // rotate labels for better readability
        interval: 0,      // show all labels
        formatter: (val: string) =>
          val.length > 10 ? val.slice(0, 10) + "…" : val, // truncate long labels
      },
      axisLine: { lineStyle: { color: isDark ? '#9ca3af' : '#6b7280', width: 1 * iScalar } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { fontSize: 9 * textScalar, color: isDark ? '#e5e7eb' : '#111827' },
      axisLine: { lineStyle: { color: isDark ? '#9ca3af' : '#6b7280', width: 1 * iScalar } },
      splitLine: { lineStyle: { color: isDark ? '#374151' : '#e5e7eb' } },
    },
    series: [
      {
        type: 'line',
        data: data.map(d => d.riskScore),
        symbol: 'circle',
        symbolSize: 12 * textScalar,
        lineStyle: { width: 2, color: 'var(--chart-1)' },
        itemStyle: { color: 'var(--chart-1)' },
        areaStyle: {
          color: isDark ? "rgba(31,41,55,0.4)" : "rgba(255,255,255,0.2)",
        },
        label: {
          show: true,
          position: "top",
          fontSize: 9 * textScalar,
          color: textColor,
          formatter: "{c} min", // show value above the dot
        },
        emphasis: {
          focus: 'series',              // keep line visible on hover
          lineStyle: { width: 2 },       // keep same width
          itemStyle: { color: 'var(--chart-1)' }, // keep symbol color
        },
      },
    ],
    grid: { left: '5%', right: '10%', top: '18%', bottom: '5%', containLabel: true },
  };

  useEffect(() => {
    const chart = chartRef.current?.getEchartsInstance();
    chart?.resize();
  }, [textScalar, iScalar]);

  return (
    <div className="w-full h-full text-card-foreground flex flex-col gap-6 rounded-lg px-2 border border-border bg-primary/5 relative">
      {i18n.language === 'en' ? (
        <DissatisfactionRiskBySectionDialogEN data={data} />
      ) : (
        <DissatisfactionRiskBySectionDialogAR data={data} />
      )}

      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ width: '100%', height: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}
