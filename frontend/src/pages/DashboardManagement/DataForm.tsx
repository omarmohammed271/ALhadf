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

export default function DataForm() {
  const { t } = useTranslation();

  const baseClasses = " bg-background border-border "

  const [erVisit, setErVisit] = useState<any>({
    patient: "",
    arrival_ts: "",
    triage_ts: "",
    first_contact_ts: "",
    disposition_ts: "",
    triage_level: "",
    er_section: "",
    disposition_type: "",
    age_group: "",
    revisit_72h: "",
    metadata: "null",
  });

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

  function toISO(value: string) {
    if (!value) return null;
    return new Date(value).toISOString();
  }

  const { data: allUsers = [], isLoading: usersLoading } = useQuery({
    queryKey: ["all_users"],
    queryFn: getUsers,
  });

  const { data: ervisits = [], isPending: visitsPending } = useQuery({
    queryKey: ["all_visits"],
    queryFn: getERVisits,
  });
  const {mutate: erVisitMutation, isPending: erVisitPending} = useMutation({
    mutationFn: (data: typeof erVisit) => createERVisit(data),
    onSuccess(data, variables, onMutateResult, context) {
      toast.success("ER Visit created successfully");
    },
    onError(error, variables, onMutateResult, context) {
      toast.error("Failed to save ER Visit.");
    },
  });

  const { data: satisfactionSignals = [], isPending: signalsPending } = useQuery({
    queryKey: ["all_signals"],
    queryFn: getSatisfactionSignals,
  });
  const {mutate: patientSatisfactionMutation, isPending: patientSatisfactionPending} = useMutation({
    mutationFn: (data: typeof patientSatisfaction) => createSatisfactionSignal(data),
    onSuccess(data, variables, onMutateResult, context) {
      toast.success("Satisfaction Signal created successfully");
    },
    onError(error, variables, onMutateResult, context) {
      toast.error("Failed to save Satisfaction Signal.");
      toast.error(error.message);
    },
  });

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
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {t("dataForm.sections.erVisitCoreData.title")}
            </CardTitle>
            <CardDescription className="text-md">
              {t("dataForm.sections.erVisitCoreData.description")}
            </CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Patient Reference */}
            <Field
              label={t("dataForm.fields.patient.label")}
              description={t("dataForm.fields.patient.description")}
            >
              <Select
                value={erVisit.patient}
                onValueChange={(value) =>
                  setErVisit({ ...erVisit, patient: value })
                }
              >
                <SelectTrigger className={baseClasses}>
                  <SelectValue placeholder="Patient ID / MRN" />
                </SelectTrigger>
                <SelectContent className={baseClasses}>
                  {allUsers.map((user: any) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Arrival Timestamp */}
            <Field
              label={t("dataForm.fields.arrivalTimestamp.label")}
              description={t("dataForm.fields.arrivalTimestamp.description")}
            >
              <Input
                type="datetime-local"
                value={erVisit.arrival_ts}
                onChange={(e) =>
                  setErVisit({ ...erVisit, arrival_ts: e.target.value})
                }
              />
            </Field>

            {/* Triage Timestamp */}
            <Field
              label={t("dataForm.fields.triageTimestamp.label")}
              description={t("dataForm.fields.triageTimestamp.description")}
            >
              <Input
                type="datetime-local"
                value={erVisit.triage_ts}
                onChange={(e) =>
                  setErVisit({ ...erVisit, triage_ts: e.target.value })
                }
              />
            </Field>

            {/* First Clinical Contact */}
            <Field
              label={t("dataForm.fields.firstClinicalContact.label")}
              description={t("dataForm.fields.firstClinicalContact.description")}
            >
              <Input
                type="datetime-local"
                value={erVisit.first_contact_ts}
                onChange={(e) =>
                  setErVisit({ ...erVisit, first_contact_ts: e.target.value })
                }
              />
            </Field>

            {/* Disposition Timestamp */}
            <Field
              label={t("dataForm.fields.dispositionTimestamp.label")}
              description={t("dataForm.fields.dispositionTimestamp.description")}
            >
              <Input
                type="datetime-local"
                value={erVisit.disposition_ts}
                onChange={(e) =>
                  setErVisit({ ...erVisit, disposition_ts: e.target.value })
                }
              />
            </Field>

            {/* Triage Level */}
            <Field
              label={t("dataForm.fields.triageLevel.label")}
              description={t("dataForm.fields.triageLevel.description")}
            >
              <Select
                value={erVisit.triage_level}
                onValueChange={(value) =>
                  setErVisit({ ...erVisit, triage_level: value })
                }
              >
                <SelectTrigger className={baseClasses}>
                  <SelectValue placeholder={t("dataForm.fields.triageLevel.placeholder")} />
                </SelectTrigger>
                <SelectContent className={baseClasses}>
                  {[1, 2, 3, 4, 5].map((l) => (
                    <SelectItem key={l} value={String(l)}>
                      {t(`dataForm.options.triageLevels.${l}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* ER Section */}
            <Field
              label={t("dataForm.fields.erSection.label")}
              description={t("dataForm.fields.erSection.description")}
            >
              <Select
                value={erVisit.er_section}
                onValueChange={(value) => setErVisit({ ...erVisit, er_section: value })}
              >
                <SelectTrigger className={baseClasses}>
                  <SelectValue placeholder={t("dataForm.fields.erSection.placeholder")} />
                </SelectTrigger>
                <SelectContent className={baseClasses}>
                  <SelectItem value="main">{t("dataForm.options.main.resus")}</SelectItem>
                  <SelectItem value="fasttrack">{t("dataForm.options.fastTrack.resus")}</SelectItem>
                  <SelectItem value="trauma">{t("dataForm.options.trauma.resus")}</SelectItem>
                  <SelectItem value="peds">{t("dataForm.options.peds.resus")}</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {/* Disposition Type */}
            <Field
              label={t("dataForm.fields.dispositionType.label")}
              description={t("dataForm.fields.dispositionType.description")}
            >
              <Select
                value={erVisit.disposition_type}
                onValueChange={(value) =>
                  setErVisit({ ...erVisit, disposition_type: value })
                }
              >
                <SelectTrigger className={baseClasses}>
                  <SelectValue placeholder={t("dataForm.fields.dispositionType.placeholder")} />
                </SelectTrigger>
                <SelectContent className={baseClasses}>
                  <SelectItem value="admitted">{t("dataForm.options.dispositionTypes.admitted")}</SelectItem>
                  <SelectItem value="discharged">{t("dataForm.options.dispositionTypes.discharged")}</SelectItem>
                  <SelectItem value="lwbs">{t("dataForm.options.dispositionTypes.lwbs")}</SelectItem>
                  <SelectItem value="transferred">{t("dataForm.options.dispositionTypes.transferred")}</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {/* Age Group */}
            <Field
              label={t("dataForm.fields.ageGroup.label")}
              description={t("dataForm.fields.ageGroup.description")}
            >
              <Select
                value={erVisit.age_group}
                onValueChange={(value) => setErVisit({ ...erVisit, age_group: value })}
              >
                <SelectTrigger className={baseClasses}>
                  <SelectValue placeholder={t("dataForm.fields.ageGroup.placeholder")} />
                </SelectTrigger>
                <SelectContent className={baseClasses}>
                  <SelectItem value="child">{t("dataForm.options.ageGroups.child")}</SelectItem>
                  <SelectItem value="teen">{t("dataForm.options.ageGroups.teen")}</SelectItem>
                  <SelectItem value="young_adult">{t("dataForm.options.ageGroups.youngAdult")}</SelectItem>
                  <SelectItem value="adult">{t("dataForm.options.ageGroups.adult")}</SelectItem>
                  <SelectItem value="senior">{t("dataForm.options.ageGroups.senior")}</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {/* Revisit 72h */}
            <Field
              label={t("dataForm.fields.revisit72h.label")}
              description={t("dataForm.fields.revisit72h.description")}
            >
              <Select
                value={erVisit.revisit_72h}
                onValueChange={(value) => setErVisit({ ...erVisit, revisit_72h: value })}
              >
                <SelectTrigger className={baseClasses}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className={baseClasses}>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
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
                className="w-full h-30"
                placeholder='{"source": "ambulance", "notes": "..."}'
                value={erVisit.metadata}
                onChange={(e) => setErVisit({ ...erVisit, metadata: e.target.value })}
              />
            </Field>

            {/* Save Button */}
            <div>
              <Button
                className=""
                onClick={() =>
                  erVisitMutation({
                    ...erVisit,
                    arrival_ts: toISO(erVisit.arrival_ts),
                    triage_ts: toISO(erVisit.triage_ts),
                    first_contact_ts: toISO(erVisit.first_contact_ts),
                    disposition_ts: toISO(erVisit.disposition_ts),
                  })
                }
                disabled={erVisitPending}
              >
                Save
              </Button>
            </div>
          </CardContent>
        </Card>



        {/* ================================================= */}
        {/* 2. PATIENT SATISFACTION SIGNALS */}
        {/* ================================================= */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {t("dataForm.sections.patientSatisfaction.title")}
            </CardTitle>
            <CardDescription className="text-md">
              {t("dataForm.sections.patientSatisfaction.description")}
            </CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">

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
                  {ervisits.map((visit: any) => (
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

  
  /* ================================================= */
  /* Helpers */
  /* ================================================= */
  
  function Field({
    label,
    description,
    children,
    full,
    className
  }: {
    label: string;
    description: string;
    children: React.ReactNode;
    full?: boolean;
    className?: string;
  }) {
    return (
      <div className={full ? "md:col-span-2 space-y-2" : "space-y-2"}>
        <label className=" font-medium ">{label}</label>
        <div className={`my-2 w-fit ` + className}>
        {children}
        </div>
        <p className=" text-muted-foreground">{description}</p>
      </div>
    );
  }
  
  function ReadOnlyField({ label }: { label: string }) {
    return (
      <div className="space-y-2">
        <label className="font-medium">{label}</label>
        <Input className="mt-2" disabled placeholder="Derived by system" />
      </div>
    );
  }
