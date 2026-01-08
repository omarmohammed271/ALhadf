import { useContextData, useCreateContextData } from '@/api/endpoints/ContextDataEndpoints';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/FormFields';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ContextForm({ baseClasses }: { baseClasses: string }) {

  const {t} = useTranslation();

  const [contextData, setContextData] = useState<any>({
    shift: "day",
    staffing_level: "medium",
    er_capacity_level: "at",
    date: "",
    er_section: "main",
    metadata: "null",
  });

  console.log(contextData);
  
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

      <CardContent className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

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
                { value: "day", label: t("dataForm.fields.shift.choices.day") },
                { value: "evening", label: t("dataForm.fields.shift.choices.evening") },
                { value: "night", label: t("dataForm.fields.shift.choices.night") },
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
                { value: "low", label: t("dataForm.fields.staffingLevel.choices.low") },
                { value: "medium", label: t("dataForm.fields.staffingLevel.choices.medium") },
                { value: "high", label: t("dataForm.fields.staffingLevel.choices.high") },
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
                { value: "under", label: t("dataForm.fields.capacityLevel.choices.under") },
                { value: "at", label: t("dataForm.fields.capacityLevel.choices.at") },
                { value: "over", label: t("dataForm.fields.capacityLevel.choices.over") },
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
                { value: "main", label: t("dataForm.options.main.resus") },
                { value: "fasttrack", label: t("dataForm.options.fastTrack.resus") },
                { value: "trauma", label: t("dataForm.options.trauma.resus") },
                { value: "peds", label: t("dataForm.options.peds.resus") },
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
          <Input
            type="date"
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
        <div className='flex items-center'>
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
