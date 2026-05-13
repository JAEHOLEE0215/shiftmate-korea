"use client";

import {
  createDayPreview,
  formatWeeklyScheduleLine,
  getShiftShortLabel,
  type ShiftType,
  type WeekdayKey,
  type WeeklySchedule as WeeklyScheduleType,
  type WeeklySummary,
  weekdayLabels,
} from "@/lib/routine";

type WeeklyScheduleProps = {
  schedule: WeeklyScheduleType;
  summary: WeeklySummary;
  todayIndex: number;
  selectedDayIndex: number;
  onChangeDay: (day: WeekdayKey, shift: ShiftType) => void;
  onSelectDay: (index: number) => void;
  onReset: () => void;
  saved: boolean;
};

const shiftOptions: Array<{ value: ShiftType; label: string }> = [
  { value: "D", label: "D 주간" },
  { value: "S", label: "S 오후" },
  { value: "G", label: "G 야간" },
  { value: "N", label: "N 야간" },
  { value: "Off", label: "Off 휴무" },
  { value: "custom", label: "직접 입력" },
];

export function WeeklySchedule({
  schedule,
  summary,
  todayIndex,
  selectedDayIndex,
  onChangeDay,
  onSelectDay,
  onReset,
  saved,
}: WeeklyScheduleProps) {
  return (
    <section className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
      <div className="mb-3">
        <p className="text-xs font-bold text-leaf">주간 근무표</p>
        <h2 className="mt-1 text-base font-bold text-ink">월요일부터 일요일까지 근무를 저장하세요</h2>
        <p className="mt-1 break-keep text-sm leading-6 text-slate-700">
          직접 입력 근무시간은 현재 저장된 사용자 정의 시간을 사용합니다.
        </p>
        {saved ? (
          <p className="mt-2 rounded-lg bg-leaf/10 px-3 py-2 text-xs font-bold text-leaf">
            이번 주 근무표 저장됨
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
        {weekdayLabels.map((day, index) => {
          const shift = schedule[day.key];
          const isToday = index === todayIndex;
          const isSelected = index === selectedDayIndex;
          const preview = createDayPreview(shift);

          return (
            <article
              key={day.key}
              className={`rounded-lg border p-3 ${
                isSelected
                  ? "border-leaf bg-leaf/10"
                  : isToday
                    ? "border-amber bg-amber/10"
                    : "border-ink/10 bg-mist"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-extrabold text-ink">{day.short}</h3>
                  <p className="mt-1 text-xs font-bold text-slate-700">{getShiftShortLabel(shift)}</p>
                </div>
                <div className="space-y-1 text-right">
                  {isToday ? <p className="text-xs font-bold text-amber">오늘</p> : null}
                  {isSelected ? <p className="text-xs font-bold text-leaf">선택됨</p> : null}
                </div>
              </div>

              <select
                value={shift}
                onChange={(event) => onChangeDay(day.key, event.target.value as ShiftType)}
                aria-label={`${day.full} 근무 타입 선택`}
                className="mt-3 min-h-11 w-full rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm font-bold text-ink"
              >
                {shiftOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <ul className="mt-3 space-y-1 text-xs leading-5 text-slate-700">
                {preview.map((line) => (
                  <li key={line}>- {line}</li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => onSelectDay(index)}
                aria-label={`${day.full} 루틴 보기`}
                className="mt-3 min-h-11 w-full rounded-lg bg-ink px-3 py-2 text-sm font-bold text-white"
              >
                이 요일 루틴 보기
              </button>
            </article>
          );
        })}
      </div>

      <div className="mt-4 rounded-lg border border-ink/10 bg-mist p-3">
        <h3 className="text-sm font-bold text-ink">이번 주 루틴 요약</h3>
        <p className="mt-2 break-keep text-xs font-bold text-slate-700">
          {formatWeeklyScheduleLine(schedule)}
        </p>
        <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-5">
          <SummaryItem label="야간근무" value={`${summary.nightCount}일`} />
          <SummaryItem label="휴무" value={`${summary.offCount}일`} />
          <SummaryItem label="회복 우선 권장" value={`${summary.recoveryDays}일`} />
          <SummaryItem
            label="부업 집중 가능일"
            value={`${summary.sideHustleFocusMin}~${summary.sideHustleFocusMax}일`}
          />
          <SummaryItem
            label="예상 부업 가능 시간"
            value={`${summary.sideHustleHoursMin}~${summary.sideHustleHoursMax}시간`}
          />
        </dl>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="break-keep text-xs leading-5 text-slate-600">
          주간 근무표는 로그인 없이 이 기기 안에만 저장됩니다. 공용 PC에서는 사용 후 초기화를 권장합니다.
        </p>
        <button
          type="button"
          onClick={onReset}
          aria-label="주간 근무표 초기화"
          className="min-h-11 rounded-lg border border-coral px-4 py-2 text-sm font-bold text-coral"
        >
          근무표 초기화
        </button>
      </div>
    </section>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-3">
      <dt className="text-xs font-bold text-slate-600">{label}</dt>
      <dd className="mt-1 text-base font-extrabold text-ink">{value}</dd>
    </div>
  );
}
