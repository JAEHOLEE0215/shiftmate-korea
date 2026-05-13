"use client";

import { getShiftShortLabel, type DailyRecord } from "@/lib/routine";

type RecentRecordsProps = {
  records: DailyRecord[];
  onReset: () => void;
};

export function RecentRecords({ records, onReset }: RecentRecordsProps) {
  return (
    <section className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold text-leaf">최근 기록</p>
          <h2 className="mt-1 text-xl font-extrabold text-ink">최근 7일 루틴 흐름</h2>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="min-h-11 rounded-lg border border-coral px-4 py-2 text-sm font-bold text-coral"
        >
          최근 기록 초기화
        </button>
      </div>

      {records.length === 0 ? (
        <p className="mt-4 rounded-lg bg-mist p-3 text-sm font-bold leading-6 text-slate-700">
          아직 기록이 없습니다. 오늘 컨디션과 체크리스트를 저장해보세요.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {records.map((record) => (
            <article key={record.date} className="rounded-lg border border-ink/10 bg-mist p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-extrabold text-ink">
                    {record.date} · {record.dayLabel}
                  </h3>
                  <p className="mt-1 text-xs font-bold text-slate-700">
                    {getShiftShortLabel(record.shiftType)} · 컨디션 {record.condition}
                  </p>
                </div>
                <p className="rounded-md bg-white px-2 py-1 text-xs font-bold text-ink">
                  {record.completionRate}%
                </p>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                완료율 {record.completionRate}% · 부업 가능 시간 {record.sideHustleMinutes}분
              </p>
              {record.memo ? (
                <p className="mt-1 break-keep text-sm leading-6 text-slate-700">메모: {record.memo}</p>
              ) : null}
            </article>
          ))}
        </div>
      )}

      <p className="mt-4 break-keep text-xs leading-5 text-slate-600">
        기록은 이 기기의 localStorage에만 저장됩니다. 공용 PC에서는 사용 후 초기화를 권장합니다.
      </p>
    </section>
  );
}
