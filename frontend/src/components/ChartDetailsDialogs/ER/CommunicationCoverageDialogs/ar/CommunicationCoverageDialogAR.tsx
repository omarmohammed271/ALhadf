import { ChartDetailsDialog } from '@/components/DetailsOverlay/ChartDetailsDialog';
import { Button } from '@/components/ui/button';
import { useResponsiveScalars } from '@/hooks/useResponsiveScalars';
import React from 'react';
import { useTranslation } from 'react-i18next';

const CommunicationCoverageDialogAR: React.FC<{
  sections: string[];
  coverage: number[];
  threshold: number;
}> = ({ sections, coverage, threshold }) => {
  const { t } = useTranslation();
  const { textScalar } = useResponsiveScalars();

  return (
    <ChartDetailsDialog
      title={t("er.charts.communicationCoverage.title")}
      trigger={
        <Button
          variant="text"
          className="absolute top-[5%] inset-x-0 active:ring-0 z-30"
        >
          <h1
            className="absolute mx-auto font-bold"
            style={{ fontSize: `${13 * textScalar}px` }}
          >
            {t("er.charts.communicationCoverage.title")}
          </h1>
        </Button>
      }
      summary={
        <div
          className="space-y-3 text-right"
          dir="rtl"
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
        >
          <p>
            يعرض مخطط <strong>نسبة التغطية التواصلية</strong> مدى انتشار التواصل مع المرضى في مختلف أقسام الطوارئ. 
            يساعد هذا المؤشر في قياس اتساق عملية الاطمئنان على المرضى وضمان تجربة آمنة ومرضية.
          </p>
          <p>
            الأقسام التي تظهر نسبة منخفضة للتغطية التواصلية قد تكون أكثر عرضة لارتفاع مستوى عدم الرضا بين المرضى، 
            مما يتطلب تحسين الإجراءات التشغيلية والتدريب المستمر للكوادر.
          </p>
        </div>
      }
      dataAndFilters={
        <div
          className="space-y-4 text-right"
          dir="rtl"
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
        >
          <p>
            تمثل البيانات في هذا المخطط النسبة المئوية للزيارات التي تم خلالها التواصل مع المرضى لكل قسم من أقسام الطوارئ.
          </p>

          <table
            className="w-full text-sm border-collapse border border-border"
            style={{
              fontSize: `${14 * textScalar}px`,
              lineHeight: 1.5,
            }}
          >
            <thead className="bg-muted/50">
              <tr>
                <th className="border p-2 text-right">القسم</th>
                <th className="border p-2 text-left">نسبة التغطية (%)</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((sec, i) => (
                <tr key={sec}>
                  <td className="border p-2">{sec}</td>
                  <td className={`border p-2 text-left ${
                      threshold ?
                      coverage[i] < threshold
                        ? "text-red-600 dark:text-red-400"
                        : "text-muted-foreground"
                      : ""
                    }`}
                  >{coverage[i]}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-muted-foreground">
            <em>الحد الأدنى المستهدف للتغطية: {threshold}%</em>
          </p>
        </div>
      }
      insights={
        <div
          className="space-y-3 text-right"
          dir="rtl"
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
        >
          <p className="font-semibold text-foreground">
            <strong>الرؤى الرئيسية</strong>
          </p>

          <ul className="list-disc pr-4 space-y-2">
            <li>
              الأقسام التي تحقق تغطية قريبة من 100٪ تعكس انتظام التواصل ورضا المرضى.
            </li>
            <li>
              الأقسام التي تظهر تغطية أقل من الحد المستهدف ({threshold}٪) تحتاج إلى مراجعة الإجراءات والكوادر.
            </li>
            <li>
              متابعة هذا المؤشر بانتظام تساعد في تحسين تجربة المرضى وتقليل شكاوى عدم الاطمئنان.
            </li>
          </ul>

          <p className="italic text-muted-foreground pt-1">
            ملاحظة: يمكن دمج هذا المؤشر مع مؤشرات رضا المرضى ومدة الانتظار للحصول على رؤية شاملة للأداء.
          </p>
        </div>
      }
    />
  );
};

export default CommunicationCoverageDialogAR;
