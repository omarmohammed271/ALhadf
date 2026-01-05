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
import { createCommunicationEvent } from "@/api/serviceAPI";

export default function CommunicationEventCard() {
  const { t } = useTranslation();
  const baseClasses = "bg-background border-border";

  const [visitId, setVisitId] = useState("");
  const [eventType, setEventType] = useState("initial");
  const [staffRole, setStaffRole] = useState("");
  const [initiatedBy, setInitiatedBy] = useState("");
  const [metadata, setMetadata] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      createCommunicationEvent({
        visitId,
        eventType,
        staffRole,
        initiatedBy,
        metadata: metadata ? JSON.parse(metadata) : {},
      }),
    onSuccess: () => {
      toast.success(t("dataForm.messages.savedCommunicationEvent"));
    },
    onError: (err: any) => {
      toast.error(err?.message || t("dataForm.messages.failedSave"));
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{t("dataForm.sections.communicationEvent.title")}</CardTitle>
        <CardDescription>{t("dataForm.sections.communicationEvent.description")}</CardDescription>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ER Visit Reference */}
        <Input
          placeholder={t("dataForm.fields.visit.label")}
          value={visitId}
          onChange={(e) => setVisitId(e.target.value)}
        />

        {/* Event Type */}
        <Select value={eventType} onValueChange={setEventType}>
          <SelectTrigger className={baseClasses}>
            <SelectValue placeholder={t("dataForm.fields.eventType.placeholder")} />
          </SelectTrigger>
          <SelectContent className={baseClasses}>
            <SelectItem value="initial">{t("dataForm.options.communicationEvent.initial")}</SelectItem>
            <SelectItem value="delay_update">{t("dataForm.options.communicationEvent.delayUpdate")}</SelectItem>
            <SelectItem value="clinical_update">{t("dataForm.options.communicationEvent.clinicalUpdate")}</SelectItem>
            <SelectItem value="other">{t("dataForm.options.communicationEvent.other")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Staff Role */}
        <Select value={staffRole} onValueChange={setStaffRole}>
          <SelectTrigger className={baseClasses}>
            <SelectValue placeholder={t("dataForm.fields.staffRole.placeholder")} />
          </SelectTrigger>
          <SelectContent className={baseClasses}>
            <SelectItem value="nurse">{t("dataForm.options.roles.nurse")}</SelectItem>
            <SelectItem value="physician">{t("dataForm.options.roles.physician")}</SelectItem>
            <SelectItem value="admin">{t("dataForm.options.roles.admin")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Initiated By */}
        <Select value={initiatedBy} onValueChange={setInitiatedBy}>
          <SelectTrigger className={baseClasses}>
            <SelectValue placeholder={t("dataForm.fields.initiatedBy.placeholder")} />
          </SelectTrigger>
          <SelectContent className={baseClasses}>
            <SelectItem value="staff">{t("dataForm.options.initiatedBy.staff")}</SelectItem>
            <SelectItem value="patient">{t("dataForm.options.initiatedBy.patient")}</SelectItem>
          </SelectContent>
        </Select>

        {/* Metadata */}
        <Textarea
          className="w-full h-28"
          placeholder='{"message": "Updated wait time", "channel": "verbal"}'
          value={metadata}
          onChange={(e) => setMetadata(e.target.value)}
        />
      </CardContent>

      <div className="flex justify-end p-4">
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? t("dataForm.buttons.saving") : t("dataForm.buttons.saveCommunicationEvent")}
        </Button>
      </div>
    </Card>
  );
}
