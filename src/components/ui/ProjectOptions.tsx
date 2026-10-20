import { menuGroups, projects } from '../../data/projects';
import { useLang } from '../../i18n/useLang';

/** <option>s for every project, grouped like the mega menu. Value = project id. */
export function ProjectOptions() {
  const { t } = useLang();
  return (
    <>
      {menuGroups.map((g) => (
        <optgroup key={g.id} label={t(`nav.group.${g.id}`)}>
          {projects
            .filter((p) => (g.cities as readonly string[]).includes(p.city))
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.parent ? t('projects.subOf', { parent: 'Capital Smart City', name: p.name }) : p.name}
              </option>
            ))}
        </optgroup>
      ))}
    </>
  );
}
