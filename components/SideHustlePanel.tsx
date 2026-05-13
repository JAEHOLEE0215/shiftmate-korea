"use client";

import type { RoutineResult, WeeklySummary } from "@/lib/routine";
import { type ConditionType } from "@/lib/routine";

type SideHustlePanelProps = {
  result: RoutineResult;
  weeklySummary: WeeklySummary;
  condition: ConditionType;
};

export function SideHustlePanel({ result, weeklySummary, condition }: SideHustlePanelProps) {
  const highFatigue = result.fatigueScore >= 70;
  const tired = condition === "피곤함" || condition === "매우 피곤함";

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
        <p className="text-xs font-bold text-leaf">부업 시간</p>
        <h2 className="mt-1 text-xl font-extrabold text-ink">작은 작업 시간을 찾는 도구</h2>
        <p className="mt-2 break-keep text-sm leading-6 text-slate-700">
          교대근무 흐름 안에서 오늘 할 수 있는 작은 부업 시간을 현실적으로 나눕니다.
        </p>
        <div className="mt-4 rounded-lg bg-ink p-4 text-white">
          <p className="text-xs font-bold text-amber">이번 주 부업 가능 시간</p>
          <p className="mt-1 text-4xl font-extrabold">
            {weeklySummary.sideHustleHoursMin}~{weeklySummary.sideHustleHoursMax}시간
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-200">
            부업 집중 가능일 {weeklySummary.sideHustleFocusMin}~{weeklySummary.sideHustleFocusMax}일 기준
          </p>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <MetricCard label="오늘 가능 시간" value={result.sideHustleTime.label} helper={result.sideHustleTime.note} />
          <MetricCard label="오늘 추천 작업" value={result.sideHustleTime.workType} helper="수익 보장이 아닌 실행 시간 판단용입니다." />
        </div>
      </div>

      <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
        <h3 className="text-base font-bold text-ink">피로도에 따른 추천 작업</h3>
        {highFatigue ? (
          <p className="mt-2 rounded-lg bg-coral/10 p-3 text-sm font-bold leading-6 text-coral">
            오늘은 긴 작업보다 15~30분 이하의 메모형 작업을 추천합니다.
          </p>
        ) : null}
        {tired ? (
          <p className="mt-2 rounded-lg bg-amber/20 p-3 text-sm font-bold leading-6 text-ink">
            {condition === "매우 피곤함"
              ? "오늘은 결과물을 만들기보다 아이디어 저장 정도로 충분합니다."
              : "오늘은 15~30분 메모형 작업을 우선 추천합니다."}
          </p>
        ) : null}
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <WorkCard title="짧은 작업" text="아이디어 메모, 블로그 제목 정리, 간단한 오류 수정" />
          <WorkCard title="집중 작업" text="글 초안, 기능 1개 수정, 자료 정리, 콘텐츠 제작" />
          <WorkCard title="피해야 할 작업" text="늦은 시간 긴 개발, 무리한 운동 뒤 작업, 밤샘성 일정" />
        </div>
      </div>

      <p className="rounded-lg bg-white p-4 text-xs leading-5 text-slate-600 shadow-soft">
        부업 수익이나 성공을 보장하지 않습니다. 이 화면은 생활 루틴 참고용으로만 사용하세요.
      </p>
    </section>
  );
}

function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <article className="rounded-lg bg-mist p-4">
      <p className="text-xs font-bold text-slate-600">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-ink">{value}</p>
      <p className="mt-1 break-keep text-sm leading-5 text-slate-700">{helper}</p>
    </article>
  );
}

function WorkCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-lg border border-ink/10 bg-mist p-3">
      <h4 className="text-sm font-bold text-ink">{title}</h4>
      <p className="mt-1 break-keep text-sm leading-6 text-slate-700">{text}</p>
    </article>
  );
}
