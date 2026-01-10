'use client';

import StatsCard from "@/components/Cards/StatsCards";
import { Clock, MessageCircle, Smile, UserX, AlertCircle, Repeat } from 'lucide-react';
import { useTranslation } from "react-i18next";
import ArrivalToFirstContactTrend from "@/components/Charts/ERDshboardCharts/ArrivalToFirstContactTrend";
import WaitingTimeByTriage from "@/components/Charts/ERDshboardCharts/WaitingTimeByTriage";
import CommunicationCoverageBar from "@/components/Charts/ERDshboardCharts/CommunicationCoverageBar";
import TimeToFirstCommunicationLine from "@/components/Charts/ERDshboardCharts/TimeToFirstCommunicationLine";
import LOSvsSatisfaction from "@/components/Charts/ERDshboardCharts/LOSvsSatisfaction";
import FirstContactDelayLine from "@/components/Charts/ERDshboardCharts/FirstContactDelayLine";
import LWBSRateBar from "@/components/Charts/ERDshboardCharts/LWBSRateBar";
import RevisitVsCommunicationBar from "@/components/Charts/ERDshboardCharts/RevisitVsCommunicationBar";
import SatisfactionByShiftPressure from "@/components/Charts/ERDshboardCharts/SatisfactionByShiftPressure";
import DissatisfactionRiskBySection from "@/components/Charts/ERDshboardCharts/DissatisfactionRiskBySection";
import { useERDashboard } from "@/api/endpoints/DashboardEndpoint";
import { Skeleton } from "@/components/ui/skeleton";
import { transformERDashboard } from "@/utils/transformERDashboard";

export default function ERDashboard() {
  const { t, i18n } = useTranslation();
  const {data: dashboardData, isPending} = useERDashboard()
  console.log(dashboardData);
  const transformed = dashboardData ? transformERDashboard(dashboardData) : null;
  console.log(transformed);

  type Language = "en" | "ar";
  type ERSection = "main" | "fasttrack" | "triage" | "trauma";


  const lang = i18n.language === "ar" ? "ar" : "en";
  const sectionLabelMap: Record<Language, Record<ERSection, string>> = {
    en: {
      main: "Main ER",
      fasttrack: "Fast Track",
      triage: "Triage",
      trauma: "Resuscitation",
    },
    ar: {
      main: "الطوارئ الرئيسية",
      fasttrack: "المسار السريع",
      triage: "الفرز",
      trauma: "الإنعاش",
    },
  };
  
  type DashboardData = typeof transformed
  if (isPending) {
    return (
      <div className="p-3 flex flex-col h-full space-y-2">
  
        {/* Stat cards skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-6 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[110px]" />
          ))}
        </div>
  
        {/* Charts skeleton */}
        <div className="grid flex-1 grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-3 flex flex-col  h-full space-y-2">

      {/* ── Stat Cards ── */}
      <div className="grid h-fit grid-cols-1 lg:grid-cols-2 xl:grid-cols-6 gap-2">

      <StatsCard
        className="border border-border h-full p-4 rounded-2xl"
        title={t('er.statCards.avgTimeToFirstContact')}
        value={`${transformed?.stats.avgTimeToFirstContact || 0}`}
        icon={<Clock />}
      />

      <StatsCard
        className="border border-border h-full p-4 rounded-2xl"
        title={t('er.statCards.pctTimelyCommunication')}
        value={`${transformed?.stats.pctTimelyCommunication || 0}`}
        icon={<MessageCircle />}
      />

      <StatsCard
        className="border border-border h-full p-4 rounded-2xl"
        title={t('er.statCards.overallPatientSatisfaction')}
        value={`${transformed?.stats.overallSatisfaction || 0}`}
        icon={<Smile />}
      />

      <StatsCard
        className="border border-border h-full p-4 rounded-2xl"
        title={t('er.statCards.lwbsRate')}
        value={`${transformed?.stats.lwbsRate || 0}`}
        icon={<UserX />}
      />

      <StatsCard
        className="border border-border h-full p-4 rounded-2xl"
        title={t('er.statCards.revisitRate72h')}
        value={`${transformed?.stats.revisitRate72h || 0}`}
        icon={<Repeat />}
      />

      <StatsCard
        className="border border-border h-full p-4 rounded-2xl"
        title={t('er.statCards.highDissatisfactionRisk')}
        value={`${transformed?.stats.highDissatisfactionRisk || 0}`}
        icon={<AlertCircle />}
      />


      </div>


      {/* Charts Section */}
      <div dir={"ltr"} className="space-y-2 md:grid flex-1 grid-cols-1 min-[2400px]:max-h-[85.5vh] *:*:h-125 *:*:xl:h-1/2 md:grid-cols-2 xl:grid-cols-5 gap-2">
        
        {/* Upper */}
        <div className=" flex flex-col space-y-2 col-span-1">
          <ArrivalToFirstContactTrend
            data={transformed?.arrivalToFirstContactTrend.slice(0, 5)}
            granularity="daily"
            threshold={20}
          />

          <WaitingTimeByTriage
            data={Object.entries(transformed?.waitingTimeByTriage).map(([level, minutesArray]) => ({
              level,
              minutes: (minutesArray as number[]).slice(0, 5),
            }))}
            threshold={30}
          />
        {/* <ArrivalToFirstContactTrend
            data={[
              { section: "Main ER", avgMinutes: 18 },
              { section: "Fast Track", avgMinutes: 21 },
              { section: "Trauma Bay", avgMinutes: 24 },
              { section: "Pediatrics", avgMinutes: 20 },
            ]}
            granularity="daily"   // or "weekly"
            threshold={20}
          />
          <WaitingTimeByTriage
            data={[
                { level: "Level 1", minutes: [5, 7, 8, 6, 10] },
                { level: "Level 2", minutes: [10, 12, 15, 11, 14] },
                { level: "Level 3", minutes: [20, 25, 18, 22, 30] },
                { level: "Level 4", minutes: [30, 35, 28, 32, 40] },
                { level: "Level 5", minutes: [40, 45, 42, 38, 50] },
            ]}
            threshold={30}
          /> */}
        </div>

        <div className=" flex flex-col space-y-2 col-span-1">
          <CommunicationCoverageBar
            sections={transformed?.communicationCoverage.map((d: any) => d.section)}
            coverage={transformed?.communicationCoverage.map((d: any) => d.coveragePct)}
            threshold={85}
          />

          <TimeToFirstCommunicationLine
            sections={transformed?.firstCommunicationTrend.map((d: any) => d.section)}
            avgMinutes={transformed?.firstCommunicationTrend.map((d: any) => d.avgMinutes)}
            threshold={15}
          />
          {/* <CommunicationCoverageBar
            sections={
              i18n.language === "en"
                ? ["Triage", "ER Room A", "ER Room B", "Observation", "ICU"]
                : ["الفرز", "غرفة الطوارئ أ", "غرفة الطوارئ ب", "الملاحظة", "العناية المركزة"]
            }
            coverage={[95, 80, 85, 70, 60]}  // % coverage per section
            threshold={85} 
          />
          <TimeToFirstCommunicationLine
            dates={["2025-10-01", "2025-10-02", "2025-10-03", "2025-10-04"]}
            avgMinutes={[12, 15, 10, 18]}
            threshold={15}
          /> */}

        </div>


        <div className=" flex flex-col space-y-2 col-span-1">
          <LOSvsSatisfaction
            lengthsOfStay={transformed?.losVsSatisfaction.map((d: any) => d.losBucketMinutes)}
            satisfactionScores={transformed?.losVsSatisfaction.map((d: any) => d.avgSatisfactionPct)}
            threshold={70}
          />

          <FirstContactDelayLine
            buckets={transformed?.firstContactDelay.map((d: any) => d.bucket)}
            avgSatisfaction={transformed?.firstContactDelay.map((d: any) => d.avgSatisfaction)}
            threshold={10}
          />
          {/* <LOSvsSatisfaction
            lengthsOfStay={[30, 45, 60, 75, 90, 120]}
            satisfactionScores={[95, 90, 85, 70, 60, 50]}
            threshold={70}    
          />
          <FirstContactDelayLine
            buckets={["0-5 min", "5-10 min", "10-15 min", "15-30 min", "30+ min"]}
            avgSatisfaction={[95, 88, 80, 70, 60]}
            threshold={10}
          /> */}
        </div>


        <div className=" flex flex-col gap-y-2 col-span-1">
          <LWBSRateBar
            sections={
              (transformed?.lwbsBySection ?? []).map((d: any) =>
                sectionLabelMap[lang][d.section as ERSection] ?? d.section
              )
            }
            lwbsRates={
              (transformed?.lwbsBySection ?? []).map(
                (d: any) => Number(d.lwbsRatePct)
              )
            }
            threshold={5}
          />

        <RevisitVsCommunicationBar
          categories={
            i18n.language === "en"
              ? transformed?.revisitVsCommunication.map((d: any) => d.communicationStatus)
              : ["تم التواصل", "لم يتم التواصل"] // map similarly if Arabic labels exist in data
          }
          revisitRates={transformed?.revisitVsCommunication.map((d: any) => d.revisitRatePct)}
          threshold={12}
        />
          {/* <LWBSRateBar
            sections={
              i18n.language === "en"
                ? ["Triage", "Fast Track", "Main ER", "Resuscitation"]
                : ["الفرز", "المسار السريع", "الطوارئ الرئيسية", "الإنعاش"]
            }
            lwbsRates={[3.2, 5.8, 9.4, 2.1]}
            threshold={5}
          />

          <RevisitVsCommunicationBar
            categories={
              i18n.language === "en"
                ? ["Communication Provided", "No Communication"]
                : ["تم التواصل", "لم يتم التواصل"]
            }
            revisitRates={[8.5, 18.2]}
            threshold={12}
          /> */}
        </div>


        <div className='md:flex mb-2 justify-center xl:flex-col max-xl:space-x-2 space-y-2 col-span-2 xl:col-span-1 p-2 bg-linear-to-br border-border from-primary/10 to-secondary/10 border rounded-xl '>
          <SatisfactionByShiftPressure
            data={transformed?.satisfactionByShift.map((d: any) => ({
              shift: d.shift,
              pressureLevel: d.pressureLevel,
              satisfaction: d.avgSatisfactionPct,
            }))}
          />

          <DissatisfactionRiskBySection
            data={transformed?.riskBySection.map((d: any) => ({
              section: d.section,
              riskScore: d.riskScore,
            }))}
          />

          {/* <SatisfactionByShiftPressure
            data={[
              { shift: 'Morning', pressureLevel: 'High', satisfaction: 62 },
              { shift: 'Afternoon', pressureLevel: 'High', satisfaction: 55 },
              { shift: 'Night', pressureLevel: 'High', satisfaction: 50 },
              { shift: 'Morning', pressureLevel: 'Medium', satisfaction: 75 },
              { shift: 'Afternoon', pressureLevel: 'Medium', satisfaction: 70 },
              { shift: 'Night', pressureLevel: 'Medium', satisfaction: 68 },
              { shift: 'Morning', pressureLevel: 'Low', satisfaction: 88 },
              { shift: 'Afternoon', pressureLevel: 'Low', satisfaction: 85 },
              { shift: 'Night', pressureLevel: 'Low', satisfaction: 80 },
            ]}
          />
          <DissatisfactionRiskBySection
            data={[
              { section: 'Triage', riskScore: 85 },
              { section: 'Pediatrics', riskScore: 70 },
              { section: 'Trauma', riskScore: 55 },
              { section: 'Cardiology', riskScore: 40 },
              { section: 'General', riskScore: 25 },
            ]}
          /> */}
        </div>


      </div>
    </div>
  );
}
