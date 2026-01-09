import { ChartDetailsDialog } from "@/components/DetailsOverlay/ChartDetailsDialog";
import { Button } from "@/components/ui/button";
import { useResponsiveScalars } from "@/hooks/useResponsiveScalars";
import React from "react";
import { useTranslation } from "react-i18next";

type TrendPoint = {
  section: string;
  avgMinutes: number;
};

const ArrivalToFirstContactDialogEN: React.FC<{
  data: TrendPoint[];
  granularity: "daily" | "weekly";
  threshold?: number;
}> = ({ data, granularity, threshold }) => {
  const { t } = useTranslation();
  const { textScalar } = useResponsiveScalars();

  const average =
    data.length > 0
      ? (
          data.reduce((sum, d) => sum + d.avgMinutes, 0) / data.length
        ).toFixed(1)
      : "0";

  const max = Math.max(...data.map((d) => d.avgMinutes), 0);

  return (
    <ChartDetailsDialog
      title={t("er.charts.arrivalToFirstContact.title")}
      trigger={
        <Button
          variant="text"
          className="absolute top-[5%] inset-x-0 active:ring-0 z-30"
        >
          <h1
            className="absolute mx-auto font-bold"
            style={{ fontSize: `${13 * textScalar}px` }}
          >
            {t("er.charts.arrivalToFirstContact.title")}
          </h1>
        </Button>
      }

      /* ================= SUMMARY ================= */
      summary={
        <div
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
          className="space-y-3"
        >
          <p>
            This KPI measures the <strong>average time from patient arrival</strong> in
            the Emergency Department to the <strong>first clinical contact</strong> with
            a physician or nurse. It is one of the strongest indicators of the
            patient’s <strong>first impression</strong> of the ER experience.
          </p>

          <p>
            This metric does not reflect treatment quality, but rather whether the
            patient feels <strong>acknowledged, seen, and reassured</strong> early in
            their journey. Delays at this stage are often perceived as neglect,
            even when downstream care is appropriate.
          </p>

          <p className="text-muted-foreground">
            Sustained increases in this KPI signal deterioration in access experience
            and significantly elevate dissatisfaction and walkout risk.
          </p>
        </div>
      }

      /* ================= DATA & FILTERS ================= */
      dataAndFilters={
        <div
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
          className="space-y-4"
        >
          <p>
            Values are calculated as the time difference between the{" "}
            <strong>arrival timestamp</strong> and the{" "}
            <strong>first documented clinical interaction</strong> for each ER visit,
            then averaged by{" "}
            <strong>{granularity === "daily" ? "day" : "week"}</strong>.
          </p>

          <table
            className="w-full text-sm border-collapse border border-border"
            style={{ fontSize: `${14 * textScalar}px`, lineHeight: 1.5 }}
          >
            <thead className="bg-muted/50">
              <tr>
                <th className="border p-2 text-left">Period</th>
                <th className="border p-2 text-right">
                  Avg. Minutes
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.section}>
                  <td className="border p-2">{row.section}</td>
                  <td 
                    className={`border p-2 text-right ${
                      threshold ?
                      row.avgMinutes > threshold
                        ? "text-red-600 dark:text-red-400"
                        : "text-muted-foreground"
                      : ""
                    }`}
                  >
                    {row.avgMinutes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-2 text-muted-foreground">
            <p className="font-medium mb-1">Active Filters:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Visit Type: <strong>Emergency visits only</strong></li>
              <li>Visit Status: <strong>Completed</strong></li>
              <li>
                Aggregation Level:{" "}
                <strong>
                  {granularity === "daily" ? "Daily" : "Weekly"}
                </strong>
              </li>
            </ul>
          </div>

          <p className="text-muted-foreground">
            <em>
              Data Source: Hospital Information System (HIS / EMR) — visit-level timestamps.
            </em>
          </p>
        </div>
      }

      /* ================= INSIGHTS ================= */
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
              <strong>Overall Average:</strong> The mean time from arrival to first
              clinical contact is <strong>{average} minutes</strong>.
            </li>

            <li>
              <strong>Peak Delay:</strong> A maximum delay of{" "}
              <strong>{max} minutes</strong> was observed, representing a potential
              experience risk point.
            </li>

            {threshold && (
              <li>
                <strong>Threshold Comparison:</strong>{" "}
                {Number(average) > threshold ? (
                  <>
                    The current average <strong>exceeds</strong> the defined threshold
                    ({threshold} minutes), indicating{" "}
                    <strong>elevated patient experience risk</strong>.
                  </>
                ) : (
                  <>
                    The current average remains <strong>within</strong> the acceptable
                    threshold ({threshold} minutes), though upward trends should be
                    closely monitored.
                  </>
                )}
              </li>
            )}

            <li>
              <strong>Operational Interpretation:</strong> Spikes in this KPI are commonly
              associated with triage congestion, nursing shortages, or poor initial
              communication workflows.
            </li>
          </ul>

          <p className="text-muted-foreground">
            This KPI should always be reviewed alongside{" "}
            <strong>communication events</strong> and{" "}
            <strong>LWBS rates</strong>, as waiting without communication is the
            strongest driver of dissatisfaction.
          </p>

          <p className="italic text-muted-foreground pt-1">
            Note: This metric serves as an early warning signal for experience breakdown,
            not as a measure of clinical decision quality.
          </p>
        </div>
      }
    />
  );
};

export default ArrivalToFirstContactDialogEN;
