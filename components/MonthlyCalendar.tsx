"use client";

import { useMemo, useState } from "react";
import { MonthlySummary } from "@/components/MonthlySummary";
import { PatternGenerator } from "@/components/PatternGenerator";
import {
  createDayPreview,
  createMonthDays,
  getMonthTitle,
  getShiftBadgeClass,
  getShiftShortLabel,
  type MonthlySchedule,
  type MonthlySummary as MonthlySummaryType,
  type RoutineResult,
  type ShiftType,
} from "@/lib/routine";

type MonthlyCalendarProps = {
  monthDate: Date;
  selectedDate: string;
  todayDate: string;
  schedule: MonthlySchedule;
  summary: MonthlySummaryType;
  selectedResult: RoutineResult;
  selectedShiftType: ShiftType;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (date: string) => void;
  onGenerateSchedule: (schedule: MonthlySchedule) => void;
  onCopyMonth: () => Promise<void>;
  onCopySelectedDate: () => Promise<void>;
};

const weekdayHeaders = ["일", "월", "화", "수", "목", "금", "토"];

export function MonthlyCalendar({
  monthDate,
  selectedDate,
  todayDate,
  schedule,
  summary,
  selectedResult,
  selectedShiftType,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
  onGenerateSchedule,
  onCopyMonth,
  onCopySelectedDate,
}: MonthlyCalendarProps) {
  const [copyState, setCopyState] = useState<"idle" | "month" | "date">("idle");
  const days = useMemo(() => createMonthDays(monthDate, schedule), [monthDate, schedule]);
  const selectedDateText = formatSelectedDate(selectedDate);
  const selectedPreview = createDayPreview(selectedShiftType);

  async function copyMonth() {
    await onCopyMonth();
    setCopyState("month");
    window.setTimeout(() => setCopyState("idle"), 1500);
  }

  async function copySelectedDate() {
    await onCopySelectedDate();
    setCopyState("date");
    window.setTimeout(() => setCopyState("idle"), 1500);
  }

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-bold text-leaf">장기 근무표 관리</p>
            <h2 className="mt-1 text-2xl font-extrabold text-ink">월간 캘린더</h2>
            <p className="mt-1 break-keep text-sm leading-6 text-slate-700">
              날짜별 근무를 확인하고, 선택한 날짜 기준으로 루틴과 부업 가능 시간을 바로 확인합니다.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onPrevMonth}
              aria-label="이전 달 보기"
              className="min-h-11 rounded-lg border border-ink/10 bg-mist px-4 py-2 text-sm font-bold text-ink"
            >
              이전 달
            </button>
            <button
              type="button"
              onClick={onNextMonth}
              aria-label="다음 달 보기"
              className="min-h-11 rounded-lg border border-ink/10 bg-mist px-4 py-2 text-sm font-bold text-ink"
            >
              다음 달
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-xl font-extrabold text-ink">{getMonthTitle(monthDate)}</h3>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={copyMonth}
              aria-label="이번 달 근무표 복사"
              className="min-h-11 rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white"
            >
              {copyState === "month" ? "복사됨" : "이번 달 근무표 복사"}
            </button>
            <button
              type="button"
              onClick={copySelectedDate}
              aria-label="선택 날짜 루틴 복사"
              className="min-h-11 rounded-lg border border-leaf bg-white px-4 py-2 text-sm font-bold text-leaf"
            >
              {copyState === "date" ? "복사됨" : "선택 날짜 루틴 복사"}
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-600">
          {weekdayHeaders.map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-1">
          {days.map((day) => {
            const isToday = day.date === todayDate;
            const isSelected = day.date === selectedDate;
            return (
              <button
                key={day.date}
                type="button"
                onClick={() => onSelectDate(day.date)}
                aria-label={`${day.date} ${getShiftShortLabel(day.shiftType)} 루틴 보기`}
                aria-pressed={isSelected}
                className={`min-h-[72px] rounded-lg border p-1 text-left transition sm:min-h-[88px] sm:p-2 ${
                  isSelected
                    ? "border-leaf bg-leaf/10"
                    : isToday
                      ? "border-amber bg-amber/10"
                      : day.inCurrentMonth
                        ? "border-ink/10 bg-mist"
                        : "border-slate-200 bg-slate-50 text-slate-500"
                }`}
              >
                <span className="block text-xs font-extrabold text-ink">{day.dayNumber}</span>
                <span
                  className={`mt-1 inline-flex max-w-full items-center rounded px-1.5 py-1 text-[10px] font-bold leading-none sm:text-xs ${getShiftBadgeClass(
                    day.shiftType,
                  )}`}
                >
                  {getShiftShortLabel(day.shiftType).split(" ")[0]}
                </span>
                <span className="mt-1 block min-h-4 text-[10px] font-bold text-slate-700">
                  {isToday ? "오늘" : ""}
                  {isSelected ? `${isToday ? " · " : ""}선택됨` : ""}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <MonthlySummary summary={summary} />

      <section className="rounded-lg border border-leaf/20 bg-leaf/10 p-4 shadow-soft">
        <p className="text-xs font-bold text-leaf">선택 날짜 상세</p>
        <h3 className="mt-1 text-xl font-extrabold text-ink">
          {selectedDateText} · {getShiftShortLabel(selectedShiftType)}
        </h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <DetailItem label="피로도" value={`${selectedResult.fatigueScore}점 · ${selectedResult.fatigueLabel}`} />
          <DetailItem label="부업 가능 시간" value={selectedResult.sideHustleTime.label} />
          <DetailItem label="추천 루틴" value={selectedResult.recommendedMode} />
        </div>
        <ul className="mt-3 space-y-1 text-sm font-bold leading-6 text-slate-700">
          {selectedPreview.map((line) => (
            <li key={line}>- {line}</li>
          ))}
        </ul>
        {selectedDate !== todayDate ? (
          <p className="mt-3 rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-700">
            선택한 날짜 기준 루틴입니다.
          </p>
        ) : null}
      </section>

      <PatternGenerator onGenerate={onGenerateSchedule} />

      <p className="break-keep rounded-lg bg-white px-4 py-3 text-xs font-bold leading-5 text-slate-600 shadow-soft">
        월간 근무표는 로그인 없이 이 기기 localStorage에만 저장됩니다. 공용 PC에서는 사용 후 초기화를 권장합니다.
      </p>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-3">
      <p className="text-xs font-bold text-slate-600">{label}</p>
      <p className="mt-1 break-keep text-base font-extrabold text-ink">{value}</p>
    </div>
  );
}

function formatSelectedDate(dateKey: string) {
  const date = new Date(`${dateKey}T00:00:00`);
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  return `${dateKey} · ${weekday}요일`;
}
