import { ChartDetailsDialog } from '@/components/DetailsOverlay/ChartDetailsDialog';
import { Button } from '@/components/ui/button';
import { useResponsiveScalars } from '@/hooks/useResponsiveScalars';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface RevisitVsCommunicationBarProps {
  categories: string[];      // نعم / لا
  revisitRates: number[];    // %
  threshold: any;    // %
}

const RevisitVsCommunicationBarDialogAR: React.FC<RevisitVsCommunicationBarProps> = ({
  categories,
  revisitRates,
  threshold,
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
          className="space-y-3 text-right"
          dir="rtl"
        >
          <p>
            يوضّح مخطط <strong>معدل إعادة الزيارة مقابل وجود التواصل</strong> العلاقة
            بين تقديم تواصل واضح للمريض أثناء زيارته لقسم الطوارئ وبين احتمالية
            عودته مرة أخرى خلال فترة قصيرة.
          </p>

          <p>
            يهدف هذا المؤشر إلى قياس <strong>وضوح الإغلاق السريري</strong> وجودة
            إيصال المعلومات للمريض، وليس تقييم القرارات الطبية أو أداء الأفراد.
          </p>

          <ul className="list-disc pr-4 space-y-1">
            <li>
              <strong>تم تقديم تواصل:</strong> المريض تلقى شرحًا واضحًا أو توجيهًا
              أو تعليمات خروج.
            </li>
            <li>
              <strong>لم يتم تقديم تواصل:</strong> غياب التفسير أو ضعف التوضيح
              قبل مغادرة المريض.
            </li>
            <li>
              <strong>معدل إعادة الزيارة:</strong> نسبة المرضى الذين عادوا إلى
              الطوارئ خلال فترة قصيرة.
            </li>
          </ul>

          <p className="text-muted-foreground">
            يُعد ارتفاع معدل إعادة الزيارة مؤشرًا محتملًا على ضعف الفهم،
            أو عدم الاطمئنان، أو غياب الإغلاق المناسب للحالة.
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
            يوضح الجدول التالي <strong>معدل إعادة الزيارة</strong> بناءً على ما إذا
            تم تقديم تواصل واضح للمريض أثناء الزيارة الأولى.
          </p>

          <table
            className="w-full text-sm border-collapse border border-border"
            style={{
              fontSize: `${14 * textScalar}px`,
              lineHeight: 1.5,
            }}
            dir="rtl"
          >
            <thead className="bg-muted/50">
              <tr>
                <th className="border p-2 text-right">التواصل</th>
                <th className="border p-2 text-left">معدل إعادة الزيارة (%)</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, idx) => (
                <tr key={category}>
                  <td className="border p-2 text-right">{category}</td>
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
            <p className="font-medium mb-1">الفلاتر النشطة:</p>
            <ul className="list-disc pr-4 space-y-1">
              <li>نطاق التاريخ: <strong>الربع الحالي</strong></li>
              <li>نوع الزيارة: <strong>زيارات الطوارئ فقط</strong></li>
              <li>إعادة الزيارة: <strong>خلال 72 ساعة</strong></li>
            </ul>
          </div>

          <p className="text-muted-foreground">
            <em>
              مصدر البيانات: نظام إدارة زيارات الطوارئ — سجلات الزيارات
              وأحداث التواصل المسجلة أثناء الرحلة العلاجية.
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
              <strong>غياب التواصل:</strong> ارتفاع إعادة الزيارة عند عدم وجود
              تواصل يشير إلى ضعف الفهم أو غياب الطمأنينة السريرية.
            </li>

            <li>
              <strong>وضوح الإغلاق:</strong> تقديم شرح واضح وتعليمات خروج يقلل
              بشكل مباشر من الزيارات غير الضرورية.
            </li>

            <li>
              <strong>تحسين التجربة:</strong> تعزيز مهارات التواصل والشرح
              يمثل تدخلًا منخفض التكلفة وعالي التأثير.
            </li>

            <li>
              <strong>جودة الرعاية:</strong> يُستخدم هذا المؤشر كمقياس لجودة
              التجربة والوضوح، وليس للحكم على القرار الطبي.
            </li>
          </ul>

          <p className="text-muted-foreground">
            خفض معدلات إعادة الزيارة المرتبطة بضعف التواصل يعكس تحسنًا حقيقيًا
            في تجربة المريض وثقته في الرعاية المقدمة.
          </p>

          <p className="italic text-muted-foreground pt-1">
            نصيحة: اربط هذا المؤشر بنتائج الرضا أو الشكاوى لفهم أثر التواصل
            على السلوك اللاحق للمريض.
          </p>
        </div>
      }
    />
  );
};

export default RevisitVsCommunicationBarDialogAR;
