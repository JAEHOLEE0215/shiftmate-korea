"use client";

import type { RoutineInput, RoutineResult, WeekdayKey, WeeklySchedule } from "@/lib/routine";
import { getShiftShortLabel, getShiftText, weekdayLabels } from "@/lib/routine";

type SummaryDashboardProps = {
  input: RoutineInput;
  result: RoutineResult;
  todayKey: WeekdayKey;
  selectedDayLabel: string;
  selectedIsToday: boolean;
  weeklySchedule: WeeklySchedule;
};

export function SummaryDashboard({
  input,
  result,
  todayKey,
  selectedDayLabel,
  selectedIsToday,
  weeklySchedule,
}: SummaryDashboardProps) {
  const todayLabel = weekdayLabels.find((day) => day.key === todayKey)?.full ?? "오늘";

  return (
    <section className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
      <div className="mb-3">
        <p className="text-xs font-bold text-leaf">오늘 요약</p>
        <h2 className="mt-1 text-lg font-extrabold text-ink">
          {selectedIsToday ? todayLabel : selectedDayLabel} 기준 루틴
        </h2>
        <p className="mt-1 text-sm font-bold text-slate-700">
          오늘은 {todayLabel} · 저장된 근무: {getShiftShortLabel(weeklySchedule[todayKey])}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <DashboardItem label="근무" value={getShiftText(input)} helper={input.shiftMemo || "선택한 근무 기준"} />
        <DashboardItem
          label="피로도"
          value={`${result.fatigueScore}점`}
          helper={result.fatigueLabel}
        />
        <DashboardItem
          label="부업 가능 시간"
          value={result.sideHustleTime.label}
          helper={result.sideHustleTime.workType}
        />
        <DashboardItem label="권장 모드" value={result.recommendedMode} helper="회복과 성장 균형 확인" />
      </div>
    </section>
  );
}

function DashboardItem({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <article className="rounded-lg bg-mist p-4">
      <p className="text-xs font-bold text-slate-600">{label}</p>
      <p className="mt-1 break-keep text-2xl font-extrabold text-ink">{value}</p>
      <p className="mt-1 break-keep text-sm leading-5 text-slate-700">{helper}</p>
    </article>
  );
}
