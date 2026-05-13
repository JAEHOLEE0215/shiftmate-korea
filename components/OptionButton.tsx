"use client";

type OptionButtonProps<T extends string> = {
  label: T;
  selected: boolean;
  onSelect: (value: T) => void;
  subLabel?: string;
  ariaLabel?: string;
};

export function OptionButton<T extends string>({
  label,
  selected,
  onSelect,
  subLabel,
  ariaLabel,
}: OptionButtonProps<T>) {
  return (
    <button
      type="button"
      onClick={() => onSelect(label)}
      aria-label={ariaLabel ?? `${label} 선택`}
      aria-pressed={selected}
      className={`min-h-16 rounded-lg border px-4 py-3 text-left transition ${
        selected
          ? "border-leaf bg-leaf text-white shadow-soft"
          : "border-ink/10 bg-white text-ink hover:border-leaf/50"
      }`}
    >
      <span className="block text-sm font-bold">{label}</span>
      {subLabel ? (
        <span className={`mt-1 block text-xs ${selected ? "text-white/80" : "text-ink/55"}`}>
          {subLabel}
        </span>
      ) : null}
      {selected ? (
        <span className="mt-2 inline-block rounded-md bg-white/20 px-2 py-1 text-xs font-bold">
          선택됨
        </span>
      ) : null}
    </button>
  );
}
