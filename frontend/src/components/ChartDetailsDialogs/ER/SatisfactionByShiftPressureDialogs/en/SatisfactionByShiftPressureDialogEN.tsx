import { ChartDetailsDialog } from '@/components/DetailsOverlay/ChartDetailsDialog';
import { Button } from '@/components/ui/button';
import { useResponsiveScalars } from '@/hooks/useResponsiveScalars';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface SatisfactionDataPoint {
  shift: string;
  pressureLevel: string;
  satisfaction: number; // 0-100%
}

interface SatisfactionByShiftPressureDialogENProps {
  data: SatisfactionDataPoint[];
}

const SatisfactionByShiftPressureDialogEN: React.FC<SatisfactionByShiftPressureDialogENProps> = ({ data }) => {
  const { t } = useTranslation();
  const { textScalar } = useResponsiveScalars();

  const shifts = Array.from(new Set(data.map(d => d.shift)));
  const pressures = Array.from(new Set(data.map(d => d.pressureLevel)));

  return (
    <ChartDetailsDialog
      title={t("er.charts.satisfactionByShiftPressure.title")}
      trigger={
        <Button
          variant="text"
          className="absolute top-[3%] inset-x-0 active:ring-0 z-30"
        >
          <h1
            className="absolute mx-auto font-bold"
            style={{ fontSize: `${13 * textScalar}px` }}
          >
            {t("er.charts.satisfactionByShiftPressure.title")}
          </h1>
        </Button>
      }
      summary={
        <div
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
          className="space-y-3 text-left"
          dir="ltr"
        >
          <p>
            The <strong>Patient Satisfaction by Shift and Pressure Level</strong> chart shows
            the relationship between operating conditions and patient satisfaction in the ED.
            It helps identify situations where the patient experience is most vulnerable.
          </p>

          <p>
            Each bubble represents satisfaction in a given shift under a specific pressure level,
            with the bubble size reflecting the satisfaction percentage (0-100%).
          </p>

          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Shift:</strong> Time period of the shift (morning/afternoon/night).</li>
            <li><strong>Pressure Level:</strong> Department pressure at that shift (low, medium, high).</li>
            <li><strong>Patient Satisfaction:</strong> Percentage representing patient satisfaction with their experience.</li>
          </ul>

          <p className="text-muted-foreground">
            This chart helps management teams identify operating conditions that may negatively affect patient experience.
          </p>
        </div>
      }
      dataAndFilters={
        <div
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
          className="space-y-4 text-left"
          dir="ltr"
        >
          <p>
            The table below shows satisfaction data for each shift and pressure level in the ED.
          </p>

          <table
            className="w-full text-sm border-collapse border border-border"
            style={{
              fontSize: `${14 * textScalar}px`,
              lineHeight: 1.5,
            }}
            dir="ltr"
          >
            <thead className="bg-muted/50">
              <tr>
                <th className="border p-2 text-left">Pressure Level</th>
                <th className="border p-2 text-left">Shift</th>
                <th className="border p-2 text-left">Patient Satisfaction (%)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, idx) => (
                <tr key={idx}
                  className={
                    d.satisfaction < 50 ? 
                    `border-red-400 text-red-400`
                    : d.satisfaction < 80 ?
                    `border-amber-200 text-amber-200`
                    :
                    `border-green-300 text-green-300`
                  }
                >
                  <td className="border p-2">{d.pressureLevel}</td>
                  <td className="border p-2">{d.shift}</td>
                  <td className="border p-2 text-left">{d.satisfaction}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-2 text-muted-foreground">
            <p className="font-medium mb-1">Active Filters:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Date Range: <strong>Current Quarter</strong></li>
              <li>Department: <strong>Emergency Department</strong></li>
              <li>Satisfaction Metric: <strong>Collected from direct feedback and signals</strong></li>
            </ul>
          </div>

          <p className="text-muted-foreground">
            <em>
              Data Source: ED Management System — contextual data + patient satisfaction signals.
            </em>
          </p>
        </div>
      }
      insights={
        <div
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
          className="space-y-3 text-left"
          dir="ltr"
        >
          <p className="font-semibold text-foreground">
            <strong>Key Observations and Insights</strong>
          </p>

          <ul className="list-disc pl-4 space-y-2">
            <li>
              <strong>High Pressure Conditions:</strong> Clear drops in satisfaction are observed during high-pressure periods.
            </li>
            <li>
              <strong>Shift Impact:</strong> Some shifts are more prone to low satisfaction levels, indicating need for better resources or workflow adjustments.
            </li>
            <li>
              <strong>Risk Identification:</strong> The chart helps management prioritize interventions in times/locations of low satisfaction.
            </li>
            <li>
              <strong>Experience Improvement:</strong> Balancing resources during high-pressure shifts can reduce negative patient experiences.
            </li>
          </ul>

          <p className="text-muted-foreground">
            Regular monitoring of this metric enhances the ability to make operational decisions based on patient experience.
          </p>

          <p className="italic text-muted-foreground pt-1">
            Tip: Link this chart with revisit or complaint indicators to understand the full impact of operating conditions on patient experience.
          </p>
        </div>
      }
    />
  );
};

export default SatisfactionByShiftPressureDialogEN;
