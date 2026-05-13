"use client";

import { useEffect, useState } from "react";
import type { RoutineInput, RoutineResult as RoutineResultType } from "@/lib/routine";
import {
  formatHandoverMemo,
  formatRoutineText,
  getPatternText,
  getShiftText,
} from "@/lib/routine";

type RoutineResultProps = {
  input: RoutineInput;
  result: RoutineResultType;
  onCopy: () => void;
  copied: boolean;
  selectedDayLabel?: string;
  isTodaySelected?: boolean;
  weeklySummaryText?: string;
};

const toneClass = {
  rest: "border-l-leaf",
  work: "border-l-slate-300",
  growth: "border-l-amber",
  care: "border-l-coral",
};

function fatigueColor(score: number) {
  if (score >= 70) return "bg-coral text-white";
  if (score >= 40) return "bg-amber text-slate-950";
  return "bg-leaf text-white";
}

export function RoutineResult({
  input,
  result,
  onCopy,
  copied,
  selectedDayLabel,
  isTodaySelected = true,
  weeklySummaryText,
}: RoutineResultProps) {
  const [memoCopied, setMemoCopied] = useState(false);

  useEffect(() => {
    if (!memoCopied) return;
    const timer = window.setTimeout(() => setMemoCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [memoCopied]);

  async function copyHandoverMemo() {
    await navigator.clipboard.writeText(formatHandoverMemo(result));
    setMemoCopied(true);
  }

  return (
    <section
      id="result"
      className="scroll-mt-4 rounded-lg bg-slate-950 p-4 text-slate-100 shadow-soft"
    >
      <div className="rounded-lg border border-slate-600/70 bg-slate-900 p-3">
        <p className="text-xs font-bold text-amber">오늘 요약</p>
        {selectedDayLabel ? (
          <p className="mt-2 text-sm font-bold text-slate-200">
            선택 요일: {selectedDayLabel}
            {isTodaySelected ? " · 오늘 기준 루틴입니다." : " · 선택한 요일 기준 루틴입니다."}
          </p>
        ) : null}
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-6">
          <SummaryItem label="근무" value={getShiftText(input)} />
          <SummaryItem label="패턴" value={getPatternText(input)} />
          <SummaryItem label="목표" value={input.goal} />
          <div className="rounded-lg border border-slate-600/70 bg-slate-800/90 p-3">
            <p className="text-xs font-bold text-slate-300">피로도</p>
            <div className="mt-1 flex items-end gap-2">
              <span className="text-3xl font-extrabold text-white">{result.fatigueScore}</span>
              <span className="pb-1 text-xs font-bold text-slate-200">점</span>
            </div>
            <span
              className={`mt-2 inline-block rounded-md px-2 py-1 text-xs font-bold ${fatigueColor(
                result.fatigueScore,
              )}`}
            >
              {result.fatigueLabel}
            </span>
          </div>
          <SummaryItem label="권장 모드" value={result.recommendedMode} />
          <SummaryItem label="부업 시간" value={result.sideHustleTime.label} />
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-amber">생성 결과</p>
          <h2 className="mt-1 text-xl font-extrabold leading-7 text-white">{result.title}</h2>
          <p className="mt-2 break-keep text-sm leading-6 text-slate-300">{result.summary}</p>
        </div>
        <button
          type="button"
          onClick={onCopy}
          aria-label="전체 루틴 공유용 텍스트 복사"
          className="min-h-11 shrink-0 rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-950"
        >
          {copied ? "복사됨" : "전체 복사"}
        </button>
      </div>

      <div className="mt-4 rounded-lg border border-amber/60 bg-slate-800/90 p-3">
        <p className="text-sm font-bold text-white">오늘의 핵심 루틴</p>
        <p className="mt-1 break-keep text-sm leading-6 text-slate-200">{result.coreRoutine}</p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-600/70 bg-slate-800/90 p-3">
          <p className="text-xs font-bold text-slate-300">피로도 설명</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-3xl font-extrabold text-white">{result.fatigueScore}</span>
            <span
              className={`rounded-md px-2 py-1 text-xs font-bold ${fatigueColor(
                result.fatigueScore,
              )}`}
            >
              {result.fatigueLabel}
            </span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-slate-700">
            <div className="h-2 rounded-full bg-amber" style={{ width: `${result.fatigueScore}%` }} />
          </div>
          <p className="mt-2 break-keep text-xs leading-5 text-slate-300">{result.fatigueNote}</p>
        </div>

        <div className="rounded-lg border border-slate-600/70 bg-slate-800/90 p-3">
          <p className="text-xs font-bold text-slate-300">오늘 확보 가능한 부업 시간</p>
          <p className="mt-2 text-3xl font-extrabold text-white">{result.sideHustleTime.label}</p>
          <p className="mt-1 text-xs font-semibold text-slate-300">
            예상 가능 시간: {result.sideHustleTime.minutes}분 기준
          </p>
          <p className="mt-3 text-sm font-bold text-white">추천 작업 유형</p>
          <p className="mt-1 break-keep text-sm leading-6 text-slate-200">
            {result.sideHustleTime.workType}
          </p>
          <p className="mt-2 break-keep text-xs leading-5 text-slate-300">
            {result.sideHustleTime.note}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {result.schedule.map((item) => (
          <article
            key={`${item.time}-${item.title}`}
            className={`rounded-lg border border-slate-600/70 border-l-4 bg-slate-800/90 p-3 ${toneClass[item.tone]}`}
          >
            <div className="flex items-start gap-3">
              <p className="w-24 shrink-0 text-sm font-extrabold text-slate-200">{item.time}</p>
              <div>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="mt-1 break-keep text-sm leading-5 text-slate-300">{item.detail}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-slate-600/70 bg-slate-800/90 p-3">
        <h3 className="text-sm font-bold text-white">오늘의 추천 행동 3개</h3>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-200">
          {result.actions.map((action) => (
            <li className="break-keep" key={action}>
              {action}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-3 rounded-lg border border-slate-600/70 bg-slate-800/90 p-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-bold text-white">{result.handoverMemo.title}</h3>
          <button
            type="button"
            onClick={copyHandoverMemo}
            aria-label="인수인계 메모만 복사"
            className="min-h-11 shrink-0 rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-950"
          >
            {memoCopied ? "복사됨" : "메모 복사"}
          </button>
        </div>
        <div className="mt-2 space-y-2 text-sm leading-6 text-slate-200">
          {result.handoverMemo.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-coral/70 bg-slate-800/90 p-3 text-sm leading-6">
        <p className="font-bold text-white">피로도 주의</p>
        <p className="break-keep text-slate-200">{result.caution}</p>
      </div>

      <textarea
        className="sr-only"
        readOnly
        value={formatRoutineText(input, result, weeklySummaryText)}
        aria-label="복사용 루틴 텍스트"
      />
    </section>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-600/70 bg-slate-800/90 p-3">
      <p className="text-xs font-bold text-slate-300">{label}</p>
      <p className="mt-1 break-keep text-sm font-extrabold leading-5 text-white">{value}</p>
    </div>
  );
}
