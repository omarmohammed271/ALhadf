import { useCreateCommunicationEvent } from "@/api/endpoints/CommunicationEventEndpoints";
import { useERVisits } from "@/api/endpoints/ERVisitsEndpoints";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/FormFields";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime } from "@/utils/dateHelpers";
import { t } from "i18next";
import { useState } from "react";

export default function CommunicationSignals({baseClasses}: {baseClasses: string}){

    const {
        mutate: communicationEventMutation,
        isPending: communicationEventPending,
      } = useCreateCommunicationEvent();
      
    const [communicationEvent, setCommunicationEvent] = useState<any>(
        {
          event_type: "",
          staff_role: "",
          initiated_by: "",
          metadata: "null",
          visit: ""
        }
      )

    const { data: erVisits = [], isPending: visitsPending } = useERVisits();

    return(
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {t("dataForm.sections.communicationEvent.title")}
            </CardTitle>
            <CardDescription className="text-md">
              {t("dataForm.sections.communicationEvent.description")}
            </CardDescription>
          </CardHeader>

          <CardContent className="xl:grid grid-cols-2 gap-6">

            {/* ER Visit Reference */}
            <Field
              label={t("dataForm.fields.visit.label")}
              description={t("dataForm.fields.visit.description")}
            >
              <Select onValueChange={(value) =>
                  setCommunicationEvent({ ...communicationEvent, visit: value })
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

            {/* Event Type */}
            <Field
              label={t("dataForm.fields.eventType.label")}
              description={t("dataForm.fields.eventType.description")}
            >
              <Select defaultValue="initial" value={communicationEvent.event_type} onValueChange={(value) => setCommunicationEvent({...communicationEvent, event_type: value})}>
                <SelectTrigger className={baseClasses}>
                  <SelectValue placeholder={t("dataForm.fields.eventType.placeholder")} />
                </SelectTrigger>
                <SelectContent className={baseClasses}>
                  <SelectItem value="initial">
                    {t("dataForm.options.communicationEvent.initial")}
                  </SelectItem>
                  <SelectItem value="delay_update">
                    {t("dataForm.options.communicationEvent.delayUpdate")}
                  </SelectItem>
                  <SelectItem value="clinical_update">
                    {t("dataForm.options.communicationEvent.clinicalUpdate")}
                  </SelectItem>
                  <SelectItem value="other">
                    {t("dataForm.options.communicationEvent.other")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {/* Staff Role */}
            <Field
              label={t("dataForm.fields.staffRole.label")}
              description={t("dataForm.fields.staffRole.description")}
            >
              <Select value={communicationEvent.staff_role} onValueChange={(value) => setCommunicationEvent({...communicationEvent, staff_role: value})}>
                <SelectTrigger className={baseClasses}>
                  <SelectValue placeholder={t("dataForm.fields.staffRole.placeholder")} />
                </SelectTrigger>
                <SelectContent className={baseClasses}>
                  <SelectItem value="nurse">{t("dataForm.options.roles.nurse")}</SelectItem>
                  <SelectItem value="physician">{t("dataForm.options.roles.physician")}</SelectItem>
                  <SelectItem value="admin">{t("dataForm.options.roles.admin")}</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {/* Initiated By */}
            <Field
              label={t("dataForm.fields.initiatedBy.label")}
              description={t("dataForm.fields.initiatedBy.description")}
            >
              <Select value={communicationEvent.initiated_by} onValueChange={(value) => setCommunicationEvent({...communicationEvent, initiated_by: value})}>
                <SelectTrigger className={baseClasses}>
                  <SelectValue placeholder={t("dataForm.fields.initiatedBy.placeholder")} />
                </SelectTrigger>
                <SelectContent className={baseClasses}>
                  <SelectItem value="staff">
                    {t("dataForm.options.initiatedBy.staff")}
                  </SelectItem>
                  <SelectItem value="patient">
                    {t("dataForm.options.initiatedBy.patient")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {/* Metadata */}
            <Field
              full
              className={`w-full rounded-xl ` + baseClasses}
              label={t("dataForm.fields.metadata.label")}
              description={t("dataForm.fields.metadata.description")}
            >
              <Textarea
                value={communicationEvent.metadata} onChange={(e) => setCommunicationEvent({...communicationEvent, metadata: e.target.value})}
                placeholder='{"message": "Updated wait time", "channel": "verbal"}'
                className="w-full h-28"
              />
            </Field>

            
            {/* Save Button */}
            <div>
              <Button
                className=""
                onClick={() => communicationEventMutation(communicationEvent)}
                disabled={communicationEventPending}
              >
                Save
              </Button>
            </div>

          </CardContent>
        </Card>
    );
}