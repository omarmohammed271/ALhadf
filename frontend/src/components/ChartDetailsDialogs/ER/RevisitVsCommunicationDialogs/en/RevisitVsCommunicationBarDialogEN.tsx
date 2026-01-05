import { ChartDetailsDialog } from '@/components/DetailsOverlay/ChartDetailsDialog';
import { Button } from '@/components/ui/button';
import { useResponsiveScalars } from '@/hooks/useResponsiveScalars';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface RevisitVsCommunicationBarProps {
  categories: string[];      // Yes / No
  revisitRates: number[];    // %
  threshold: any;
}

const RevisitVsCommunicationBarDialogEN: React.FC<RevisitVsCommunicationBarProps> = ({
  categories,
  revisitRates,
  threshold
}) => {
  const { t } = useTranslation();
  const { textScalar } = useResponsiveScalars();

  return (
    <ChartDetailsDialog
      title={t("er.charts.revisitVsCommunication.title")}
      trigger={
        <Button
          variant="text"
          className="absolute top-[5%] inset-x-0 active:ring-0 z-30"
        >
          <h1
            className="absolute mx-auto font-bold"
            style={{ fontSize: `${13 * textScalar}px` }}
          >
            {t("er.charts.revisitVsCommunication.title")}
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
            The <strong>Revisit Rate vs Communication Presence</strong> chart shows the
            relationship between providing clear communication to the patient during
            their ED visit and the likelihood of returning within a short period.
          </p>

          <p>
            This KPI measures <strong>clarity of clinical closure</strong> and the
            quality of information delivered to the patient, not clinical decisions
            or individual performance.
          </p>

          <ul className="list-disc pl-4 space-y-1">
            <li>
              <strong>Communication provided:</strong> The patient received clear
              instructions, guidance, or discharge explanations.
            </li>
            <li>
              <strong>No communication provided:</strong> Lack of explanation or
              poor guidance before patient departure.
            </li>
            <li>
              <strong>Revisit rate:</strong> Percentage of patients returning to
              the ED within a short time frame.
            </li>
          </ul>

          <p className="text-muted-foreground">
            High revisit rates may indicate poor understanding, uncertainty, or
            inadequate closure of the case.
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
            The table below shows the <strong>Revisit Rate</strong> based on whether
            clear communication was provided during the first visit.
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
                <th className="border p-2 text-left">Communication</th>
                <th className="border p-2 text-right">Revisit Rate (%)</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, idx) => (
                <tr key={category}>
                  <td className="border p-2 text-left">{category}</td>
                  <td
                    className={`border p-2 text-left ${
                      revisitRates[idx] > threshold
                        ? "text-red-600 dark:text-red-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {revisitRates[idx]}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-2 text-muted-foreground">
            <p className="font-medium mb-1">Active filters:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Date range: <strong>Current quarter</strong></li>
              <li>Visit type: <strong>ED visits only</strong></li>
              <li>Revisit period: <strong>Within 72 hours</strong></li>
            </ul>
          </div>

          <p className="text-muted-foreground">
            <em>
              Data source: Emergency Visits Management System — visit records and
              communication events logged during the patient journey.
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
            <strong>Key observations & insights</strong>
          </p>

          <ul className="list-disc pl-4 space-y-2">
            <li>
              <strong>No communication:</strong> Higher revisit rates when
              communication is absent indicate poor understanding or lack of patient reassurance.
            </li>

            <li>
              <strong>Clear closure:</strong> Providing clear explanations and
              discharge instructions directly reduces unnecessary return visits.
            </li>

            <li>
              <strong>Experience improvement:</strong> Enhancing communication
              and guidance is a low-cost, high-impact intervention.
            </li>

            <li>
              <strong>Care quality:</strong> This KPI is a measure of patient
              experience and clarity, not clinical decision-making.
            </li>
          </ul>

          <p className="text-muted-foreground">
            Reducing revisit rates linked to poor communication reflects genuine
            improvement in patient experience and confidence in care.
          </p>

          <p className="italic text-muted-foreground pt-1">
            Tip: Correlate this KPI with satisfaction surveys or complaints to
            understand the impact of communication on subsequent patient behavior.
          </p>
        </div>
      }
    />
  );
};

export default RevisitVsCommunicationBarDialogEN;
