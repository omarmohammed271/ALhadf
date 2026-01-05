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
import { createSatisfactionSignal } from "@/api/serviceAPI";

export default function PatientSatisfactionCard() {
  const { t } = useTranslation();
  const baseClasses = "bg-background border-border";

  const [visitId, setVisitId] = useState("");
  const [overallScore, setOverallScore] = useState("");
  const [waitingScore, setWaitingScore] = useState("");
  const [communicationScore, setCommunicationScore] = useState("");
  const [respectScore, setRespectScore] = useState("");
  const [freeTextComment, setFreeTextComment] = useState("");
  const [metadata, setMetadata] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      createSatisfactionSignal({
        visitId,
        overallScore,
        waitingScore,
        communicationScore,
        respectScore,
        freeTextComment,
        metadata: metadata ? JSON.parse(metadata) : {},
      }),
    onSuccess: () => {
      toast.success(t("dataForm.messages.savedSatisfactionSignal"));
    },
    onError: (err: any) => {
      toast.error(err?.message || t("dataForm.messages.failedSave"));
    },
  });

  const scoreOptions = ["1", "2", "3", "4", "5"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{t("dataForm.sections.patientSatisfaction.title")}</CardTitle>
        <CardDescription>{t("dataForm.sections.patientSatisfaction.description")}</CardDescription>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ER Visit Reference */}
        <Input
          placeholder={t("dataForm.fields.visit.label")}
          value={visitId}
          onChange={(e) => setVisitId(e.target.value)}
        />

        {/* Satisfaction Scores */}
        {[
          { key: "overall", value: overallScore, setter: setOverallScore },
          { key: "waiting", value: waitingScore, setter: setWaitingScore },
          { key: "communication", value: communicationScore, setter: setCommunicationScore },
          { key: "respect", value: respectScore, setter: setRespectScore },
        ].map(({ key, value, setter }) => (
          <Select key={key} value={value} onValueChange={setter}>
            <SelectTrigger className={baseClasses}>
              <SelectValue placeholder={t("dataForm.fields.satisfaction.placeholder")} />
            </SelectTrigger>
            <SelectContent className={baseClasses}>
              {scoreOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        {/* Free-text Comment */}
        <Textarea
          className="w-full h-28"
          placeholder={t("dataForm.fields.freeTextComment.placeholder")}
          value={freeTextComment}
          onChange={(e) => setFreeTextComment(e.target.value)}
        />

        {/* Metadata */}
        <Textarea
          className="w-full h-24"
          placeholder='{"source": "SMS", "language": "ar"}'
          value={metadata}
          onChange={(e) => setMetadata(e.target.value)}
        />
      </CardContent>

      <div className="flex justify-end p-4">
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? t("dataForm.buttons.saving") : t("dataForm.buttons.saveSatisfactionSignal")}
        </Button>
      </div>
    </Card>
  );
}
