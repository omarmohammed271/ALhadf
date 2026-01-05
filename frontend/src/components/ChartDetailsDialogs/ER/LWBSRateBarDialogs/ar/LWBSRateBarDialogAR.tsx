import { ChartDetailsDialog } from '@/components/DetailsOverlay/ChartDetailsDialog';
import { Button } from '@/components/ui/button';
import { useResponsiveScalars } from '@/hooks/useResponsiveScalars';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface LWBSRateBarProps {
  sections: string[];
  lwbsRates: number[];
}

const LWBSRateBarDialogAR: React.FC<LWBSRateBarProps> = ({ sections, lwbsRates }) => {
  const { t } = useTranslation();
  const { textScalar } = useResponsiveScalars();

  return (
    <ChartDetailsDialog
      title={t("er.charts.lwbsRate.title")}
      trigger={
        <Button
          variant="text"
          className="absolute top-[5%] inset-x-0 active:ring-0 z-30"
        >
          <h1
            className="absolute mx-auto font-bold"
            style={{ fontSize: `${13 * textScalar}px` }}
          >
            {t("er.charts.lwbsRate.title")}
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
            يعرض مخطط <strong>نسبة المغادرة قبل المعاينة (LWBS)</strong> توزيع الحالات
            التي غادرت قسم الطوارئ قبل تلقي الرعاية الطبية، موزعة حسب{" "}
            <strong>أقسام الطوارئ</strong>.
          </p>

          <p>
            يُستخدم هذا المؤشر لتحديد <strong>نقاط الفشل في تجربة المريض</strong>
            والكشف عن المشكلات الهيكلية مثل الاختناقات التشغيلية أو ضعف تدفق المرضى،
            وليس لتقييم أداء الأفراد.
          </p>

          <ul className="list-disc pr-4 space-y-2">
            <li>
              <strong>قسم الطوارئ:</strong> المنطقة أو الوحدة التي استقبلت المريض.
            </li>
            <li>
              <strong>نسبة LWBS:</strong> نسبة المرضى الذين غادروا قبل المعاينة الطبية.
            </li>
          </ul>

          <p className="text-muted-foreground">
            تُعد نسب LWBS المرتفعة مؤشرًا مباشرًا على تدهور تجربة المريض وزيادة أوقات
            الانتظار أو ضعف التواصل.
          </p>
        </div>
      }

      dataAndFilters={
        <div
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
          className="space-y-4 text-right"
          dir="rtl"
        >
          <p>
            يوضح الجدول التالي <strong>نسبة LWBS</strong> لكل قسم من أقسام الطوارئ
            خلال فترة التحليل المحددة. تم احتساب النسبة بناءً على جميع الزيارات
            المسجلة المكتملة.
          </p>

          <table
            className="w-full text-sm border-collapse border border-border"
            style={{
              fontSize: `${14 * textScalar}px`,
              lineHeight: 1.5,
              direction: "rtl",
            }}
          >
            <thead className="bg-muted/50">
              <tr>
                <th className="border p-2 text-right">القسم</th>
                <th className="border p-2 text-left">نسبة LWBS (%)</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section, idx) => (
                <tr key={section}>
                  <td className="border p-2 text-right">{section}</td>
                  <td
                    className={`border p-2 text-left ${
                      lwbsRates[idx] > 5
                        ? "text-red-600 dark:text-red-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {lwbsRates[idx]}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-2 text-muted-foreground">
            <p className="font-medium mb-1">الفلاتر النشطة:</p>
            <ul className="list-disc pr-4 space-y-1">
              <li>نطاق التاريخ: <strong>الربع الحالي</strong></li>
              <li>القسم: <strong>جميع أقسام الطوارئ</strong></li>
              <li>الزيارات: <strong>الزيارات المكتملة فقط</strong></li>
            </ul>
          </div>

          <p className="text-muted-foreground">
            <em>
              مصدر البيانات: نظام إدارة زيارات الطوارئ — مستخرج من سجلات الزيارات
              وحالات المغادرة قبل المعاينة.
            </em>
          </p>
        </div>
      }

      insights={
        <div
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
          className="space-y-3 text-right"
          dir="rtl"
        >
          <p className="font-semibold text-foreground">
            <strong>الملاحظات والرؤى الأساسية</strong>
          </p>

          <ul className="list-disc pr-4 space-y-2">
            <li>
              <strong>مناطق الخطر:</strong> الأقسام ذات نسب LWBS المرتفعة تمثل
              نقاط انهيار في تجربة المريض وتتطلب تدخلًا فوريًا.
            </li>

            <li>
              <strong>مشكلات هيكلية:</strong> ارتفاع LWBS غالبًا ما يرتبط
              بنقص التمريض، أو ضعف الفرز، أو أوقات انتظار طويلة.
            </li>

            <li>
              <strong>تحسين التدفق:</strong> يمكن خفض LWBS من خلال تحسين
              الفرز الأولي، وإعادة توزيع الموارد، وتعزيز التواصل مع المرضى.
            </li>

            <li>
              <strong>قياس الجودة:</strong> يُعد هذا المؤشر مقياسًا مباشرًا
              لجودة تجربة الطوارئ وليس لأداء الأطباء الفردي.
            </li>
          </ul>

          <p className="text-muted-foreground">
            خفض نسب المغادرة قبل المعاينة يعكس تحسنًا حقيقيًا في كفاءة الطوارئ
            وجودة تجربة المرضى.
          </p>

          <p className="italic text-muted-foreground pt-1">
            نصيحة: اربط هذا المؤشر بزمن أول تواصل لتحليل العلاقة بين الانتظار
            والمغادرة المبكرة.
          </p>
        </div>
      }
    />
  );
};

export default LWBSRateBarDialogAR;
