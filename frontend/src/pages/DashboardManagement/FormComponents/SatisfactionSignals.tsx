import { useERVisits } from '@/api/endpoints/ERVisitsEndpoints';
import { useCreateSatisfactionSignal } from '@/api/endpoints/SatisfactionSignalsEndpoints';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/FormFields';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatDateTime } from '@/utils/dateHelpers';
import { t } from 'i18next';
import { useState } from 'react';

export default function SatisfactionSignals({baseClasses}: {baseClasses: string}){

    
    const [patientSatisfaction, setPatientSatisfaction] = useState<any>(
        {
        visit: "",
        overall_score: "",
        waiting_score: "",
        communication_score: "",
        respect_score: "",
        comment: "null",
        metadata: "null",
        }
    )

    const { data: erVisits = [], isPending: visitsPending } = useERVisits();
    const {
        mutate: patientSatisfactionMutation,
        isPending: patientSatisfactionPending,
      } = useCreateSatisfactionSignal();

    return (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {t("dataForm.sections.patientSatisfaction.title")}
            </CardTitle>
            <CardDescription className="text-md">
              {t("dataForm.sections.patientSatisfaction.description")}
            </CardDescription>
          </CardHeader>

          <CardContent className="xl:grid grid-cols-2 gap-6">

            {/* ER Visit Reference */}
            <Field
              label={t("dataForm.fields.visit.label")}
              description={t("dataForm.fields.visit.description")}
            >
              <Select onValueChange={(value) =>
                  setPatientSatisfaction({ ...patientSatisfaction, visit: value })
                }>
                <SelectTrigger className={baseClasses}>
                  <SelectValue placeholder="ER Visit ID" />
                </SelectTrigger>
                <SelectContent className={baseClasses}>
                  {erVisits.map((visit: any) => (
                    <SelectItem key={visit.visit_id} value={String(visit.visit_id)}>
                      {visit.patient_detail.username} - {formatDateTime(visit.arrival_ts)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>


            {/* Satisfaction Scores */}
            {[
              { key: "overall", field: "overall_score" },
              { key: "waiting", field: "waiting_score" },
              { key: "communication", field: "communication_score" },
              { key: "respect", field: "respect_score" },
            ].map(({ key, field }) => (
              <Field
                key={key}
                label={t(`dataForm.fields.satisfaction.${key}`)}
                description={t("dataForm.fields.satisfaction.description")}
              >
                <Select onValueChange={(value) =>
                          setPatientSatisfaction({ ...patientSatisfaction, [`${field}`]: value })
                        }>
                  <SelectTrigger className={baseClasses}>
                    <SelectValue placeholder={t("dataForm.fields.satisfaction.placeholder")} />
                  </SelectTrigger>
                  <SelectContent className={baseClasses}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <SelectItem key={s} value={String(s)}
                      >
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            ))}

            {/* Free-text Comment */}
            <Field
              full
              className={`w-full rounded-xl ` + baseClasses}
              label={t("dataForm.fields.freeTextComment.label")}
              description={t("dataForm.fields.freeTextComment.description")}
            >
              <Textarea
                className="w-full h-28"
                value={patientSatisfaction.comment} onChange={(e) =>
                  setPatientSatisfaction({ ...patientSatisfaction, comment: e.target.value })
                }
                placeholder={t("dataForm.fields.freeTextComment.placeholder")}
              />
            </Field>

            {/* Metadata */}
            <Field
              full
              className={`w-full rounded-xl ` + baseClasses}
              label={t("dataForm.fields.metadata.label")}
              description={t("dataForm.fields.metadata.description")}
            >
              <Textarea
                className="w-full h-24"
                value={patientSatisfaction.metadata} onChange={(e) =>
                  setPatientSatisfaction({ ...patientSatisfaction, metadata: e.target.value })
                }
                placeholder='{"source": "SMS", "language": "ar"}'
              />
            </Field>
            
            
            {/* Save Button */}
            <div>
              <Button
                className=""
                onClick={() => patientSatisfactionMutation({
                  ...patientSatisfaction,

                })}
                disabled={patientSatisfactionPending}
              >
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
    );
};
