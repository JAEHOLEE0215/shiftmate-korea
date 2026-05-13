"use client";

import {
  checklistItems,
  completionMessage,
  conditionMessages,
  type ConditionType,
  type DailyChecklist,
} from "@/lib/routine";

type DailyCheckInProps = {
  condition: ConditionType;
  memo: string;
  checklist: DailyChecklist;
  completionRate: number;
  onConditionChange: (condition: ConditionType) => void;
  onMemoChange: (memo: string) => void;
  onChecklistChange: (checklist: DailyChecklist) => void;
};

const conditions: ConditionType[] = ["좋음", "보통", "피곤함", "매우 피곤함"];

export function DailyCheckIn({
  condition,
  memo,
  checklist,
  completionRate,
  onConditionChange,
  onMemoChange,
  onChecklistChange,
}: DailyCheckInProps) {
  const checkedCount = Object.values(checklist).filter(Boolean).length;

  function toggleChecklist(key: keyof DailyChecklist) {
    onChecklistChange({ ...checklist, [key]: !checklist[key] });
  }

  return (
    <section className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
      <p className="text-xs font-bold text-leaf">오늘 30초 체크</p>
      <h2 className="mt-1 text-xl font-extrabold text-ink">오늘 컨디션과 루틴 완료 기록</h2>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {conditions.map((item) => {
          const selected = condition === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => onConditionChange(item)}
              aria-pressed={selected}
              className={`min-h-14 rounded-lg border px-3 py-2 text-left text-sm font-bold ${
                selected ? "border-leaf bg-leaf text-white" : "border-ink/10 bg-mist text-ink"
              }`}
            >
              {item}
              {selected ? <span className="mt-1 block text-xs text-white/85">선택됨</span> : null}
            </button>
          );
        })}
      </div>

      <p className="mt-3 break-keep rounded-lg bg-leaf/10 p-3 text-sm font-bold leading-6 text-leaf">
        {conditionMessages[condition]}
      </p>

      <label className="mt-4 block text-sm font-bold text-ink">
        한 줄 메모
        <input
          value={memo}
          onChange={(event) => onMemoChange(event.target.value)}
          placeholder="예: 야간 끝나고 잠을 적게 잠"
          className="mt-2 w-full rounded-lg border border-ink/10 bg-mist px-4 py-3 text-sm font-normal outline-none focus:border-leaf"
        />
      </label>

      <div className="mt-4 rounded-lg bg-mist p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-ink">오늘 체크리스트</h3>
            <p className="mt-1 text-sm font-bold text-slate-700">
              {checkedCount}/{checklistItems.length} 완료 · 완료율 {completionRate}%
            </p>
          </div>
          <p className="rounded-md bg-white px-2 py-1 text-xs font-bold text-ink">{completionRate}%</p>
        </div>
        <p className="mt-2 break-keep text-sm leading-6 text-slate-700">
          {completionMessage(completionRate)}
        </p>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {checklistItems.map((item) => (
            <label
              key={item.key}
              className="flex min-h-12 items-center gap-3 rounded-lg bg-white px-3 py-2 text-sm font-bold text-ink"
            >
              <input
                type="checkbox"
                checked={checklist[item.key]}
                onChange={() => toggleChecklist(item.key)}
                className="h-5 w-5 accent-leaf"
              />
              {item.label}
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}
