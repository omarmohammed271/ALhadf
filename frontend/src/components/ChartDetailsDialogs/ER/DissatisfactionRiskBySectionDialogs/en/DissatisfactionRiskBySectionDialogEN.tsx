import { ChartDetailsDialog } from '@/components/DetailsOverlay/ChartDetailsDialog';
import { Button } from '@/components/ui/button';
import { useResponsiveScalars } from '@/hooks/useResponsiveScalars';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ERSectionRisk {
  section: string;
  riskScore: number; // 0-100
}

interface DissatisfactionRiskBySectionDialogENProps {
  data: ERSectionRisk[];
}

const DissatisfactionRiskBySectionDialogEN: React.FC<DissatisfactionRiskBySectionDialogENProps> = ({ data }) => {
  const { t } = useTranslation();
  const { textScalar } = useResponsiveScalars();

  return (
    <ChartDetailsDialog
      title={t("er.charts.dissatisfactionRiskBySection.title")}
      trigger={
        <Button
          variant="text"
          className="absolute top-[5%] inset-x-0 active:ring-0 z-30"
        >
          <h1
            className="absolute mx-auto font-bold"
            style={{ fontSize: `${13 * textScalar}px` }}
          >
            {t("er.charts.dissatisfactionRiskBySection.title")}
          </h1>
        </Button>
      }
      summary={
        <div
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
          className="space-y-3 text-left"
        >
          <p>
            The <strong>Dissatisfaction Risk by ER Section</strong> chart ranks emergency department sections 
            based on their patient dissatisfaction risk scores. This visualization helps identify areas requiring urgent improvement.
          </p>

          <p>
            Each bar represents the risk level for a specific section, with higher bars indicating a greater likelihood of patient dissatisfaction.
          </p>

          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Section:</strong> The ER section name.</li>
            <li><strong>Risk Score:</strong> Risk level from 0 to 100, where a higher number indicates higher risk of dissatisfaction.</li>
          </ul>

          <p className="text-muted-foreground">
            This chart supports management in prioritizing resources toward sections most at risk for patient dissatisfaction.
          </p>
        </div>
      }
      dataAndFilters={
        <div
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
          className="space-y-4 text-left"
        >
          <p>
            The table below shows the risk scores for each ER section.
          </p>

          <table
            dir="ltr"
            className="w-full text-sm border-collapse border border-border"
            style={{
              fontSize: `${14 * textScalar}px`,
              lineHeight: 1.5,
            }}
          >
            <thead className="bg-muted/50">
              <tr>
                <th className="border p-2 text-left">Section</th>
                <th className="border p-2 text-left">Risk Score</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.section}>
                  <td className="border p-2">{d.section}</td>
                  <td className="border p-2">{d.riskScore.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-2 text-muted-foreground">
            <p className="font-medium mb-1">Active Filters:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Date Range: <strong>Last 3 months</strong></li>
              <li>Department: <strong>Emergency Department</strong></li>
              <li>Data Source: <strong>Risk model and historical performance analysis</strong></li>
              <li>Metric: <strong>Patient Dissatisfaction Risk Index</strong></li>
            </ul>
          </div>

          <p className="text-muted-foreground">
            <em>
              Data Source: ER management system and risk model analytics.
            </em>
          </p>
        </div>
      }
      insights={
        <div
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
          className="space-y-3 text-left"
        >
          <p className="font-semibold text-foreground">
            <strong>Key Observations and Insights</strong>
          </p>

          <ul className="list-disc pl-4 space-y-2">
            <li>
              <strong>High-risk sections:</strong> Sections with high risk scores indicate urgent need for improving patient experience.
            </li>
            <li>
              <strong>Prioritization:</strong> The chart helps identify which sections require immediate management intervention.
            </li>
            <li>
              <strong>Strategic planning:</strong> This chart can be combined with other KPIs to allocate resources more effectively.
            </li>
            <li>
              <strong>Performance monitoring:</strong> Regularly tracking these indicators reduces dissatisfaction risks and improves service quality.
            </li>
          </ul>

          <p className="text-muted-foreground">
            Leveraging this chart helps management make data-driven decisions to enhance patient experience in the emergency department.
          </p>

          <p className="italic text-muted-foreground pt-1">
            Note: Compare this chart with revisit or complaint metrics to fully understand the operational impact on patient satisfaction.
          </p>
        </div>
      }
    />
  );
};

export default DissatisfactionRiskBySectionDialogEN;
