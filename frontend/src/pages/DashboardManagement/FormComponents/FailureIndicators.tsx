import { useCommunicationEvents, useCreateCommunicationEvent } from "@/api/endpoints/CommunicationEventEndpoints";
import { useERVisits } from "@/api/endpoints/ERVisitsEndpoints";
import { useCreateFailureIndicator, useFailureIndicators } from "@/api/endpoints/FailureIndicatorsEndpoints";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/FormFields";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatDateTime } from "@/utils/dateHelpers";
import { t } from "i18next";
import { useState } from "react";

export default function FailureIndicators({baseClasses}: {baseClasses: string}){

  const {
    data: commEvents = [],
    isLoading: commEventsPending,
  } = useCommunicationEvents();

  const [failureData, setFailureData] = useState({
    visit: "",                 // ERVisit ID
    comm_event: "",            // CommunicationEvent ID (optional)
    lwbs: "",
    revisit_reason: "",
    metadata: "",              // JSON object
  });
  
  const {
    mutate: failureDataMutation,
    isPending: failureDataPending,
  } = useCreateFailureIndicator();
    

  const { data: erVisits = [], isPending: visitsPending } = useERVisits();

  return(
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {t("dataForm.sections.experienceFailures.title")}
        </CardTitle>
        <CardDescription className="text-md">
          {t("dataForm.sections.experienceFailures.description")}
        </CardDescription>
      </CardHeader>

      <CardContent className="xl:grid grid-cols-2 gap-6 overflow-hidden">

        {/* ER Visit Reference */}
        <Field
          label={t("dataForm.fields.visit.label")}
          description={t("dataForm.fields.visit.description")}
        >
          <Select onValueChange={(value) =>
              setFailureData({ ...failureData, visit: value })
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

        {/* Communication Event Reference (optional) */}
        <Field
          label={t("dataForm.fields.communicationEvent.label")}
          description={t("dataForm.fields.communicationEvent.description")}
        >
          <Select onValueChange={(value) =>
              setFailureData({ ...failureData, comm_event: value })
            }> 
            <SelectTrigger className={baseClasses}>
              <SelectValue placeholder="Communication Event ID (optional)" />
            </SelectTrigger>
            <SelectContent className={baseClasses}>
              {commEvents.map((event: any) => (
                <SelectItem key={event.event_id} value={String(event.event_id)}>
                  {event.staff_role} - {formatDateTime(event.event_ts)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* LWBS */}
        <Field
          label={t("dataForm.fields.lwbs.label")}
          description={t("dataForm.fields.lwbs.description")}
        >
          <Select value={failureData.lwbs} onValueChange={(value) => setFailureData({...failureData, lwbs: value})}>
            <SelectTrigger className={baseClasses}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className={baseClasses}>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {/* Revisit Reason */}
        <Field
          label={t("dataForm.fields.revisitReason.label")}
          description={t("dataForm.fields.revisitReason.description")}
        >
          <Select value={failureData.revisit_reason} onValueChange={(value) => setFailureData({...failureData, revisit_reason: value})}>
            <SelectTrigger className={baseClasses}>
              <SelectValue placeholder={t("dataForm.fields.revisitReason.placeholder")} />
            </SelectTrigger>
            <SelectContent className={baseClasses}>
              <SelectItem value="worsening">
                {t("dataForm.options.revisitReasons.worsening")}
              </SelectItem>
              <SelectItem value="new_issue">
                {t("dataForm.options.revisitReasons.newIssue")}
              </SelectItem>
              <SelectItem value="planned">
                {t("dataForm.options.revisitReasons.planned")}
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
            value={failureData.metadata} onChange={(e) => setFailureData({...failureData, metadata: e.target.value})}
            className="w-full h-24"
            placeholder='{"trigger": "auto", "rule": "LWBS > 30min"}'
          />
        </Field>
        {/* Save Button */}
        <div>
          <Button
            className=""
            onClick={() => failureDataMutation(failureData)}
            disabled={failureDataPending}
          >
            Save
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}