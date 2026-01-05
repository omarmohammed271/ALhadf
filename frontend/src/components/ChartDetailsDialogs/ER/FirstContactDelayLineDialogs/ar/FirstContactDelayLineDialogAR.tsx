import { ChartDetailsDialog } from '@/components/DetailsOverlay/ChartDetailsDialog';
import { Button } from '@/components/ui/button';
import { useResponsiveScalars } from '@/hooks/useResponsiveScalars';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface FirstContactDelayLineProps {
  buckets: string[];         // X-axis labels (time to first contact)
  avgSatisfaction: number[]; // Y-axis values (average satisfaction)
  threshold?: number;        // Optional horizontal threshold
}

const FirstContactDelayLineDialogAR: React.FC<FirstContactDelayLineProps> = ({ buckets, avgSatisfaction, threshold }) => {
  const { t } = useTranslation();
  const { textScalar } = useResponsiveScalars();

  return (
    <ChartDetailsDialog
      title={t("er.charts.firstContactDelay.title")}
      trigger={
        <Button
          variant="text"
          className="absolute top-[5%] inset-x-0 active:ring-0 z-30"
        >
          <h1
            className="absolute mx-auto font-bold"
            style={{ fontSize: `${13 * textScalar}px` }}
          >
            {t("er.charts.firstContactDelay.title")}
          </h1>
        </Button>
      }
      summary={
        <div style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }} className="space-y-3 text-right" dir="rtl">
          <p>
            يعرض مخطط <strong>تأثير تأخير الاتصال الأول</strong> العلاقة بين وقت الاتصال الأول في قسم الطوارئ ورضا المرضى.
            يوضح كيف تؤثر التأخيرات المبكرة على تجربة المرضى بشكل عام.
          </p>

          <p>
            تمثل كل نقطة مجموعة من الزيارات (مقسمة حسب مدة التأخير)، حيث يشير المحور الأفقي إلى <strong>وقت الاتصال الأول</strong>
            ويظهر المحور الرأسي <strong>متوسط الرضا</strong>. الانخفاضات الكبيرة في الرضا بعد نقاط معينة تشير إلى حدود التحمل الحرجة.
          </p>

          <ul className="list-disc pr-4">
            <li><strong>وقت الاتصال الأول:</strong> المدة بين وصول المريض وتفاعل مقدم الخدمة الأول.</li>
            <li><strong>متوسط الرضا:</strong> متوسط درجات رضا المرضى، عادة من 0 إلى 100.</li>
            <li><strong>نقاط العتبة:</strong> خط أفقي اختياري يشير إلى نقطة انخفاض الرضا الحرجة.</li>
          </ul>

          <p className="text-muted-foreground">
            يساعد هذا التصور محللي ومديري قسم الطوارئ على تحديد عنق الزجاجة في التجربة المبكرة واتخاذ إجراءات تحسين.
          </p>
        </div>
      }
      dataAndFilters={
        <div style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }} className="space-y-4 text-right" dir="rtl">
          <p>
            تتضمن مجموعة البيانات جميع الزيارات المسجلة خلال الفترة المحددة مع درجات الرضا المرتبطة بها.
            تم استبعاد البيانات غير المكتملة لضمان دقة التحليل.
          </p>

          <table className="w-full text-sm border-collapse border border-border"
            style={{ fontSize: `${14 * textScalar}px`, lineHeight: 1.5, direction: 'rtl' }}
          >
            <thead className="bg-muted/50">
              <tr>
                <th className="border p-2 text-right">الفئة الزمنية</th>
                <th className="border p-2 text-left">متوسط الرضا</th>
              </tr>
            </thead>
            <tbody>
              {buckets.map((bucket, idx) => (
                <tr key={bucket}>
                  <td className="border p-2 text-right">{bucket}</td>
                  <td 
                  className={`border p-2 text-right ${
                    threshold ?
                    avgSatisfaction[idx] < threshold
                      ? "text-red-600 dark:text-red-400"
                      : "text-muted-foreground"
                    : ""
                  }`}
                  >{avgSatisfaction[idx]}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-2 text-muted-foreground">
            <p className="font-medium mb-1">الفلاتر النشطة:</p>
            <ul className="list-disc pr-4 space-y-1">
              <li>نطاق التاريخ: <strong>الربع الحالي (الربع الرابع 2025)</strong></li>
              <li>القسم: <strong>قسم الطوارئ</strong></li>
              <li>الزيارات المكتملة فقط</li>
            </ul>
          </div>

          <p className="text-muted-foreground">
            <em>مصدر البيانات: نظام إدارة المرضى + استبيانات الرضا المجمعة لكل زيارة.</em>
          </p>
        </div>
      }
      insights={
        <div style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }} className="space-y-3 text-right" dir="rtl">
          <p className="font-semibold text-foreground"><strong>الملاحظات والرؤى الأساسية</strong></p>

          <ul className="list-disc pr-4 space-y-2">
            <li>
              <strong>نقاط التحمل الحرجة:</strong> انخفاض الرضا بشكل حاد بعد بعض فترات التأخير في الاتصال الأول يشير إلى الحاجة لتحسين العمليات.
            </li>
            <li>
              <strong>الانتظار الطويل:</strong> الزيارات التي شهدت فترات طويلة للاتصال الأول تظهر رضا أقل بوضوح.
            </li>
            <li>
              <strong>فرص التحسين:</strong> يمكن استخدام هذه الرؤى لضبط توزيع الموظفين، وترتيب الأولويات، وتحسين سير العمل لتعزيز تجربة المرضى.
            </li>
            {threshold && (
              <li>
                <strong>العتبة:</strong> الخط الأحمر يشير إلى الحد الذي يبدأ بعده انخفاض رضا المرضى بشكل كبير.
              </li>
            )}
          </ul>

          <p className="text-muted-foreground">
            مراقبة تأثير التأخيرات في الاتصال الأول يساعد المدراء على اتخاذ قرارات تشغيلية مستنيرة وتحسين جودة تجربة المرضى.
          </p>

          <p className="italic text-muted-foreground pt-1">
            نصيحة: دمج هذا التحليل مع مؤشرات أداء أخرى في قسم الطوارئ، مثل أوقات الاستجابة، للحصول على رؤية شاملة.
          </p>
        </div>
      }
    />
  );
};

export default FirstContactDelayLineDialogAR;
