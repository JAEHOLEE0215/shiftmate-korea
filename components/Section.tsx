type SectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function Section({ title, description, children }: SectionProps) {
  return (
    <section className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
      <div className="mb-3">
        <h2 className="text-base font-bold text-ink">{title}</h2>
        {description ? <p className="mt-1 text-sm leading-6 text-ink/60">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
