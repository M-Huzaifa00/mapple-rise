interface Option<T extends string> {
  value: T;
  label: string;
}

/** Single-select filter chips (toggle buttons). Scrolls sideways on small screens. */
export function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.value)}
            className={`min-h-11 shrink-0 rounded-sm border px-3.5 text-[0.95rem] font-semibold whitespace-nowrap transition-colors ${
              on ? 'border-brand-800 bg-brand-800 text-white' : 'border-line bg-white text-ink-soft hover:border-brand-700 hover:text-brand-800'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
