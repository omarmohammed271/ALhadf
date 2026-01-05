import { ChartDetailsDialog } from '@/components/DetailsOverlay/ChartDetailsDialog';
import { Button } from '@/components/ui/button';
import { useResponsiveScalars } from '@/hooks/useResponsiveScalars';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface FirstContactDelayLineProps {
  buckets: string[];         // X-axis labels (time to first contact)
  avgSatisfaction: number[]; // Y-axis values (average satisfaction)
  threshold?: number;        // Optional horizontal threshold
}

const FirstContactDelayLineDialogEN: React.FC<FirstContactDelayLineProps> = ({ buckets, avgSatisfaction, threshold }) => {
  const { t } = useTranslation();
  const { textScalar } = useResponsiveScalars();

  return (
    <ChartDetailsDialog
      title={t("er.charts.firstContactDelay.title")}
      trigger={
        <Button
          variant="text"
          className="absolute top-[5%] inset-x-0 active:ring-0 z-30"
        >
          <h1
            className="absolute mx-auto font-bold"
            style={{ fontSize: `${13 * textScalar}px` }}
          >
            {t("er.charts.firstContactDelay.title")}
          </h1>
        </Button>
      }
      summary={
        <div style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }} className="space-y-3">
          <p>
            The <strong>First Contact Delay Impact</strong> chart shows the relationship between
            the time to first contact in the Emergency Department and patient satisfaction.
            It highlights how early delays affect overall patient experience.
          </p>

          <p>
            Each point represents a group of visits (bucketed by delay time), where the horizontal axis
            indicates <strong>time to first contact</strong> and the vertical axis shows <strong>average satisfaction</strong>.
            Significant drops in satisfaction after certain thresholds indicate critical tolerance limits.
          </p>

          <ul className="list-disc pl-4">
            <li><strong>Time to First Contact:</strong> The duration between patient arrival and initial provider interaction.</li>
            <li><strong>Average Satisfaction:</strong> Mean patient satisfaction score, typically 0–100.</li>
            <li><strong>Thresholds:</strong> Optional horizontal line marking a critical satisfaction drop point.</li>
          </ul>

          <p className="text-muted-foreground">
            This visualization helps ED analysts and managers identify early experience bottlenecks and implement improvements.
          </p>
        </div>
      }
      dataAndFilters={
        <div style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }} className="space-y-4">
          <p>
            The dataset includes all recorded visits within the selected period along with their associated satisfaction scores.
            Incomplete or missing data have been excluded to ensure accuracy.
          </p>

          <table className="w-full text-sm border-collapse border border-border"
            style={{ fontSize: `${14 * textScalar}px`, lineHeight: 1.5 }}
          >
            <thead className="bg-muted/50">
              <tr>
                <th className="border p-2 text-left">Bucket</th>
                <th className="border p-2 text-right">Average Satisfaction</th>
              </tr>
            </thead>
            <tbody>
              {buckets.map((bucket, idx) => (
                <tr key={bucket}>
                  <td className="border p-2 text-left">{bucket}</td>
                  <td 
                    className={`border p-2 text-right ${
                      threshold ?
                      avgSatisfaction[idx] < threshold
                        ? "text-red-600 dark:text-red-400"
                        : "text-muted-foreground"
                      : ""
                    }`}
                  >{avgSatisfaction[idx]}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-2 text-muted-foreground">
            <p className="font-medium mb-1">Active Filters:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Date Range: <strong>Current Quarter (Q4 2025)</strong></li>
              <li>Department: <strong>Emergency Department</strong></li>
              <li>Completed Visits Only</li>
            </ul>
          </div>

          <p className="text-muted-foreground">
            <em>Data Source: Patient Management System + aggregated satisfaction surveys per visit.</em>
          </p>
        </div>
      }
      insights={
        <div style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }} className="space-y-3">
          <p className="font-semibold text-foreground"><strong>Key Observations & Insights</strong></p>

          <ul className="list-disc pl-4 space-y-2">
            <li>
              <strong>Critical Tolerance Points:</strong> Satisfaction declines sharply after certain first contact delays, indicating areas for process improvement.
            </li>
            <li>
              <strong>Long Waits:</strong> Visits with extended first contact times consistently show lower satisfaction.
            </li>
            <li>
              <strong>Improvement Opportunities:</strong> Use these insights to adjust staffing, triage, and workflow to enhance patient experience.
            </li>
            {threshold && (
              <li>
                <strong>Threshold:</strong> The red line indicates the delay after which satisfaction begins to drop significantly.
              </li>
            )}
          </ul>

          <p className="text-muted-foreground">
            Monitoring the impact of first contact delays allows managers to make informed operational decisions and improve patient experience quality.
          </p>

          <p className="italic text-muted-foreground pt-1">
            Tip: Combine this analysis with other ED performance metrics, such as response times, for a comprehensive view.
          </p>
        </div>
      }
    />
  );
};

export default FirstContactDelayLineDialogEN;