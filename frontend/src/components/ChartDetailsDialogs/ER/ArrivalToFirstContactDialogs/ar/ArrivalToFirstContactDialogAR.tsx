import { ChartDetailsDialog } from "@/components/DetailsOverlay/ChartDetailsDialog";
import { Button } from "@/components/ui/button";
import { useResponsiveScalars } from "@/hooks/useResponsiveScalars";
import React from "react";
import { useTranslation } from "react-i18next";

type TrendPoint = {
  section: string;
  avgMinutes: number;
};

const ArrivalToFirstContactDialogAR: React.FC<{
  data: TrendPoint[];
  granularity: "daily" | "weekly";
  threshold?: number;
}> = ({ data, granularity, threshold }) => {
  const { t } = useTranslation();
  const { textScalar } = useResponsiveScalars();

  const average =
    data.length > 0
      ? (
          data.reduce((sum, d) => sum + d.avgMinutes, 0) / data.length
        ).toFixed(1)
      : "0";

  const max = Math.max(...data.map((d) => d.avgMinutes), 0);

  return (
    <ChartDetailsDialog
      title={t("er.charts.arrivalToFirstContact.title")}
      trigger={
        <Button
          variant="text"
          className="absolute top-[5%] inset-x-0 active:ring-0 z-30"
        >
          <h1
            className="absolute mx-auto font-bold"
            style={{ fontSize: `${13 * textScalar}px` }}
          >
            {t("er.charts.arrivalToFirstContact.title")}
          </h1>
        </Button>
      }

      /* ================= SUMMARY ================= */
      summary={
        <div
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
          className="space-y-3"
        >
          <p>
            يقيس هذا المؤشر <strong>متوسط الوقت من وصول المريض إلى الطوارئ</strong>{" "}
            وحتى <strong>أول تواصل سريري فعلي</strong> مع طبيب أو ممرّض.
            وهو أحد أقوى مؤشرات <strong>الانطباع الأول</strong> عن تجربة الطوارئ.
          </p>

          <p>
            لا يعكس هذا المؤشر سرعة العلاج، بل{" "}
            <strong>شعور المريض بأنه مرئي ومُعتنى به</strong>.
            التأخير في أول تواصل سريري غالبًا ما يُفسَّر من المريض على أنه إهمال،
            حتى لو كانت باقي مراحل الرحلة جيدة.
          </p>

          <p className="text-muted-foreground">
            الارتفاع المستمر في هذا المؤشر يشير إلى تدهور تجربة الوصول الأولى
            ويزيد من مخاطر عدم الرضا أو المغادرة دون تلقي الخدمة.
          </p>
        </div>
      }

      /* ================= DATA & FILTERS ================= */
      dataAndFilters={
        <div
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
          className="space-y-4"
        >
          <p>
            تُحسب القيم المعروضة بناءً على الفرق الزمني بين{" "}
            <strong>وقت الوصول</strong> و<strong>وقت أول تواصل سريري</strong>{" "}
            لكل زيارة طوارئ، ثم يتم احتساب المتوسط حسب{" "}
            <strong>{granularity === "daily" ? "اليوم" : "الأسبوع"}</strong>.
          </p>

          <table
            className="w-full text-sm border-collapse border border-border"
            style={{ fontSize: `${14 * textScalar}px`, lineHeight: 1.5 }}
          >
            <thead className="bg-muted/50">
              <tr>
                <th className="border p-2 text-left">الفترة</th>
                <th className="border p-2 text-right">
                  متوسط الدقائق
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.section}>
                  <td className="border p-2">{row.section}</td>
                  <td 
                    className={`border p-2 text-right ${
                      threshold ?
                      row.avgMinutes > threshold
                        ? "text-red-600 dark:text-red-400"
                        : "text-muted-foreground"
                      : ""
                    }`}
                  >
                    {row.avgMinutes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-2 text-muted-foreground">
            <p className="font-medium mb-1">المرشحات النشطة:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>نوع الزيارة: <strong>زيارات الطوارئ فقط</strong></li>
              <li>حالة الزيارة: <strong>مكتملة</strong></li>
              <li>
                مستوى التجميع:{" "}
                <strong>
                  {granularity === "daily" ? "يومي" : "أسبوعي"}
                </strong>
              </li>
            </ul>
          </div>

          <p className="text-muted-foreground">
            <em>
              مصدر البيانات: نظام معلومات المستشفى (HIS / EMR) — طابع زمني على مستوى الزيارة.
            </em>
          </p>
        </div>
      }

      /* ================= INSIGHTS ================= */
      insights={
        <div
          style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
          className="space-y-3"
        >
          <p className="font-semibold text-foreground">
            <strong>الرؤى الرئيسية</strong>
          </p>

          <ul className="list-disc pl-4 space-y-2">
            <li>
              <strong>المتوسط العام:</strong> يبلغ متوسط وقت الوصول إلى أول تواصل سريري{" "}
              <strong>{average} دقيقة</strong>.
            </li>

            <li>
              <strong>أقصى قيمة مسجلة:</strong> تم تسجيل ذروة تصل إلى{" "}
              <strong>{max} دقيقة</strong>، وهي نقطة خطر محتملة في تجربة الوصول.
            </li>

            {threshold && (
              <li>
                <strong>مقارنة مع العتبة:</strong>{" "}
                {Number(average) > threshold ? (
                  <>
                    المتوسط الحالي <strong>يتجاوز</strong> العتبة المحددة
                    ({threshold} دقيقة)، مما يشير إلى{" "}
                    <strong>خطر مرتفع على تجربة المرضى</strong>.
                  </>
                ) : (
                  <>
                    المتوسط الحالي <strong>ضمن</strong> العتبة المقبولة
                    ({threshold} دقيقة)، مع ضرورة مراقبة أي اتجاه تصاعدي.
                  </>
                )}
              </li>
            )}

            <li>
              <strong>التفسير التشغيلي:</strong> الارتفاعات المفاجئة غالبًا ما
              ترتبط بضغط التمريض، ازدحام الفرز، أو نقص الموارد في بداية الرحلة.
            </li>
          </ul>

          <p className="text-muted-foreground">
            هذا المؤشر يجب قراءته دائمًا جنبًا إلى جنب مع{" "}
            <strong>أحداث التواصل</strong> و<strong>معدلات LWBS</strong>،
            لأن التأخير بدون تواصل هو العامل الأشد تأثيرًا على الرضا.
          </p>

          <p className="italic text-muted-foreground pt-1">
            ملاحظة: يُستخدم هذا المؤشر كإنذار مبكر لتدهور تجربة الطوارئ،
            وليس كمقياس لجودة القرار الطبي.
          </p>
        </div>
      }
    />
  );
};

export default ArrivalToFirstContactDialogAR;
