"use client";

import { useState } from "react";
import { generateMonthlyScheduleByPattern, getLocalDateKey, type MonthlySchedule } from "@/lib/routine";

type PatternGeneratorProps = {
  onGenerate: (schedule: MonthlySchedule) => void;
};

const patternOptions = [
  "4조3교대 기본",
  "3조2교대 기본",
  "2교대 기본",
  "주야비",
  "주주야야비비",
  "직접 패턴 입력",
];

const durationOptions = [30, 60, 90];

export function PatternGenerator({ onGenerate }: PatternGeneratorProps) {
  const [startDate, setStartDate] = useState(getLocalDateKey());
  const [pattern, setPattern] = useState("4조3교대 기본");
  const [customPattern, setCustomPattern] = useState("D,D,S,S,G,G,Off,Off");
  const [days, setDays] = useState(30);
  const [saved, setSaved] = useState(false);

  function handleGenerate() {
    const confirmed = window.confirm(
      "반복 패턴을 생성하면 선택한 기간의 월간 캘린더 데이터가 새 근무표로 덮어써집니다. 계속할까요?",
    );
    if (!confirmed) return;

    const nextSchedule = generateMonthlyScheduleByPattern({
      startDate,
      pattern,
      customPattern,
      days,
    });
    onGenerate(nextSchedule);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  return (
    <section className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
      <div>
        <p className="text-xs font-bold text-leaf">반복 패턴으로 근무표 생성</p>
        <h3 className="mt-1 text-lg font-extrabold text-ink">시작일부터 패턴을 반복해 날짜별 근무를 채웁니다</h3>
        <p className="mt-1 break-keep text-sm leading-6 text-slate-700">
          회사별 근무표가 반복된다면 30일, 60일, 90일 단위로 빠르게 입력할 수 있습니다.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <label className="text-sm font-bold text-ink">
          시작일
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            aria-label="반복 패턴 시작일"
            className="mt-2 min-h-11 w-full rounded-lg border border-ink/10 bg-mist px-3 py-2 text-sm font-bold text-ink outline-none focus:border-leaf"
          />
        </label>

        <label className="text-sm font-bold text-ink">
          패턴 선택
          <select
            value={pattern}
            onChange={(event) => setPattern(event.target.value)}
            aria-label="반복 패턴 선택"
            className="mt-2 min-h-11 w-full rounded-lg border border-ink/10 bg-mist px-3 py-2 text-sm font-bold text-ink outline-none focus:border-leaf"
          >
            {patternOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-bold text-ink">
          생성 기간
          <select
            value={days}
            onChange={(event) => setDays(Number(event.target.value))}
            aria-label="근무표 생성 기간"
            className="mt-2 min-h-11 w-full rounded-lg border border-ink/10 bg-mist px-3 py-2 text-sm font-bold text-ink outline-none focus:border-leaf"
          >
            {durationOptions.map((option) => (
              <option key={option} value={option}>
                {option}일
              </option>
            ))}
          </select>
        </label>
      </div>

      {pattern === "직접 패턴 입력" ? (
        <label className="mt-3 block text-sm font-bold text-ink">
          직접 패턴
          <input
            value={customPattern}
            onChange={(event) => setCustomPattern(event.target.value)}
            placeholder="예: D,D,S,S,G,G,Off,Off"
            aria-label="직접 반복 패턴 입력"
            className="mt-2 min-h-11 w-full rounded-lg border border-ink/10 bg-mist px-3 py-2 text-sm font-normal text-ink outline-none focus:border-leaf"
          />
        </label>
      ) : null}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleGenerate}
          aria-label="반복 패턴으로 월간 근무표 생성"
          className="min-h-11 rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white"
        >
          근무표 생성
        </button>
        {saved ? (
          <p className="rounded-lg bg-leaf/10 px-3 py-2 text-xs font-bold text-leaf">
            이번 달 근무표 생성 완료
          </p>
        ) : null}
      </div>
    </section>
  );
}
