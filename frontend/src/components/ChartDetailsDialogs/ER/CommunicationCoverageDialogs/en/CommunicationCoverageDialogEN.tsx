import { ChartDetailsDialog } from '@/components/DetailsOverlay/ChartDetailsDialog';
import { Button } from '@/components/ui/button';
import { useResponsiveScalars } from '@/hooks/useResponsiveScalars';
import React from 'react';
import { useTranslation } from 'react-i18next';

const CommunicationCoverageDialogEN: React.FC<{
  sections: string[];
  coverage: number[];
  threshold: number;
}> = ({ sections, coverage, threshold }) => {
  const { t } = useTranslation();
  const { textScalar } = useResponsiveScalars();

  return (
    <ChartDetailsDialog
      title={t("er.charts.communicationCoverage.title")}
      trigger={
        <Button
          variant="text"
          className="absolute top-[5%] inset-x-0 active:ring-0 z-30"
        >
          <h1
            className="absolute mx-auto font-bold"
            style={{ fontSize: `${13 * textScalar}px` }}
          >
            {t("er.charts.communicationCoverage.title")}
          </h1>
        </Button>
      }
      summary={
        <div
          className="space-y-3"
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
        >
          <p>
            The <strong>Communication Coverage Rate</strong> chart shows the percentage of ER visits during which communication with patients occurred across different sections. 
            This metric helps measure consistency in patient reassurance and ensures a safer, more satisfying patient experience.
          </p>
          <p>
            Sections with low coverage percentages are at higher risk of patient dissatisfaction and may require operational improvements and staff training.
          </p>
        </div>
      }
      dataAndFilters={
        <div
          className="space-y-4"
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
        >
          <p>
            The data in this chart represents the proportion of visits in which patients were communicated with for each ER section.
          </p>

          <table
            className="w-full text-sm border-collapse border border-border"
            style={{ fontSize: `${14 * textScalar}px`, lineHeight: 1.5 }}
          >
            <thead className="bg-muted/50">
              <tr>
                <th className="border p-2 text-left">Section</th>
                <th className="border p-2 text-right">Coverage (%)</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((sec, i) => (
                <tr key={sec}>
                  <td className="border p-2">{sec}</td>
                  <td
                    className={`border p-2 text-right ${
                      threshold ?
                      coverage[i] < threshold
                        ? "text-red-600 dark:text-red-400"
                        : "text-muted-foreground"
                      : ""
                    }`}
                  >{coverage[i]}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-muted-foreground">
            <em>Target threshold: {threshold}%</em>
          </p>
        </div>
      }
      insights={
        <div
          className="space-y-3"
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
        >
          <p className="font-semibold text-foreground">
            <strong>Key Insights</strong>
          </p>

          <ul className="list-disc pl-4 space-y-2">
            <li>
              Sections achieving coverage close to 100% indicate consistent patient communication and higher satisfaction.
            </li>
            <li>
              Sections below the target threshold ({threshold}%) may need process review and staff support to improve coverage.
            </li>
            <li>
              Tracking this metric regularly can improve patient experience and reduce complaints related to lack of communication.
            </li>
          </ul>

          <p className="italic text-muted-foreground pt-1">
            Tip: Combine this metric with patient satisfaction scores and waiting times for a comprehensive performance view.
          </p>
        </div>
      }
    />
  );
};

export default CommunicationCoverageDialogEN;
