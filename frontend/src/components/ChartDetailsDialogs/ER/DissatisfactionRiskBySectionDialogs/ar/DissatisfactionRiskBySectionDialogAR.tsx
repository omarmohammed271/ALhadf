import { ChartDetailsDialog } from '@/components/DetailsOverlay/ChartDetailsDialog';
import { Button } from '@/components/ui/button';
import { useResponsiveScalars } from '@/hooks/useResponsiveScalars';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ERSectionRisk {
  section: string;
  riskScore: number; // 0-100
}

interface DissatisfactionRiskBySectionDialogARProps {
  data: ERSectionRisk[];
}

const DissatisfactionRiskBySectionDialogAR: React.FC<DissatisfactionRiskBySectionDialogARProps> = ({ data }) => {
  const { t } = useTranslation();
  const { textScalar } = useResponsiveScalars();

  return (
    <ChartDetailsDialog
      title={t("er.charts.dissatisfactionRiskBySection.title")}
      trigger={
        <Button
          variant="text"
          className="absolute top-[5%] inset-x-0 active:ring-0 z-30"
        >
          <h1
            className="absolute mx-auto font-bold"
            style={{ fontSize: `${13 * textScalar}px` }}
          >
            {t("er.charts.dissatisfactionRiskBySection.title")}
          </h1>
        </Button>
      }
      summary={
        <div
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
          className="space-y-3 text-right"
        >
          <p>
            يعرض <strong>مخطط مخاطر عدم رضا المرضى حسب قسم الطوارئ</strong> ترتيب أقسام الطوارئ وفقًا لمستوى المخاطر
            المرتبطة بعدم رضا المرضى. يتيح هذا التصور للأقسام تحديد المجالات التي تحتاج إلى تحسين عاجل.
          </p>

          <p>
            يمثل كل قضيب مستوى المخاطر في قسم معين، حيث يشير الطول الأعلى إلى ارتفاع احتمالية عدم رضا المرضى.
          </p>

          <ul className="list-disc pr-4 space-y-1">
            <li><strong>القسم:</strong> اسم قسم الطوارئ.</li>
            <li><strong>مستوى المخاطر:</strong> درجة المخاطر من 0 إلى 100، حيث يشير الرقم الأعلى إلى زيادة احتمال عدم رضا المرضى.</li>
          </ul>

          <p className="text-muted-foreground">
            يساعد هذا المخطط الإدارة على توجيه الأولويات والموارد نحو الأقسام الأكثر عرضة لمشكلات رضا المرضى.
          </p>
        </div>
      }
      dataAndFilters={
        <div
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
          className="space-y-4 text-right"
        >
          <p>
            يوضح الجدول التالي مستوى المخاطر لكل قسم من أقسام الطوارئ.
          </p>

          <table
            dir="rtl"
            className="w-full text-sm border-collapse border border-border"
            style={{
              fontSize: `${14 * textScalar}px`,
              lineHeight: 1.5,
            }}
          >
            <thead className="bg-muted/50">
              <tr>
                <th className="border p-2 text-right">القسم</th>
                <th className="border p-2 text-right">مستوى المخاطر</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.section}>
                  <td className="border p-2">{d.section}</td>
                  <td className="border p-2 text-right">{d.riskScore.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-2 text-muted-foreground">
            <p className="font-medium mb-1">الفلاتر النشطة:</p>
            <ul className="list-disc pr-4 space-y-1">
              <li>النطاق الزمني: <strong>آخر 3 أشهر</strong></li>
              <li>القسم: <strong>قسم الطوارئ</strong></li>
              <li>مصدر البيانات: <strong>نموذج المخاطر وتحليل الأداء السابق</strong></li>
              <li>المقياس: <strong>مؤشر مخاطر عدم رضا المرضى</strong></li>
            </ul>
          </div>

          <p className="text-muted-foreground">
            <em>
              مصدر البيانات: نظام إدارة قسم الطوارئ وتحليلات نموذج المخاطر.
            </em>
          </p>
        </div>
      }
      insights={
        <div
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
          className="space-y-3 text-right"
        >
          <p className="font-semibold text-foreground">
            <strong>الملاحظات والرؤى الأساسية</strong>
          </p>

          <ul className="list-disc pr-4 space-y-2">
            <li>
              <strong>أقسام عالية المخاطر:</strong> تشير الأقسام ذات درجات المخاطر المرتفعة إلى الحاجة الفورية لتحسين تجربة المرضى.
            </li>
            <li>
              <strong>ترتيب الأولويات:</strong> يتيح المخطط تحديد الأقسام التي تتطلب تدخلاً سريعاً من الإدارة.
            </li>
            <li>
              <strong>التخطيط الاستراتيجي:</strong> يمكن ربط هذا المخطط بمؤشرات الأداء الأخرى لتوجيه الموارد بشكل أكثر فعالية.
            </li>
            <li>
              <strong>مراقبة الأداء:</strong> متابعة هذه المؤشرات بانتظام يساعد في تقليل مخاطر عدم رضا المرضى وتحسين جودة الخدمة.
            </li>
          </ul>

          <p className="text-muted-foreground">
            استخدام هذا المخطط يدعم الإدارة في اتخاذ قرارات قائمة على البيانات لتحسين تجربة المرضى في أقسام الطوارئ.
          </p>

          <p className="italic text-muted-foreground pt-1">
            ملاحظة: قارن هذا المخطط مع مؤشرات إعادة الزيارة أو الشكاوى لفهم التأثير الكامل لظروف التشغيل على رضا المرضى.
          </p>
        </div>
      }
    />
  );
};

export default DissatisfactionRiskBySectionDialogAR;
