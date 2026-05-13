"use client";

import { useEffect, useState } from "react";
import type { RoutineInput, RoutineResult } from "@/lib/routine";
import { formatRoutineText } from "@/lib/routine";

type HandoverPanelProps = {
  input: RoutineInput;
  result: RoutineResult;
  weeklySummaryText: string;
};

const handoverStorageKey = "shiftmate-korea-handover-note";

const defaultMemo = {
  issue: "",
  check: "",
  next: "",
  condition: "",
};

export function HandoverPanel({ input, result, weeklySummaryText }: HandoverPanelProps) {
  const [memo, setMemo] = useState(defaultMemo);
  const [copied, setCopied] = useState<"memo" | "all" | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(handoverStorageKey);
    if (!saved) return;
    try {
      setMemo({ ...defaultMemo, ...JSON.parse(saved) });
    } catch {
      window.localStorage.removeItem(handoverStorageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(handoverStorageKey, JSON.stringify(memo));
  }, [memo]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(null), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const memoText = `금일 근무 특이사항: ${memo.issue}
확인 필요 항목: ${memo.check}
다음 근무자 전달사항: ${memo.next}
개인 컨디션 메모: ${memo.condition}`;

  async function copyMemo() {
    await navigator.clipboard.writeText(memoText);
    setCopied("memo");
  }

  async function copyAll() {
    await navigator.clipboard.writeText(`${formatRoutineText(input, result, weeklySummaryText)}

인수인계 메모:
${memoText}`);
    setCopied("all");
  }

  return (
    <section className="rounded-lg border border-ink/10 bg-white p-4 shadow-soft">
      <p className="text-xs font-bold text-leaf">인수인계</p>
      <h2 className="mt-1 text-xl font-extrabold text-ink">교대근무 인수인계 메모</h2>
      <div className="mt-4 grid grid-cols-1 gap-3">
        <MemoField label="근무 특이사항" value={memo.issue} onChange={(value) => setMemo((current) => ({ ...current, issue: value }))} />
        <MemoField label="확인 필요 항목" value={memo.check} onChange={(value) => setMemo((current) => ({ ...current, check: value }))} />
        <MemoField label="다음 근무자 전달사항" value={memo.next} onChange={(value) => setMemo((current) => ({ ...current, next: value }))} />
        <MemoField label="개인 컨디션 메모" value={memo.condition} onChange={(value) => setMemo((current) => ({ ...current, condition: value }))} />
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={copyMemo}
          aria-label="인수인계 메모만 복사"
          className="min-h-11 rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white"
        >
          {copied === "memo" ? "복사됨" : "인수인계 메모만 복사"}
        </button>
        <button
          type="button"
          onClick={copyAll}
          aria-label="전체 루틴과 인수인계 메모 복사"
          className="min-h-11 rounded-lg border border-ink px-4 py-2 text-sm font-bold text-ink"
        >
          {copied === "all" ? "복사됨" : "전체 루틴 복사"}
        </button>
      </div>
    </section>
  );
}

function MemoField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-sm font-bold text-ink">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-24 w-full rounded-lg border border-ink/10 bg-mist px-4 py-3 text-sm font-normal leading-6 outline-none focus:border-leaf"
      />
    </label>
  );
}
