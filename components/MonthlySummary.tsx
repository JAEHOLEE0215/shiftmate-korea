"use client";

import type { MonthlySummary as MonthlySummaryType } from "@/lib/routine";

type MonthlySummaryProps = {
  summary: MonthlySummaryType;
};

export function MonthlySummary({ summary }: MonthlySummaryProps) {
  return (
    <section className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-bold text-leaf">이번 달 요약</p>
        <h3 className="mt-1 text-lg font-extrabold text-ink">근무 흐름과 회복 일정을 한눈에 확인하세요</h3>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-6">
        <SummaryItem label="근무일" value={`${summary.workDays}일`} />
        <SummaryItem label="야간근무" value={`${summary.nightDays}일`} />
        <SummaryItem label="휴무" value={`${summary.offDays}일`} />
        <SummaryItem label="회복 우선 권장" value={`${summary.recoveryDays}일`} />
        <SummaryItem
          label="예상 부업 가능 시간"
          value={`${summary.sideHustleHoursMin}~${summary.sideHustleHoursMax}시간`}
        />
        <SummaryItem label="가장 많은 근무" value={summary.mostCommonShift} />
      </dl>
    </section>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-mist p-3">
      <dt className="text-xs font-bold text-slate-600">{label}</dt>
      <dd className="mt-1 break-keep text-lg font-extrabold text-ink">{value}</dd>
    </div>
  );
}
