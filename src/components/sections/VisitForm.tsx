import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { projectById } from '../../data/projects';
import { useLang } from '../../i18n/useLang';
import { submitVisit, type Visit, type VisitType } from '../../lib/leads';
import { dialFor, normalizePhone } from '../../lib/phone';
import { todayISO, visitSchema } from '../../lib/validation';
import { useUI } from '../../state/ui';
import { buttonStyles } from '../ui/buttonStyles';
import { Honeypot, PhoneField, RadioCards, SelectField, TextField } from '../ui/FormFields';
import { FormSuccess } from '../ui/FormSuccess';
import { ProjectOptions } from '../ui/ProjectOptions';

/** Book a site visit or a video-call virtual tour. Saved to localStorage, confirmed on WhatsApp. */
export function VisitForm({ preset }: { preset?: { type: VisitType; projectId?: string; nonce: number } | null }) {
  const { t, date } = useLang();
  const { toast } = useUI();
  const [visit, setVisit] = useState<Visit | null>(null);
  const [minDate, setMinDate] = useState<string | undefined>(undefined);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(visitSchema),
    defaultValues: { name: '', country: 'PK', phone: '', project: '', visitType: 'site' as VisitType, date: '', website: '' },
  });
  const country = useWatch({ control, name: 'country' });

  // Date bounds depend on "today", so they're set after hydration.
  // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only value
  useEffect(() => setMinDate(todayISO()), []);

  useEffect(() => {
    if (!preset) return;
    setValue('visitType', preset.type);
    if (preset.projectId) setValue('project', preset.projectId);
  }, [preset, setValue]);

  const onSubmit = handleSubmit(async (v) => {
    const phone = normalizePhone(v.phone, dialFor(v.country));
    if (!phone) return;
    const result = await submitVisit({
      name: v.name,
      phone,
      project: v.project,
      visitType: v.visitType,
      date: v.date,
      timeOfDay: v.timeOfDay,
      website: v.website,
    });
    if (result.ok) {
      setVisit(result.visit);
      toast(t('form.savedToast'));
    }
  });

  if (visit) {
    const details = {
      name: visit.name,
      type: t(`contact.visitTypes.${visit.visitType}`),
      project: projectById(visit.project)?.name ?? visit.project,
      date: date(visit.date),
      time: t(`time.${visit.timeOfDay}`),
    };
    return (
      <FormSuccess
        title={t('contact.visitSuccessTitle')}
        body={t('contact.visitSuccess', details)}
        waLabel={t('contact.confirmWhatsApp')}
        waMessage={t('wa.visit', details)}
        onReset={() => {
          reset();
          setVisit(null);
        }}
      />
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="relative space-y-5">
      <RadioCards
        legend={t('contact.visitType')}
        options={(['site', 'virtual'] as const).map((v) => ({ value: v, label: t(`contact.visitTypes.${v}`) }))}
        error={errors.visitType?.message}
        inputProps={register('visitType')}
      />
      <SelectField label={t('contact.project')} error={errors.project?.message} {...register('project')}>
        <option value="">{t('form.choose')}</option>
        <ProjectOptions />
      </SelectField>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label={t('contact.date')} type="date" min={minDate} error={errors.date?.message} className="field-input tabular" {...register('date')} />
        <TextField label={t('form.name')} autoComplete="name" error={errors.name?.message} {...register('name')} />
      </div>
      <RadioCards
        legend={t('contact.preferredTime')}
        options={(['morning', 'afternoon', 'evening'] as const).map((v) => ({ value: v, label: t(`time.${v}`) }))}
        error={errors.timeOfDay?.message}
        inputProps={register('timeOfDay')}
      />
      <PhoneField country={country} countryProps={register('country')} phoneProps={register('phone')} error={errors.phone?.message} />
      <Honeypot {...register('website')} />
      <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className={`${buttonStyles.primary} w-full`}>
        {isSubmitting ? t('form.sending') : t('contact.visitSubmit')}
      </button>
    </form>
  );
}
