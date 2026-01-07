import { useUsers, useERVisits, useCreateERVisit } from '@/api/endpoints/ERVisitsEndpoints';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/FormFields';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toISO } from '@/utils/dateHelpers';
import { t } from 'i18next';
import React, { useState } from 'react';

export default function ERVisit({baseClasses}: {baseClasses: string}){

    
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

  
  // ERVisit 
  const { data: allUsers = [], isPending: usersPending } = useUsers();
  const { mutate: erVisitMutation, isPending: erVisitPending } = useCreateERVisit();

  return (
      <div>
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
      </div>
  );
};