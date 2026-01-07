import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createERVisit, createSatisfactionSignal, getCommunicationEvents, getERVisits, getFailureIndicators, getSatisfactionSignals } from "@/api/serviceAPI";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { getUsers } from "@/api/authAPI";
import { formatDateTime } from "@/utils/dateHelpers";
import { useCreateERVisit, useERVisits, useUsers } from "@/api/endpoints/ERVisitsEndpoints";
import { Field } from "@/components/ui/FormFields";
import ERVisit from "./FormComponents/ERVisit";
import SatisfactionSignals from "./FormComponents/SatisfactionSignals";

export default function DataForm() {
  const { t } = useTranslation();

  const baseClasses = " bg-background border-border "


  const [communicationEvent, setCommunicationEvent] = useState<any>(
    {
      event_type: "",
      staff_role: "",
      initiated_by: "",
      metadata: "null",
      visit: ""
    }
  )

  const [failureData, setFailureData] = useState<any>(
    {
      visit: "",
      communicationEvent: "",
      lwbs: "",
      revisitReason: "",
      timeToFirstContact: "",
      timeWithoutCommunication: "",
      metadata: "null",
    }
  )


  const { data: ervisits = [], isLoading: visitsLoading } = useERVisits();

  const { data: commEvents = [], isPending: commEventsPending } = useQuery({
    queryKey: ["comm_events"],
    queryFn: getCommunicationEvents,
  });
  const {mutate: communicationEventMutation, isPending: communicationEventPending} = useMutation({
    mutationFn: (data: typeof communicationEvent) => createSatisfactionSignal(data),
    onSuccess(data, variables, onMutateResult, context) {
      toast.success("Communication Event created successfully");
    },
    onError(error, variables, onMutateResult, context) {
      toast.error("Failed to save Communication Event.");
      toast.error(error.message);
    },
  });



  const { data: failures = [], isPending: failurePending } = useQuery({
    queryKey: ["failures"],
    queryFn: getFailureIndicators,
  });
  const {mutate: failureDataMutation, isPending: failureDataPending} = useMutation({
    mutationFn: (data: typeof failureData) => createSatisfactionSignal(data),
    onSuccess(data, variables, onMutateResult, context) {
      toast.success("Failure Indicator created successfully");
    },
    onError(error, variables, onMutateResult, context) {
      toast.error("Failed to save Failure Indicator.");
      toast.error(error.message);
    },
  });

  // const {mutate: patientSatisfactionMutation} = useMutation({
  //   mutationFn: (data: typeof erVisit) => createSatisfactionSignal(data),
  // });


  return (
    <div className="flex-1 h-96 overflow-auto scroll-container">
      <div className="my-5 h-1 grid lg:grid-cols-2 gap-4">

        {/* ================================================= */}
        {/* 1. ER VISIT CORE DATA */}
        {/* ================================================= */}
        <ERVisit baseClasses={baseClasses} />



        {/* ================================================= */}
        {/* 2. PATIENT SATISFACTION SIGNALS */}
        {/* ================================================= */}
        <SatisfactionSignals baseClasses={baseClasses} />


        {/* ================================================= */}
        {/* 3. Communication SIGNALS */}
        {/* ================================================= */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {t("dataForm.sections.communicationEvent.title")}
            </CardTitle>
            <CardDescription className="text-md">
              {t("dataForm.sections.communicationEvent.description")}
            </CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">

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
                  {ervisits.map((visit: any) => (
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



        {/* ================================================= */}
        {/* 4. EXPERIENCE FAILURE INDICATORS */}
        {/* ================================================= */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {t("dataForm.sections.experienceFailures.title")}
            </CardTitle>
            <CardDescription className="text-md">
              {t("dataForm.sections.experienceFailures.description")}
            </CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">

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
                  {ervisits.map((visit: any) => (
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
              <Input placeholder="Communication Event ID (optional)" value={failureData.communicationEvent} onChange={(e) => setFailureData({...failureData, communicationEvent: e.target.value})} />
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
              <Select value={failureData.revisitReason} onValueChange={(value) => setFailureData({...failureData, revisitReason: value})}>
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

      </div>
    </div>
  );
}

  