"use client";

import type { RoutineResult, WeeklySummary } from "@/lib/routine";

type SideHustlePanelProps = {
  result: RoutineResult;
  weeklySummary: WeeklySummary;
};

export function SideHustlePanel({ result, weeklySummary }: SideHustlePanelProps) {
  const highFatigue = result.fatigueScore >= 70;

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
        <p className="text-xs font-bold text-leaf">부업 시간</p>
        <h2 className="mt-1 text-xl font-extrabold text-ink">교대근무자를 위한 오늘의 부업 판단</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <MetricCard label="오늘 가능 시간" value={result.sideHustleTime.label} helper={result.sideHustleTime.note} />
          <MetricCard
            label="이번 주 예상"
            value={`${weeklySummary.sideHustleHoursMin}~${weeklySummary.sideHustleHoursMax}시간`}
            helper={`부업 집중 가능일 ${weeklySummary.sideHustleFocusMin}~${weeklySummary.sideHustleFocusMax}일`}
          />
        </div>
      </div>

      <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
        <h3 className="text-base font-bold text-ink">피로도에 따른 추천 작업</h3>
        {highFatigue ? (
          <p className="mt-2 rounded-lg bg-coral/10 p-3 text-sm font-bold leading-6 text-coral">
            오늘은 긴 작업보다 15~30분 이하의 메모형 작업을 추천합니다.
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
