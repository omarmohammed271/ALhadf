import { ChartDetailsDialog } from '@/components/DetailsOverlay/ChartDetailsDialog';
import { Button } from '@/components/ui/button';
import { useResponsiveScalars } from '@/hooks/useResponsiveScalars';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    lengthsOfStay: number[];      // X-axis
    satisfactionScores: number[]; // Y-axis
    threshold?: number;
}

const LOSvsSatisfactionDialogEN: React.FC<Props> = ({ lengthsOfStay, satisfactionScores, threshold }) => {
    const { t } = useTranslation();
    const { textScalar, iScalar } = useResponsiveScalars();

    return (
        <ChartDetailsDialog
            title={t("er.charts.losVsSatisfaction.title")}
            trigger={
                <Button
                    variant="text"
                    className="absolute top-[5%] inset-x-0 active:ring-0 z-30"
                >
                    <h1
                        className="absolute mx-auto font-bold"
                        style={{ fontSize: `${13 * textScalar}px` }}
                    >
                        {t("er.charts.losVsSatisfaction.title")}
                    </h1>
                </Button>
            }
            summary={
                <div
                    style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
                    className="space-y-3"
                >
                    <p>
                        The <strong>Length of Stay vs Patient Satisfaction</strong> chart shows the relationship between the time spent in the emergency department and patient satisfaction.
                        This analysis helps identify critical tolerance points that affect the patient experience.
                    </p>

                    <p>
                        Each point on the chart represents an individual visit, with the horizontal axis showing <strong>Length of Stay (LOS)</strong> and the vertical axis showing <strong>Satisfaction Score</strong>.
                        A sharp drop in satisfaction after certain points indicates critical tolerance thresholds.
                    </p>

                    <ul className="list-disc pl-4">
                        <li><strong>LOS:</strong> Number of minutes or hours spent in the department.</li>
                        <li><strong>Satisfaction:</strong> Patient experience rating, usually on a 0–100 scale.</li>
                        <li><strong>Tolerance Points:</strong> A threshold line can be added to indicate where satisfaction starts to drop.</li>
                    </ul>

                    <p className="text-muted-foreground">
                        This visualization enables patient experience analysts and managers to understand the relationship between LOS and satisfaction and take corrective actions when needed.
                    </p>
                </div>
            }
            dataAndFilters={
                <div
                    style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
                    className="space-y-4"
                >
                    <p>
                        The dataset includes all visits recorded during the selected period with associated satisfaction scores. Incomplete data has been excluded to ensure accuracy.
                    </p>

                    <table
                        className="w-full text-sm border-collapse border border-border"
                        style={{ fontSize: `${14 * textScalar}px`, lineHeight: 1.5 }}
                    >
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="border p-2 text-left">Visit</th>
                                <th className="border p-2 text-right">Length of Stay (minutes)</th>
                                <th className="border p-2 text-right">Satisfaction</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lengthsOfStay.map((los, idx) => (
                                <tr key={idx}
                                className={`border p-2 text-right ${
                                    threshold ?
                                    satisfactionScores[idx] < threshold
                                      ? "text-red-600 dark:text-red-400"
                                      : "text-muted-foreground"
                                    : ""
                                  }`}
                                >
                                    <td className="border p-2">{idx + 1}</td>
                                    <td className="border p-2 text-right">{los}</td>
                                    <td className="border p-2 text-right">{satisfactionScores[idx]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="pt-2 text-muted-foreground">
                        <p className="font-medium mb-1">Active Filters:</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>Date Range: <strong>Current Quarter (Q4 2025)</strong></li>
                            <li>Department: <strong>Emergency Department</strong></li>
                            <li>Completed visits only</li>
                        </ul>
                    </div>

                    <p className="text-muted-foreground">
                        <em>Data Source: Patient Management System + aggregated satisfaction surveys per visit.</em>
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
                            <strong>Critical Tolerance Points:</strong> Satisfaction drops after certain LOS points, highlighting areas for process improvement or waiting time management.
                        </li>
                        <li>
                            <strong>Long Visits:</strong> Patients with extended stays show noticeably lower satisfaction.
                        </li>
                        <li>
                            <strong>Improvement Opportunities:</strong> This data can help identify peak times and optimize resources to enhance patient experience.
                        </li>
                        {threshold && (
                            <li>
                                <strong>Defined Threshold:</strong> The red line indicates the LOS limit after which satisfaction begins to decline.
                            </li>
                        )}
                    </ul>

                    <p className="text-muted-foreground">
                        Tracking the LOS vs satisfaction relationship supports informed operational decisions and improves service quality.
                    </p>

                    <p className="italic text-muted-foreground pt-1">
                        Tip: Combine this analysis with other patient experience metrics, such as Average Time to First Communication, for a comprehensive view.
                    </p>
                </div>
            }
        />
    );
};

export default LOSvsSatisfactionDialogEN;
