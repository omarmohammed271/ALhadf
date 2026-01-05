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
import { createFailureIndicator } from "@/api/serviceAPI";

export default function ExperienceFailureCard() {
  const { t } = useTranslation();
  const baseClasses = "bg-background border-border";

  const [visitId, setVisitId] = useState("");
  const [communicationEventId, setCommunicationEventId] = useState("");
  const [lwbs, setLwbs] = useState("");
  const [revisitReason, setRevisitReason] = useState("");
  const [metadata, setMetadata] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      createFailureIndicator({
        visitId,
        communicationEventId,
        lwbs,
        revisitReason,
        metadata: metadata ? JSON.parse(metadata) : {},
      }),
    onSuccess: () => {
      toast.success(t("dataForm.messages.savedExperienceFailure"));
    },
    onError: (err: any) => {
      toast.error(err?.message || t("dataForm.messages.failedSave"));
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{t("dataForm.sections.experienceFailures.title")}</CardTitle>
        <CardDescription>{t("dataForm.sections.experienceFailures.description")}</CardDescription>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
        {/* ER Visit Reference */}
        <Input
          placeholder={t("dataForm.fields.visit.label")}
          value={visitId}
          onChange={(e) => setVisitId(e.target.value)}
        />

        {/* Communication Event Reference */}
        <Input
          placeholder={t("dataForm.fields.communicationEvent.label")}
          value={communicationEventId}
          onChange={(e) => setCommunicationEventId(e.target.value)}
        />

        {/* LWBS */}
        <Select value={lwbs} onValueChange={setLwbs}>
          <SelectTrigger className={baseClasses}>
            <SelectValue placeholder={t("dataForm.fields.lwbs.label")} />
          </SelectTrigger>
          <SelectContent className={baseClasses}>
            <SelectItem value="true">{t("dataForm.options.yes")}</SelectItem>
            <SelectItem value="false">{t("dataForm.options.no")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Revisit Reason */}
        <Select value={revisitReason} onValueChange={setRevisitReason}>
          <SelectTrigger className={baseClasses}>
            <SelectValue placeholder={t("dataForm.fields.revisitReason.placeholder")} />
          </SelectTrigger>
          <SelectContent className={baseClasses}>
            <SelectItem value="worsening">{t("dataForm.options.revisitReasons.worsening")}</SelectItem>
            <SelectItem value="new_issue">{t("dataForm.options.revisitReasons.newIssue")}</SelectItem>
            <SelectItem value="planned">{t("dataForm.options.revisitReasons.planned")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Read-only fields */}
        <ReadOnlyField label={t("dataForm.fields.readOnly.timeToFirstContact")} />
        <ReadOnlyField label={t("dataForm.fields.readOnly.timeWithoutCommunication")} />

        {/* Metadata */}
        <Textarea
          className="w-full h-24"
          placeholder='{"trigger": "auto", "rule": "LWBS > 30min"}'
          value={metadata}
          onChange={(e) => setMetadata(e.target.value)}
        />
      </CardContent>

      <div className="flex justify-end p-4">
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? t("dataForm.buttons.saving") : t("dataForm.buttons.saveExperienceFailure")}
        </Button>
      </div>
    </Card>
  );
}

/* ================================================= */
/* Helpers */
function ReadOnlyField({ label }: { label: string }) {
  return (
    <div className="space-y-2">
      <label className="font-medium">{label}</label>
      <Input className="mt-2" disabled placeholder="Derived by system" />
    </div>
  );
}
