import { ChartDetailsDialog } from '@/components/DetailsOverlay/ChartDetailsDialog';
import { Button } from '@/components/ui/button';
import { useResponsiveScalars } from '@/hooks/useResponsiveScalars';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    lengthsOfStay: number[];      // X-axis
    satisfactionScores: number[]; // Y-axis
    threshold?: number;
}

const LOSvsSatisfactionDialogAR: React.FC<Props> = ({ lengthsOfStay, satisfactionScores, threshold }) => {
    const { t } = useTranslation();
    const { textScalar, iScalar } = useResponsiveScalars();

    return (
        <ChartDetailsDialog
            title={t("er.charts.losVsSatisfaction.title")}
            trigger={
                <Button
                    variant="text"
                    className="absolute top-[5%] inset-x-0 active:ring-0 z-30"
                >
                    <h1
                        className="absolute mx-auto font-bold"
                        style={{ fontSize: `${13 * textScalar}px` }}
                    >
                        {t("er.charts.losVsSatisfaction.title")}
                    </h1>
                </Button>
            }
            summary={
                <div
                    style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
                    className="space-y-3"
                >
                    <p>
                        يعرض مخطط <strong>مدة البقاء مقابل رضا المرضى</strong> العلاقة بين طول الإقامة في قسم الطوارئ ومستوى الرضا.
                        يساعد هذا التحليل في تحديد نقاط التحمل الحرجة التي تؤثر على تجربة المرضى.
                    </p>

                    <p>
                        كل نقطة في المخطط تمثل زيارة فردية، حيث يُشير المحور الأفقي إلى <strong>مدة الإقامة (LOS)</strong>
                        والمحور الرأسي إلى <strong>درجة الرضا</strong>. انخفاض حاد في الرضا بعد نقاط معينة يشير إلى حدود التحمل الحرجة.
                    </p>

                    <ul className="list-disc pl-4">
                        <li><strong>LOS:</strong> عدد الدقائق أو الساعات التي قضيت في القسم.</li>
                        <li><strong>رضا:</strong> تقييم تجربة المريض، عادة من 0 إلى 100.</li>
                        <li><strong>نقاط التحمل:</strong> يمكن إضافة خط عتبة لتحديد الحد الذي يبدأ بعده الرضا بالانخفاض.</li>
                    </ul>

                    <p className="text-muted-foreground">
                        يتيح هذا التصور لمحللي تجربة المرضى والمديرين فهم العلاقة بين طول الإقامة ورضا المرضى واتخاذ إجراءات تصحيحية عند الحاجة.
                    </p>
                </div>
            }
            dataAndFilters={
                <div
                    style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
                    className="space-y-4"
                >
                    <p>
                        تتضمن مجموعة البيانات جميع الزيارات المسجلة خلال الفترة المحددة مع مقاييس الرضا المرتبطة بها. 
                        تم استبعاد البيانات غير المكتملة لضمان دقة التحليل.
                    </p>

                    <table
                        className="w-full text-sm border-collapse border border-border"
                        style={{ fontSize: `${14 * textScalar}px`, lineHeight: 1.5 }}
                    >
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="border p-2 text-left">الزيارة</th>
                                <th className="border p-2 text-right">مدة البقاء (دقائق)</th>
                                <th className="border p-2 text-right">الرضا</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lengthsOfStay.map((los, idx) => (
                                <tr key={idx}
                                className={`border p-2 text-right ${
                                    threshold ?
                                    satisfactionScores[idx] < threshold
                                      ? "text-red-600 dark:text-red-400"
                                      : "text-muted-foreground"
                                    : ""
                                  }`}
                                >
                                    <td className="border p-2">{idx + 1}</td>
                                    <td className="border p-2 text-right">{los}</td>
                                    <td className="border p-2 text-right">{satisfactionScores[idx]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="pt-2 text-muted-foreground">
                        <p className="font-medium mb-1">الفلاتر النشطة:</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>النطاق الزمني: <strong>الربع الحالي (الربع الرابع 2025)</strong></li>
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
                <div
                    style={{ fontSize: `${15 * textScalar}px`, lineHeight: 1.6 }}
                    className="space-y-3"
                >
                    <p className="font-semibold text-foreground">
                        <strong>الملاحظات والرؤى الرئيسية</strong>
                    </p>

                    <ul className="list-disc pl-4 space-y-2">
                        <li>
                            <strong>نقاط التحمل الحرجة:</strong> انخفاض رضا المرضى بعد نقاط LOS معينة يشير إلى الحاجة لتحسين العمليات أو إدارة الانتظار.
                        </li>
                        <li>
                            <strong>زيارات طويلة:</strong> المرضى الذين يقضون فترات طويلة يظهرون رضا أقل بشكل واضح.
                        </li>
                        <li>
                            <strong>فرص التحسين:</strong> يمكن استخدام هذه البيانات لتحديد أوقات الذروة وضبط الموارد لتحسين تجربة المرضى.
                        </li>
                        {threshold && (
                            <li>
                                <strong>العتبة المحددة:</strong> الخط الأحمر يشير إلى الحد الذي بعده يبدأ رضا المرضى بالانخفاض.
                            </li>
                        )}
                    </ul>

                    <p className="text-muted-foreground">
                        يساعد تتبع العلاقة بين طول الإقامة والرضا على اتخاذ قرارات تشغيلية مستنيرة وتحسين جودة الخدمة.
                    </p>

                    <p className="italic text-muted-foreground pt-1">
                        نصيحة: دمج هذا التحليل مع مؤشرات تجربة المرضى الأخرى مثل متوسط وقت الاستجابة لأول اتصال للحصول على رؤية شاملة.
                    </p>
                </div>
            }
        />
    );
};

export default LOSvsSatisfactionDialogAR;
