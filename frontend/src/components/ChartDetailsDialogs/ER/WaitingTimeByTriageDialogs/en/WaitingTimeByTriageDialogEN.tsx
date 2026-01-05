import { ChartDetailsDialog } from '@/components/DetailsOverlay/ChartDetailsDialog';
import { Button } from '@/components/ui/button';
import { useResponsiveScalars } from '@/hooks/useResponsiveScalars';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface WaitingTimeByTriageDialogProps {
  data: { level: string, minutes: number[] }[]; // e.g., { "Level 1": [10,15,12], "Level 2": [20,25,18], ... }
  threshold: number;
}

const WaitingTimeByTriageDialogEN: React.FC<WaitingTimeByTriageDialogProps> = ({ data, threshold }) => {
  const { t } = useTranslation();
  const { textScalar } = useResponsiveScalars();

  // compute basic stats for table display
  const stats = data.map(({ level, minutes }) => {
    const count = minutes.length;
    const avg = count ? (minutes.reduce((a, b) => a + b, 0) / count).toFixed(1) : 0;
    const min = count ? Math.min(...minutes) : 0;
    const max = count ? Math.max(...minutes) : 0;
    return { level, count, avg, min, max };
  });

  return (
    <ChartDetailsDialog
      title={t("er.charts.waitingTimeByTriage.title")}
      trigger={
        <Button
          variant="text"
          className="absolute top-[5%] inset-x-0 active:ring-0 z-30"
        >
          <h1
            className="absolute mx-auto font-bold"
            style={{ fontSize: `${13 * textScalar}px` }}
          >
            {t("er.charts.waitingTimeByTriage.title")}
          </h1>
        </Button>
      }
      summary={
        <div
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
          className="space-y-3"
        >
          <p>
            The <strong>{t("er.charts.waitingTimeByTriage.title")}</strong> chart shows the distribution of patient waiting times by triage level. 
            This helps assess whether prioritization is applied fairly across different acuity levels.
          </p>

          <p className="text-muted-foreground">
            High spread in critical levels indicates an unsafe experience, while low spread in lower-acuity levels reflects efficient patient flow.
          </p>
        </div>
      }
      dataAndFilters={
        <div
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
          className="space-y-4"
        >
          <table
            className="w-full text-sm border-collapse border border-border"
            style={{ fontSize: `${14 * textScalar}px`, lineHeight: 1.5 }}
          >
            <thead className="bg-muted/50">
              <tr>
                <th className="border p-2 text-left">Triage Level</th>
                <th className="border p-2 text-right">Patient Count</th>
                <th className="border p-2 text-right">Min Wait</th>
                <th className="border p-2 text-right">Avg Wait</th>
                <th className="border p-2 text-right">Max Wait</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((s) => (
                <tr key={s.level}
                  className={`border p-2 text-right ${
                    threshold ?
                    Number(s.avg) > threshold
                      ? "text-red-600 dark:text-red-400"
                      : "text-muted-foreground"
                    : ""
                  }`}
                >
                  <td className="border p-2">{s.level}</td>
                  <td className="border p-2 text-right">{s.count}</td>
                  <td className="border p-2 text-right">{s.min} min</td>
                  <td className="border p-2 text-right">{s.avg} min</td>
                  <td className="border p-2 text-right">{s.max} min</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-2 text-muted-foreground">
            <p className="font-medium mb-1">Active Filters:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Time Threshold: <strong>{threshold} minutes</strong></li>
              <li>Date Range: <strong>Current Quarter</strong></li>
              <li>Department: <strong>Emergency</strong></li>
            </ul>
          </div>
        </div>
      }
      insights={
        <div
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
          className="space-y-3"
        >
          <p className="font-semibold text-foreground">
            <strong>Key Insights</strong>
          </p>

          <ul className="list-disc pl-4 space-y-2">
            <li>
              <strong>Critical Level Variability:</strong> High spread at critical levels indicates unsafe patient experience.
            </li>
            <li>
              <strong>Lower-Acuity Efficiency:</strong> Low variability suggests smooth patient flow for non-urgent cases.
            </li>
            <li>
              <strong>Continuous Monitoring:</strong> Helps detect bottlenecks and improve triage fairness.
            </li>
          </ul>

          <p className="italic text-muted-foreground pt-1">
            Tip: Combine this chart with arrival-time metrics for deeper operational insights.
          </p>
        </div>
      }
    />
  );
};

export default WaitingTimeByTriageDialogEN;
