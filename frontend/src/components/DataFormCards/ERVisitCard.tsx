"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { createERVisit } from "@/api/serviceAPI";

export default function ERVisitCard() {
  const { t } = useTranslation();
  const baseClasses = "bg-background border-border";

  const [patient, setPatient] = useState("");
  const [arrivalTimestamp, setArrivalTimestamp] = useState("");
  const [triageTimestamp, setTriageTimestamp] = useState("");
  const [firstClinicalContact, setFirstClinicalContact] = useState("");
  const [dispositionTimestamp, setDispositionTimestamp] = useState("");
  const [triageLevel, setTriageLevel] = useState("1");
  const [erSection, setERSection] = useState("");
  const [dispositionType, setDispositionType] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [revisit72h, setRevisit72h] = useState("");
  const [metadata, setMetadata] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      createERVisit({
        patient,
        arrivalTimestamp,
        triageTimestamp,
        firstClinicalContact,
        dispositionTimestamp,
        triageLevel,
        erSection,
        dispositionType,
        ageGroup,
        revisit72h,
        metadata: metadata ? JSON.parse(metadata) : {},
      }),
    onSuccess: () => {
      toast.success(t("dataForm.messages.savedERVisit"));
    },
    onError: (err: any) => {
      toast.error(err?.message || t("dataForm.messages.failedSave"));
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{t("dataForm.sections.erVisitCoreData.title")}</CardTitle>
        <CardDescription>{t("dataForm.sections.erVisitCoreData.description")}</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input placeholder={t("dataForm.fields.patient.label")} value={patient} onChange={(e) => setPatient(e.target.value)} />
        <Input type="datetime-local" placeholder={t("dataForm.fields.arrivalTimestamp.label")} value={arrivalTimestamp} onChange={(e) => setArrivalTimestamp(e.target.value)} />
        <Input type="datetime-local" placeholder={t("dataForm.fields.triageTimestamp.label")} value={triageTimestamp} onChange={(e) => setTriageTimestamp(e.target.value)} />
        <Input type="datetime-local" placeholder={t("dataForm.fields.firstClinicalContact.label")} value={firstClinicalContact} onChange={(e) => setFirstClinicalContact(e.target.value)} />
        <Input type="datetime-local" placeholder={t("dataForm.fields.dispositionTimestamp.label")} value={dispositionTimestamp} onChange={(e) => setDispositionTimestamp(e.target.value)} />

        <Select value={triageLevel} onValueChange={setTriageLevel}>
          <SelectTrigger className={baseClasses}>
            <SelectValue placeholder={t("dataForm.fields.triageLevel.placeholder")} />
          </SelectTrigger>
          <SelectContent className={baseClasses}>
            {[1, 2, 3, 4, 5].map((l) => <SelectItem key={l} value={String(l)}>{t(`dataForm.options.triageLevels.${l}`)}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={erSection} onValueChange={setERSection}>
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

        <Select value={dispositionType} onValueChange={setDispositionType}>
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

        <Select value={ageGroup} onValueChange={setAgeGroup}>
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

        <Select value={revisit72h} onValueChange={setRevisit72h}>
          <SelectTrigger className={baseClasses}>
            <SelectValue placeholder={t("dataForm.fields.revisit72h.placeholder")} />
          </SelectTrigger>
          <SelectContent className={baseClasses}>
            <SelectItem value="true">{t("dataForm.options.yes")}</SelectItem>
            <SelectItem value="false">{t("dataForm.options.no")}</SelectItem>
          </SelectContent>
        </Select>

        <Textarea
          placeholder='{"source": "ambulance", "notes": "..."}'
          value={metadata}
          onChange={(e) => setMetadata(e.target.value)}
          className="w-full h-24"
        />
      </CardContent>

      <div className="flex justify-end p-4">
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? t("dataForm.buttons.saving") : t("dataForm.buttons.saveERVisit")}
        </Button>
      </div>
    </Card>
  );
}
