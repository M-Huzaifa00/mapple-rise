import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { projectById } from '../../data/projects';
import { useLang } from '../../i18n/useLang';
import { submitLead, type Lead } from '../../lib/leads';
import { dialFor, normalizePhone } from '../../lib/phone';
import { quickLeadSchema } from '../../lib/validation';
import { useUI } from '../../state/ui';
import { buttonStyles } from '../ui/buttonStyles';
import { Honeypot, PhoneField, SelectField, TextField } from '../ui/FormFields';
import { FormSuccess } from '../ui/FormSuccess';
import { ProjectOptions } from '../ui/ProjectOptions';

/** RBS lead-capture pattern beside the hero: name, phone, interested society. */
export function LeadForm() {
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
    resolver: zodResolver(quickLeadSchema),
    defaultValues: { name: '', country: 'PK', phone: '', project: '', website: '' },
  });
  const country = useWatch({ control, name: 'country' });

  const onSubmit = handleSubmit(async (v) => {
    const phone = normalizePhone(v.phone, dialFor(v.country));
    if (!phone) return;
    const result = await submitLead({ source: 'hero', name: v.name, phone, project: v.project, website: v.website });
    if (result.ok) {
      setLead(result.lead);
      toast(t('form.savedToast'));
    }
  });

  const projectName = lead?.project ? projectById(lead.project)?.name : undefined;

  return (
    <aside aria-labelledby="lead-title" className="rounded-md border border-line bg-white p-5 sm:p-6">
      <h2 id="lead-title" className="text-3xl leading-tight">
        {t('lead.title')}
      </h2>
      <p className="mt-2 text-ink-soft">{t('lead.intro')}</p>

      {lead ? (
        <FormSuccess
          title={t('form.successTitle')}
          body={t('form.successBody')}
          waLabel={t('form.continueWhatsApp')}
          waMessage={projectName ? t('wa.lead', { name: lead.name, project: projectName }) : t('wa.leadGeneral', { name: lead.name })}
          onReset={() => {
            reset();
            setLead(null);
          }}
        />
      ) : (
        <form noValidate onSubmit={onSubmit} className="relative mt-5 space-y-4">
          <TextField label={t('form.name')} autoComplete="name" error={errors.name?.message} {...register('name')} />
          <PhoneField country={country} countryProps={register('country')} phoneProps={register('phone')} error={errors.phone?.message} />
          <SelectField label={t('lead.interest')} error={errors.project?.message} {...register('project')}>
            <option value="">{t('form.choose')}</option>
            <ProjectOptions />
          </SelectField>
          <Honeypot {...register('website')} />
          <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className={`${buttonStyles.primary} w-full`}>
            {isSubmitting ? t('form.sending') : t('lead.submit')}
          </button>
        </form>
      )}
    </aside>
  );
}
