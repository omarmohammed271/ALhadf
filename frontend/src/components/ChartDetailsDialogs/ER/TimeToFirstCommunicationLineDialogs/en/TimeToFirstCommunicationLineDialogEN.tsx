import { ChartDetailsDialog } from '@/components/DetailsOverlay/ChartDetailsDialog';
import { Button } from '@/components/ui/button';
import { useResponsiveScalars } from '@/hooks/useResponsiveScalars';
import React from 'react';
import { useTranslation } from 'react-i18next';

const TimeToFirstCommunicationLineDialogEN: React.FC<{ sections: string[], avgMinutes: number[], threshold: number }> = ({ sections, avgMinutes, threshold }) => {
  const { t } = useTranslation();
  const { textScalar } = useResponsiveScalars();

  return (
    <ChartDetailsDialog
      title={t("er.charts.timeToFirstCommunication.title")}
      trigger={
        <Button
          variant="text"
          className="absolute top-[5%] inset-x-0 active:ring-0 z-30"
        >
          <h1
            className="absolute mx-auto font-bold"
            style={{ fontSize: `${13 * textScalar}px` }}
          >
            {t("er.charts.timeToFirstCommunication.title")}
          </h1>
        </Button>
      }
      summary={
        <div className="space-y-3" style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}>
          <p>
            The <strong>Time to First Communication</strong> chart visualizes the average time in minutes it takes for the ER staff to make the first contact with patients after arrival. 
            It measures responsiveness and helps identify delays in patient care.
          </p>
          <p>
            Longer delays are strongly correlated with higher rates of patients leaving without being seen (LWBS), highlighting operational bottlenecks or staffing issues.
          </p>
          <ul className="list-disc pl-4">
            <li><strong>Date:</strong> Day of visit</li>
            <li><strong>Average Time:</strong> Minutes to first communication per day</li>
            <li><strong>Threshold:</strong> Maximum recommended response time (shown as red dashed line)</li>
          </ul>
          <p className="text-muted-foreground">
            This visualization assists ER managers in identifying peak periods of delayed responsiveness and supports targeted operational improvements.
          </p>
        </div>
      }
      dataAndFilters={
        <div className="space-y-4" style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}>
          <p>
            Data is aggregated by day, showing the average minutes to first contact per patient. 
            Only completed visits are included to ensure accuracy in the metric.
          </p>

          <table
            className="w-full text-sm border-collapse border border-border"
            style={{ fontSize: `${14 * textScalar}px`, lineHeight: 1.5 }}
          >
            <thead className="bg-muted/50">
              <tr>
                <th className="border p-2 text-left">Date</th>
                <th className="border p-2 text-right">Avg Time (minutes)</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((date, i) => (
                <tr key={date}>
                  <td className="border p-2">{date}</td>
                  <td className={`border p-2 text-right ${
                      threshold ?
                      avgMinutes[i] > threshold
                        ? "text-red-600 dark:text-red-400"
                        : "text-muted-foreground"
                      : ""
                    }`}
                  >
                    {avgMinutes[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-2 text-muted-foreground">
            <p className="font-medium mb-1">Active Filters:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Date Range: <strong>Selected period</strong></li>
              <li>Visit Status: <strong>Completed visits only</strong></li>
              <li>Unit: <strong>Minutes</strong></li>
            </ul>
          </div>

          <p className="text-muted-foreground">
            <em>Data Source: ER Visit Logs and Communication Events</em>
          </p>
        </div>
      }
      insights={
        <div className="space-y-3" style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}>
          <p className="font-semibold text-foreground">
            <strong>Key Insights</strong>
          </p>
          <ul className="list-disc pl-4 space-y-2">
            <li>
              Days with average times exceeding the threshold indicate periods of delayed responsiveness that could increase LWBS rates.
            </li>
            <li>
              Consistent monitoring of first contact times helps optimize staff allocation and ER workflows.
            </li>
            <li>
              Identifying recurring delays can inform process improvements, training, or resource adjustments.
            </li>
            <li>
              Comparison against historical trends helps anticipate high-demand periods and mitigate delays proactively.
            </li>
          </ul>
          <p className="text-muted-foreground italic pt-1">
            Tip: Combine this chart with patient satisfaction and LWBS data for a full operational view.
          </p>
        </div>
      }
    />
  );
};

export default TimeToFirstCommunicationLineDialogEN;
