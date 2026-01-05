import { ChartDetailsDialog } from '@/components/DetailsOverlay/ChartDetailsDialog';
import { Button } from '@/components/ui/button';
import { useResponsiveScalars } from '@/hooks/useResponsiveScalars';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface WaitingTimeByTriageDialogProps {
  data: { level: string; minutes: number[] }[]; // e.g., { "Level 1": [10,15,12], "Level 2": [20,25,18], ... }
  threshold: number;
}

const WaitingTimeByTriageDialogAR: React.FC<WaitingTimeByTriageDialogProps> = ({ data, threshold }) => {
  const { t } = useTranslation();
  const { textScalar } = useResponsiveScalars();

  // compute basic stats for table display
  const stats = data.map(({ level, minutes }) => {
    const count = minutes.length;
    const avg = count ? (minutes.reduce((a, b) => a + b, 0) / count).toFixed(1) : 0;
    const min = count ? Math.min(...minutes) : 0;
    const max = count ? Math.max(...minutes) : 0;
    return { level, count, avg, min, max };
  });

  return (
    <ChartDetailsDialog
      title={t("er.charts.waitingTimeByTriage.title")}
      trigger={
        <Button
          variant="text"
          className="absolute top-[5%] inset-x-0 active:ring-0 z-30"
        >
          <h1
            className="absolute mx-auto font-bold"
            style={{ fontSize: `${13 * textScalar}px` }}
          >
            {t("er.charts.waitingTimeByTriage.title")}
          </h1>
        </Button>
      }
      summary={
        <div
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
          className="space-y-3 text-right"
          dir="rtl"
        >
          <p>
            يوضح مخطط <strong>{t("er.charts.waitingTimeByTriage.title")}</strong> توزيع أوقات الانتظار حسب مستوى الفرز.
            يساعد هذا المخطط في تقييم ما إذا كان يتم إعطاء أولوية مناسبة للمرضى ذوي الحالات الحرجة.
          </p>

          <p className="text-muted-foreground">
            مستويات الحالات الحرجة مع تشتت كبير تشير إلى تجربة غير آمنة، في حين أن تشتت منخفض في الحالات الأقل خطورة يعكس كفاءة جيدة.
          </p>
        </div>
      }
      dataAndFilters={
        <div
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
          className="space-y-4 text-right"
          dir="rtl"
        >
          <table
            className="w-full text-sm border-collapse border border-border"
            style={{ fontSize: `${14 * textScalar}px`, lineHeight: 1.5 }}
          >
            <thead className="bg-muted/50">
              <tr>
                <th className="border p-2 text-right">مستوى الفرز</th>
                <th className="border p-2 text-left">عدد المرضى</th>
                <th className="border p-2 text-left">أقل وقت انتظار</th>
                <th className="border p-2 text-left">متوسط الوقت</th>
                <th className="border p-2 text-left">أقصى وقت انتظار</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((s) => (
                <tr key={s.level}
                className={`border p-2 text-right ${
                  threshold ?
                  Number(s.avg) > threshold
                    ? "text-red-600 dark:text-red-400"
                    : "text-muted-foreground"
                  : ""
                }`}
                >
                  <td className="border p-2">{s.level}</td>
                  <td className="border p-2 text-left">{s.count}</td>
                  <td className="border p-2 text-left">{s.min} د</td>
                  <td className="border p-2 text-left">{s.avg} د</td>
                  <td className="border p-2 text-left">{s.max} د</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-2 text-muted-foreground">
            <p className="font-medium mb-1">الفلاتر النشطة:</p>
            <ul className="list-disc pr-4 space-y-1">
              <li>الحد الأعلى للوقت المقبول: <strong>{threshold} دقيقة</strong></li>
              <li>الفترة الزمنية: <strong>الربع الحالي</strong></li>
              <li>القسم: <strong>قسم الطوارئ</strong></li>
            </ul>
          </div>
        </div>
      }
      insights={
        <div
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
          className="space-y-3 text-right"
          dir="rtl"
        >
          <p className="font-semibold text-foreground">
            <strong>الرؤى الرئيسية</strong>
          </p>

          <ul className="list-disc pr-4 space-y-2">
            <li>
              <strong>تشتت الحالات الحرجة:</strong> تشتت كبير في مستويات الحالات الحرجة يشير إلى تجربة غير آمنة للمرضى.
            </li>
            <li>
              <strong>كفاءة الحالات الأقل خطورة:</strong> التشتت المنخفض يعكس تدفقاً جيداً للمرضى غير العاجلين.
            </li>
            <li>
              <strong>المراقبة المستمرة:</strong> تساعد على اكتشاف عنق الزجاجة وتحسين العدالة في الفرز.
            </li>
          </ul>

          <p className="italic text-muted-foreground pt-1">
            ملاحظة: يمكن ربط هذا المخطط بمؤشرات زمن الوصول للحصول على رؤية تحليلية أعمق.
          </p>
        </div>
      }
    />
  );
};

export default WaitingTimeByTriageDialogAR;
