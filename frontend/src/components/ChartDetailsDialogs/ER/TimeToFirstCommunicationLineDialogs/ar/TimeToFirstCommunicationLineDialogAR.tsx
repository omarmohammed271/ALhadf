import { ChartDetailsDialog } from '@/components/DetailsOverlay/ChartDetailsDialog';
import { Button } from '@/components/ui/button';
import { useResponsiveScalars } from '@/hooks/useResponsiveScalars';
import React from 'react';
import { useTranslation } from 'react-i18next';

const TimeToFirstCommunicationLineDialogAR: React.FC<{ sections: string[], avgMinutes: number[], threshold: number }> = ({ sections, avgMinutes, threshold }) => {
  const { t } = useTranslation();
  const { textScalar } = useResponsiveScalars();

  return (
    <ChartDetailsDialog
      title={t("er.charts.timeToFirstCommunication.title")}
      trigger={
        <Button
          variant="text"
          className="absolute top-[5%] inset-x-0 active:ring-0 z-30"
        >
          <h1
            className="absolute mx-auto font-bold"
            style={{ fontSize: `${13 * textScalar}px` }}
          >
            {t("er.charts.timeToFirstCommunication.title")}
          </h1>
        </Button>
      }
      summary={
        <div className="space-y-3 text-right" dir="rtl" style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}>
          <p>
            يعرض مخطط <strong>الزمن حتى التواصل الأول</strong> متوسط الوقت بالدقائق الذي يستغرقه فريق الطوارئ للتواصل الأول مع المرضى بعد وصولهم. 
            يقيس هذا المؤشر سرعة الاستجابة ويساعد في تحديد التأخيرات في تقديم الرعاية.
          </p>
          <p>
            تشير التأخيرات الطويلة إلى ارتفاع معدل مغادرة المرضى دون رؤية الطبيب (LWBS)، مما يعكس اختناقات تشغيلية أو مشاكل في التوزيع البشري.
          </p>
          <ul className="list-disc pr-4">
            <li><strong>التاريخ:</strong> يوم الزيارة</li>
            <li><strong>الوقت المتوسط:</strong> دقائق حتى أول تواصل لكل يوم</li>
            <li><strong>الحد المسموح:</strong> أقصى زمن للاستجابة موضّح بخط أحمر متقطع</li>
          </ul>
          <p className="text-muted-foreground">
            يساعد هذا التصور مديري الطوارئ على تحديد الفترات ذات الاستجابة المتأخرة ودعم تحسين العمليات التشغيلية.
          </p>
        </div>
      }
      dataAndFilters={
        <div className="space-y-4 text-right" dir="rtl" style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}>
          <p>
            تُجمع البيانات حسب اليوم، مع عرض متوسط الوقت بالدقائق للتواصل الأول لكل مريض. 
            تُدرج الزيارات المكتملة فقط لضمان دقة المؤشر.
          </p>

          <table
            className="w-full text-sm border-collapse border border-border"
            style={{ fontSize: `${14 * textScalar}px`, lineHeight: 1.5 }}
          >
            <thead className="bg-muted/50">
              <tr>
                <th className="border p-2 text-right">التاريخ</th>
                <th className="border p-2 text-left">متوسط الوقت (دقائق)</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((date, i) => (
                <tr key={date}>
                  <td className="border p-2">{date}</td>
                  <td 
                    className={`border p-2 text-left ${
                      threshold ?
                      avgMinutes[i] > threshold
                        ? "text-red-600 dark:text-red-400"
                        : "text-muted-foreground"
                      : ""
                    }`}
                  >{avgMinutes[i]}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-2 text-muted-foreground">
            <p className="font-medium mb-1">المرشحات النشطة:</p>
            <ul className="list-disc pr-4 space-y-1">
              <li>النطاق الزمني: <strong>الفترة المحددة</strong></li>
              <li>حالة الزيارة: <strong>الزيارات المكتملة فقط</strong></li>
              <li>الوحدة: <strong>الدقائق</strong></li>
            </ul>
          </div>

          <p className="text-muted-foreground">
            <em>مصدر البيانات: سجلات زيارات الطوارئ وبيانات أحداث التواصل</em>
          </p>
        </div>
      }
      insights={
        <div className="space-y-3 text-right" dir="rtl" style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}>
          <p className="font-semibold text-foreground">
            <strong>الملاحظات والرؤى الرئيسية</strong>
          </p>
          <ul className="list-disc pr-4 space-y-2">
            <li>
              الأيام التي يتجاوز فيها المتوسط الحد المسموح تشير إلى تأخيرات في الاستجابة قد تزيد من LWBS.
            </li>
            <li>
              يساعد المراقبة المستمرة لأوقات التواصل الأول في تحسين توزيع الموظفين وعمليات الطوارئ.
            </li>
            <li>
              تحديد التأخيرات المتكررة يمكن أن يوجه تحسين العمليات، التدريب، أو إعادة تخصيص الموارد.
            </li>
            <li>
              مقارنة الأداء بالاتجاهات التاريخية تساعد على توقع فترات الطلب العالي والتقليل من التأخيرات مسبقًا.
            </li>
          </ul>
          <p className="text-muted-foreground italic pt-1">
            نصيحة: دمج هذا المخطط مع بيانات رضا المرضى وLWBS للحصول على رؤية تشغيلية كاملة.
          </p>
        </div>
      }
    />
  );
};

export default TimeToFirstCommunicationLineDialogAR;
