import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { projectById } from '../../data/projects';
import { useLang } from '../../i18n/useLang';
import { submitLead, type Lead } from '../../lib/leads';
import { dialFor, normalizePhone } from '../../lib/phone';
import { callbackSchema } from '../../lib/validation';
import { useUI } from '../../state/ui';
import { buttonStyles } from '../ui/buttonStyles';
import { Honeypot, PhoneField, RadioCards, SelectField, TextField } from '../ui/FormFields';
import { FormSuccess } from '../ui/FormSuccess';
import { ProjectOptions } from '../ui/ProjectOptions';

export function CallBackForm() {
  const { t } = useLang();
  const { toast } = useUI();
  const [lead, setLead] = useState<Lead | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(callbackSchema),
    defaultValues: { name: '', country: 'PK', phone: '', project: '', website: '' },
  });
  const country = useWatch({ control, name: 'country' });

  const onSubmit = handleSubmit(async (v) => {
    const phone = normalizePhone(v.phone, dialFor(v.country));
    if (!phone) return;
    const result = await submitLead({
      source: 'callback',
      name: v.name,
      phone,
      preferredTime: v.preferredTime,
      project: v.project || undefined,
      website: v.website,
    });
    if (result.ok) {
      setLead(result.lead);
      toast(t('form.savedToast'));
    }
  });

  if (lead) {
    const projectName = lead.project ? projectById(lead.project)?.name : undefined;
    return (
      <FormSuccess
        title={t('form.successTitle')}
        body={t('contact.callbackSuccess', { time: t(`time.${lead.preferredTime ?? 'morning'}`) })}
        waLabel={t('form.continueWhatsApp')}
        waMessage={projectName ? t('wa.lead', { name: lead.name, project: projectName }) : t('wa.leadGeneral', { name: lead.name })}
        onReset={() => {
          reset();
          setLead(null);
        }}
      />
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="relative space-y-5">
      <TextField label={t('form.name')} autoComplete="name" error={errors.name?.message} {...register('name')} />
      <PhoneField country={country} countryProps={register('country')} phoneProps={register('phone')} error={errors.phone?.message} />
      <RadioCards
        legend={t('contact.preferredTime')}
        options={(['morning', 'afternoon', 'evening'] as const).map((v) => ({ value: v, label: t(`time.${v}`) }))}
        error={errors.preferredTime?.message}
        inputProps={register('preferredTime')}
      />
      <SelectField label={t('contact.project')} {...register('project')}>
        <option value="">{t('form.notSure')}</option>
        <ProjectOptions />
      </SelectField>
      <Honeypot {...register('website')} />
      <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className={`${buttonStyles.primary} w-full`}>
        {isSubmitting ? t('form.sending') : t('contact.callbackSubmit')}
      </button>
    </form>
  );
}
