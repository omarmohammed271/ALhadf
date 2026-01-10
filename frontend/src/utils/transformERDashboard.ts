// utils/transformERDashboard.ts
export const transformERDashboard = (data: any) => {
  return {
    // Main stats
    stats: {
      avgTimeToFirstContact: `${data.avg_time_to_first_contact.avg_time_to_first_contact?.toFixed(1)} min`,
      pctTimelyCommunication: `${data.timely_communication_pct.timely_communication_pct?.toFixed(0)}%`,
      overallSatisfaction: `${data.avg_satisfaction.avg_satisfaction?.toFixed(1)} / 5`,
      lwbsRate: `${data.lwbs_rate.lwbs_rate_pct?.toFixed(1)}%`,
      revisitRate72h: `${data.revisit_rate.revisit_rate_pct?.toFixed(1)}%`,
      highDissatisfactionRisk: `${data.high_risk_pct.high_risk_visit_pct?.toFixed(0)}%`,
    },

    // Trends
    arrivalToFirstContactTrend: data.arrival_to_first_contact_trend
      .map((d: any) => ({ section: d.er_section, avgMinutes: +d.avg_minutes?.toFixed(1) })),

    waitingTimeByTriage: data.waiting_time_by_triage
      .reduce((acc: any, item: any) => {
        const level = `Level ${item.triage_level}`;
        acc[level] = acc[level] || [];
        acc[level].push(+item.wait_minutes?.toFixed(0));
        return acc;
      }, {}),

    communicationCoverage: data.communication_coverage_by_er_section
      .map((d: any) => ({ section: d.er_section, coveragePct: +d.coverage_pct?.toFixed(0) })),

    firstCommunicationTrend: data.first_communication_trend
      .map((d: any) => ({
        section: d.er_section,
        avgMinutes: +d.avg_minutes_to_first_contact?.toFixed(1),
      })),

    losVsSatisfaction: data.los_vs_satisfaction
      .map((d: any) => ({
        losBucketMinutes: d.los_bucket_minutes,
        avgSatisfactionPct: +d.avg_satisfaction_pct?.toFixed(0),
      })),

    firstContactDelay: data.first_contact_delay_impact
      .map((d: any) => ({
        bucket: d.delay_bucket,
        avgSatisfaction: +d.avg_satisfaction_pct?.toFixed(0),
      })),

      lwbsBySection: data.lwbs_by_er_section.map((d: any) => ({
        section: d.er_section,
        lwbsRatePct: d.lwbs_rate,
      })),

    revisitVsCommunication: data.revisit_vs_communication
      .map((d: any) => ({
        communicationStatus: d.communication_status,
        revisitRatePct: +d.revisit_rate_pct?.toFixed(1),
      })),

    satisfactionByShift: data.satisfaction_by_shift
      .map((d: any) => ({
        shift: d.shift,
        pressureLevel: d.pressure_level,
        avgSatisfactionPct: +d.avg_satisfaction_pct?.toFixed(0),
      })),

    riskBySection: data.risk_by_er_section
      .map((d: any) => ({
        section: d.section,
        riskScore: +d.risk_score?.toFixed(0),
      })),
  };
};
