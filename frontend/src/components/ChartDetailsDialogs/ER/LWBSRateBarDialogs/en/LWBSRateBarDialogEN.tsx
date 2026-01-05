import { ChartDetailsDialog } from '@/components/DetailsOverlay/ChartDetailsDialog';
import { Button } from '@/components/ui/button';
import { useResponsiveScalars } from '@/hooks/useResponsiveScalars';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface LWBSRateBarProps {
  sections: string[];
  lwbsRates: number[];
}

const LWBSRateBarDialogEN: React.FC<LWBSRateBarProps> = ({ sections, lwbsRates }) => {
  const { t } = useTranslation();
  const { textScalar } = useResponsiveScalars();

  return (
    <ChartDetailsDialog
      title={t("er.charts.lwbsRate.title")}
      trigger={
        <Button
          variant="text"
          className="absolute top-[5%] inset-x-0 active:ring-0 z-30"
        >
          <h1
            className="absolute mx-auto font-bold"
            style={{ fontSize: `${13 * textScalar}px` }}
          >
            {t("er.charts.lwbsRate.title")}
          </h1>
        </Button>
      }

      summary={
        <div
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
          className="space-y-3"
        >
          <p>
            The <strong>LWBS Rate (Left Without Being Seen)</strong> chart shows the
            distribution of patients who left the Emergency Department before
            receiving medical care, segmented by <strong>ER section</strong>.
          </p>

          <p>
            This KPI is used to identify <strong>patient experience failure points</strong>
            and uncover structural issues such as operational bottlenecks or poor
            patient flow — not to evaluate individual staff performance.
          </p>

          <ul className="list-disc pl-4 space-y-2">
            <li>
              <strong>ER Section:</strong> The area or unit where the patient was registered.
            </li>
            <li>
              <strong>LWBS Rate:</strong> Percentage of patients who left before being seen.
            </li>
          </ul>

          <p className="text-muted-foreground">
            Elevated LWBS rates are a direct indicator of deteriorating patient
            experience, long wait times, or ineffective communication.
          </p>
        </div>
      }

      dataAndFilters={
        <div
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
          className="space-y-4"
        >
          <p>
            The table below summarizes the <strong>LWBS rate</strong> for each
            Emergency Department section during the selected analysis period.
            Rates are calculated using all completed visit records.
          </p>

          <table
            className="w-full text-sm border-collapse border border-border"
            style={{
              fontSize: `${14 * textScalar}px`,
              lineHeight: 1.5,
            }}
          >
            <thead className="bg-muted/50">
              <tr>
                <th className="border p-2 text-left">Section</th>
                <th className="border p-2 text-right">LWBS Rate (%)</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section, idx) => (
                <tr key={section}>
                  <td className="border p-2 text-left">{section}</td>
                  <td
                    className={`border p-2 text-right ${
                      lwbsRates[idx] > 5
                        ? "text-red-600 dark:text-red-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {lwbsRates[idx]}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-2 text-muted-foreground">
            <p className="font-medium mb-1">Active Filters:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Date Range: <strong>Current Quarter</strong></li>
              <li>Department: <strong>All ER Sections</strong></li>
              <li>Visits: <strong>Completed visits only</strong></li>
            </ul>
          </div>

          <p className="text-muted-foreground">
            <em>
              Data Source: Emergency Visit Management System — derived from visit
              records and LWBS event logs.
            </em>
          </p>
        </div>
      }

      insights={
        <div
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
          className="space-y-3"
        >
          <p className="font-semibold text-foreground">
            <strong>Key Observations & Insights</strong>
          </p>

          <ul className="list-disc pl-4 space-y-2">
            <li>
              <strong>Risk Hotspots:</strong> Sections with high LWBS rates represent
              experience breakdown points requiring immediate intervention.
            </li>

            <li>
              <strong>Structural Issues:</strong> Elevated LWBS is commonly linked to
              staffing shortages, weak triage, or prolonged waiting times.
            </li>

            <li>
              <strong>Flow Optimization:</strong> LWBS can be reduced by improving
              early triage, reallocating resources, and strengthening patient communication.
            </li>

            <li>
              <strong>Quality Indicator:</strong> This metric reflects system-level
              experience quality rather than individual clinician performance.
            </li>
          </ul>

          <p className="text-muted-foreground">
            Reducing LWBS rates signals meaningful improvement in Emergency Department
            efficiency and patient experience quality.
          </p>

          <p className="italic text-muted-foreground pt-1">
            Tip: Correlate this KPI with First Contact Time to understand the
            relationship between waiting and early departure.
          </p>
        </div>
      }
    />
  );
};

export default LWBSRateBarDialogEN;
