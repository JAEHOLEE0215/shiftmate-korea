"use client";

import type { RoutineInput, RoutineResult as RoutineResultType } from "@/lib/routine";
import { formatRoutineText } from "@/lib/routine";

type RoutineResultProps = {
  input: RoutineInput;
  result: RoutineResultType;
  onCopy: () => void;
  copied: boolean;
};

const toneClass = {
  rest: "border-l-leaf bg-leaf/5",
  work: "border-l-ink bg-ink/5",
  growth: "border-l-amber bg-amber/10",
  care: "border-l-coral bg-coral/10",
};

function fatigueColor(score: number) {
  if (score >= 80) return "bg-coral text-white";
  if (score >= 60) return "bg-amber text-ink";
  return "bg-leaf text-white";
}

export function RoutineResult({ input, result, onCopy, copied }: RoutineResultProps) {
  return (
    <section className="rounded-lg bg-ink p-4 text-white shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-amber">생성 결과</p>
          <h2 className="mt-1 text-xl font-extrabold leading-7">{result.title}</h2>
          <p className="mt-2 text-sm leading-6 text-white/72">{result.summary}</p>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="shrink-0 rounded-lg bg-white px-3 py-2 text-sm font-bold text-ink"
        >
          {copied ? "복사됨" : "복사"}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-white/10 p-3">
          <p className="text-xs font-bold text-white/60">피로도 점수</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-3xl font-extrabold">{result.fatigueScore}</span>
            <span className={`rounded-md px-2 py-1 text-xs font-bold ${fatigueColor(result.fatigueScore)}`}>
              {result.fatigueLabel}
            </span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-white/15">
            <div
              className="h-2 rounded-full bg-amber"
              style={{ width: `${result.fatigueScore}%` }}
            />
          </div>
          <p className="mt-2 text-xs leading-5 text-white/68">{result.fatigueNote}</p>
        </div>

        <div className="rounded-lg bg-white/10 p-3">
          <p className="text-xs font-bold text-white/60">
            {result.sideHustleTime.focusLabel ?? "부업 가능 시간"}
          </p>
          <p className="mt-2 text-3xl font-extrabold">{result.sideHustleTime.label}</p>
          <p className="mt-2 text-xs leading-5 text-white/68">{result.sideHustleTime.note}</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-amber/40 bg-amber/15 p-3">
        <p className="text-sm font-bold text-white">오늘의 핵심 루틴</p>
        <p className="mt-1 text-sm leading-6 text-white/78">{result.coreRoutine}</p>
      </div>

      <div className="mt-4 space-y-2">
        {result.schedule.map((item) => (
          <article
            key={`${item.time}-${item.title}`}
            className={`rounded-lg border-l-4 p-3 text-ink ${toneClass[item.tone]}`}
          >
            <div className="flex items-start gap-3">
              <p className="w-24 shrink-0 text-sm font-extrabold">{item.time}</p>
              <div>
                <h3 className="text-sm font-bold">{item.title}</h3>
                <p className="mt-1 text-sm leading-5 text-ink/65">{item.detail}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-lg bg-white/10 p-3">
        <h3 className="text-sm font-bold">오늘의 추천 행동 3개</h3>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-6 text-white/78">
          {result.actions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ol>
      </div>

      <div className="mt-3 rounded-lg bg-white/10 p-3">
        <h3 className="text-sm font-bold">{result.handoverMemo.title}</h3>
        <div className="mt-2 space-y-2 text-sm leading-6 text-white/78">
          {result.handoverMemo.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-coral/40 bg-coral/15 p-3 text-sm leading-6 text-white/82">
        <p className="font-bold text-white">피로도 주의</p>
        <p>{result.caution}</p>
      </div>

      <textarea
        className="sr-only"
        readOnly
        value={formatRoutineText(input, result)}
        aria-label="복사용 루틴 텍스트"
      />
    </section>
  );
}
