import { ChartDetailsDialog } from '@/components/DetailsOverlay/ChartDetailsDialog';
import { Button } from '@/components/ui/button';
import { useResponsiveScalars } from '@/hooks/useResponsiveScalars';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface SatisfactionDataPoint {
  shift: string;
  pressureLevel: string;
  satisfaction: number; // 0-100%
}

interface SatisfactionByShiftPressureDialogARProps {
  data: SatisfactionDataPoint[];
}

const SatisfactionByShiftPressureDialogAR: React.FC<SatisfactionByShiftPressureDialogARProps> = ({ data }) => {
  const { t } = useTranslation();
  const { textScalar } = useResponsiveScalars();

  // extract unique shifts and pressures for table rows/columns if needed
  const shifts = Array.from(new Set(data.map(d => d.shift)));
  const pressures = Array.from(new Set(data.map(d => d.pressureLevel)));

  return (
    <ChartDetailsDialog
      title={t("er.charts.satisfactionByShiftPressure.title")}
      trigger={
        <Button
          variant="text"
          className="absolute top-[3%] inset-x-0 active:ring-0 z-30"
        >
          <h1
            className="absolute mx-auto font-bold"
            style={{ fontSize: `${13 * textScalar}px` }}
          >
            {t("er.charts.satisfactionByShiftPressure.title")}
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
            يوضح مخطط <strong>رضا المرضى حسب الوردية ومستوى الضغط</strong> العلاقة
            بين ظروف التشغيل ورضا المرضى في قسم الطوارئ. يساعد على تحديد الحالات
            التي يكون فيها تجربة المريض أكثر عرضة للتأثر السلبي.
          </p>

          <p>
            يمثل كل فقاعة مستوى الرضا في وردية معينة تحت ضغط محدد، حيث تعكس حجم
            الفقاعة قيمة رضا المرضى (0-100٪).
          </p>

          <ul className="list-disc pr-4 space-y-1">
            <li><strong>الوردية:</strong> الفترة الزمنية التي تغطيها الوردية (صباحية/مسائية/ليلية).</li>
            <li><strong>مستوى الضغط:</strong> مستوى الضغط في القسم عند تلك الوردية (منخفض، متوسط، مرتفع).</li>
            <li><strong>رضا المرضى:</strong> قيمة مئوية تمثل مدى رضا المرضى عن تجربتهم.</li>
          </ul>

          <p className="text-muted-foreground">
            يساعد هذا المخطط فرق الإدارة على تحديد ظروف التشغيل التي قد تؤدي إلى انخفاض تجربة المرضى.
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
            يوضح الجدول التالي بيانات الرضا لكل وردية ومستوى ضغط في قسم الطوارئ.
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
                <th className="border p-2 text-right">الوردية</th>
                <th className="border p-2 text-right">مستوى الضغط</th>
                <th className="border p-2 text-right">رضا المرضى (%)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, idx) => (
                <tr key={idx}
                  className={
                    d.satisfaction < 50 ? 
                    `border-red-400 text-red-400`
                    : d.satisfaction < 80 ?
                    `border-amber-200 text-amber-200`
                    :
                    `border-green-300 text-green-300`
                  }
                >
                  <td className="border p-2">{d.pressureLevel}</td>
                  <td className="border p-2">{d.shift}</td>
                  <td className="border p-2 text-left">{d.satisfaction}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-2 text-muted-foreground">
            <p className="font-medium mb-1">الفلاتر النشطة:</p>
            <ul className="list-disc pr-4 space-y-1">
              <li>نطاق التاريخ: <strong>الربع الحالي</strong></li>
              <li>القسم: <strong>قسم الطوارئ</strong></li>
              <li>مؤشر الرضا: <strong>تم جمعه من إشارات الرضا المباشرة والملاحظات</strong></li>
            </ul>
          </div>

          <p className="text-muted-foreground">
            <em>
              مصدر البيانات: نظام إدارة قسم الطوارئ — بيانات سياقية + إشارات رضا المرضى.
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
              <strong>ظروف الضغط العالي:</strong> تظهر انخفاضات واضحة في رضا المرضى خلال الفترات ذات الضغط المرتفع.
            </li>
            <li>
              <strong>تأثير الوردية:</strong> بعض الورديات أكثر عرضة لمستويات رضا منخفضة، مما يشير إلى الحاجة لتحسين الموارد أو العمليات.
            </li>
            <li>
              <strong>تحديد المخاطر:</strong> يساعد المخطط الإدارة على وضع أولويات التدخل في الأوقات/الأماكن التي يكون فيها رضا المرضى ضعيفًا.
            </li>
            <li>
              <strong>تحسين التجربة:</strong> تحسين توازن الموارد أثناء الوردية ومستوى الضغط المرتفع يقلل احتمالية تجربة سلبية للمريض.
            </li>
          </ul>

          <p className="text-muted-foreground">
            متابعة هذا المؤشر بانتظام يعزز من القدرة على اتخاذ قرارات تشغيلية مستندة إلى تجربة المريض.
          </p>

          <p className="italic text-muted-foreground pt-1">
            نصيحة: اربط هذا المخطط مع مؤشرات إعادة الزيارة أو الشكاوى لفهم التأثير الكامل لظروف التشغيل على تجربة المرضى.
          </p>
        </div>
      }
    />
  );
};

export default SatisfactionByShiftPressureDialogAR;
