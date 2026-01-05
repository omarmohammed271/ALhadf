'use client';

import { useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '@/components/theme-provider';
import { useResponsiveScalars } from '@/hooks/useResponsiveScalars';
import { useTranslation } from 'react-i18next';
import SatisfactionByShiftPressureDialogEN from '@/components/ChartDetailsDialogs/ER/SatisfactionByShiftPressureDialogs/en/SatisfactionByShiftPressureDialogEN';
import SatisfactionByShiftPressureDialogAR from '@/components/ChartDetailsDialogs/ER/SatisfactionByShiftPressureDialogs/ar/SatisfactionByShiftPressureDialogAR';

interface SatisfactionDataPoint {
  shift: string;
  pressureLevel: string;
  satisfaction: number; // 0-100
}

interface SatisfactionByShiftPressureProps {
  data: SatisfactionDataPoint[];
}

export default function SatisfactionByShiftPressure({ data }: SatisfactionByShiftPressureProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const chartRef = useRef<any>(null);
  const { t, i18n } = useTranslation();
  const { textScalar, iScalar } = useResponsiveScalars();

  // unique shifts and pressure levels for axes
  const shifts = Array.from(new Set(data.map(d => d.shift)));
  const pressures = Array.from(new Set(data.map(d => d.pressureLevel)));

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (p: any) => {
        return `${p.data[0]} / ${p.data[1]}<br/>
                ${t('er.charts.satisfactionByShiftPressure.satisfaction')}: <b>${p.data[2]}%</b>`;
      },
      textStyle: { fontSize: 10 * textScalar, color: '#FFFFFF' },
      backgroundColor: isDark ? '#111827' : '#000000',
    },
    xAxis: {
      type: 'category',
      name: t('er.charts.satisfactionByShiftPressure.xAxisLabel'),
      data: shifts,
      axisLabel: { fontSize: 9 * textScalar, color: isDark ? '#e5e7eb' : '#111827' },
      axisLine: { lineStyle: { color: isDark ? '#9ca3af' : '#6b7280', width: 1 * iScalar } },
    },
    yAxis: {
      type: 'category',
      name: t('er.charts.satisfactionByShiftPressure.yAxisLabel'),
      data: pressures,
      axisLabel: { fontSize: 9 * textScalar, color: isDark ? '#e5e7eb' : '#111827' },
      axisLine: { lineStyle: { color: isDark ? '#9ca3af' : '#6b7280', width: 1 * iScalar } },
    },
    series: [
      {
        type: 'scatter',
        symbolSize: (val: any) => Math.max(val[2] / 2, 6 * textScalar), // scale for visibility
        data: data.map(d => [d.shift, d.pressureLevel, d.satisfaction]),
        itemStyle: {
          color: 'var(--chart-1)',
          borderColor: 'var(--chart-1)',
          borderWidth: 1,
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            color: 'var(--chart-2)', // hover color
            borderColor: '#ffffff',
            borderWidth: 1.5,
          },
        },
        label: {
          show: true,
          formatter: (p: any) => `${p.value[2]}%`,
          color: isDark ? '#e5e7eb' : '#111827',
          fontSize: 9 * textScalar,
        },
      },
    ],
    grid: { left: '2%', right: '10%', top: '18%', bottom: '5%', containLabel: true },
  };

  useEffect(() => {
    const chart = chartRef.current?.getEchartsInstance();
    chart?.resize();
  }, [textScalar, iScalar]);

  return (
    <div className="w-full h-full text-card-foreground flex flex-col gap-6 rounded-xl px-2 relative">
      {i18n.language === 'en' ? (
        <SatisfactionByShiftPressureDialogEN data={data} />
      ) : (
        <SatisfactionByShiftPressureDialogAR data={data} />
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
