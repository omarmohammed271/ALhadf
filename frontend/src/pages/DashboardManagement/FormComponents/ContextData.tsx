import { useContextData, useCreateContextData } from '@/api/endpoints/ContextDataEndpoints';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/FormFields';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { t } from 'i18next';
import { useState } from 'react';

export default function ContextForm({ baseClasses }: { baseClasses: string }) {
  const [contextData, setContextData] = useState<any>({
    shift: "day",
    staffing_level: "medium",
    er_capacity_level: "at",
    date: "",
    er_section: "main",
    metadata: "null",
  });

  const { data: existingContext = [], isPending: contextPending } = useContextData();
  const { mutate: createContextMutation, isPending: createPending } = useCreateContextData();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {t("dataForm.sections.erContext.title")}
        </CardTitle>
        <CardDescription className="text-md">
          {t("dataForm.sections.erContext.description")}
        </CardDescription>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 col-span-2">

        {/* Shift */}
        <Field
          label={t("dataForm.fields.shift.label")}
          description={t("dataForm.fields.shift.description")}
        >
          <Select onValueChange={(value) => setContextData({ ...contextData, shift: value })}>
            <SelectTrigger className={baseClasses}>
              <SelectValue placeholder={t("dataForm.fields.shift.placeholder")} />
            </SelectTrigger>
            <SelectContent className={baseClasses}>
              {[
                { value: "day", label: "Day (07:00 - 15:00)" },
                { value: "evening", label: "Evening (15:00 - 23:00)" },
                { value: "night", label: "Night (23:00 - 07:00)" },
              ].map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* Staffing Level */}
        <Field
          label={t("dataForm.fields.staffingLevel.label")}
          description={t("dataForm.fields.staffingLevel.description")}
        >
          <Select onValueChange={(value) => setContextData({ ...contextData, staffing_level: value })}>
            <SelectTrigger className={baseClasses}>
              <SelectValue placeholder={t("dataForm.fields.staffingLevel.placeholder")} />
            </SelectTrigger>
            <SelectContent className={baseClasses}>
              {[
                { value: "low", label: "Low Staffing" },
                { value: "medium", label: "Normal Staffing" },
                { value: "high", label: "Full Staffing" },
              ].map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* ER Capacity Level */}
        <Field
          label={t("dataForm.fields.capacityLevel.label")}
          description={t("dataForm.fields.capacityLevel.description")}
        >
          <Select onValueChange={(value) => setContextData({ ...contextData, er_capacity_level: value })}>
            <SelectTrigger className={baseClasses}>
              <SelectValue placeholder={t("dataForm.fields.capacityLevel.placeholder")} />
            </SelectTrigger>
            <SelectContent className={baseClasses}>
              {[
                { value: "under", label: "Under Capacity" },
                { value: "at", label: "At Capacity" },
                { value: "over", label: "Over Capacity" },
              ].map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* ER Section */}
        <Field
          label={t("dataForm.fields.erSection.label")}
          description={t("dataForm.fields.erSection.description")}
        >
          <Select onValueChange={(value) => setContextData({ ...contextData, er_section: value })}>
            <SelectTrigger className={baseClasses}>
              <SelectValue placeholder={t("dataForm.fields.erSection.placeholder")} />
            </SelectTrigger>
            <SelectContent className={baseClasses}>
              {[
                { value: "main", label: "Main ER" },
                { value: "fasttrack", label: "Fast Track" },
                { value: "trauma", label: "Trauma Bay" },
                { value: "peds", label: "Pediatrics" },
              ].map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* Date */}
        <Field
          label={t("dataForm.fields.date.label")}
          description={t("dataForm.fields.date.description")}
        >
          <input
            type="date"
            className={`w-full rounded-xl ` + baseClasses}
            value={contextData.date}
            onChange={(e) => setContextData({ ...contextData, date: e.target.value })}
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
            value={contextData.metadata}
            onChange={(e) => setContextData({ ...contextData, metadata: e.target.value })}
            placeholder='{"source": "manual", "notes": ""}'
          />
        </Field>

        {/* Save Button */}
        <div>
          <Button
            className=""
            onClick={() => createContextMutation({ ...contextData })}
            disabled={createPending}
          >
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
