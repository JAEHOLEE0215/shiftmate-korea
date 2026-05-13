"use client";

import { useEffect, useMemo, useState } from "react";
import { OptionButton } from "@/components/OptionButton";
import { RoutineResult } from "@/components/RoutineResult";
import { Section } from "@/components/Section";
import {
  createRoutine,
  defaultInput,
  formatRoutineText,
  type GoalType,
  type PatternType,
  type RoutineInput,
  type RoutineType,
  type ShiftType,
} from "@/lib/routine";

const storageKey = "shiftmate-korea-routine";

const shifts: Array<{ value: ShiftType; label: ShiftType; subLabel: string }> = [
  { value: "D", label: "D", subLabel: "06:00~14:00" },
  { value: "S", label: "S", subLabel: "14:00~22:00" },
  { value: "G", label: "G", subLabel: "22:00~06:00" },
  { value: "Off", label: "Off", subLabel: "쉬는 날" },
  { value: "custom", label: "custom", subLabel: "직접 입력" },
];

const patterns: PatternType[] = ["4조3교대", "3조2교대", "2교대", "야간 고정", "직접 입력"];
const goals: GoalType[] = ["회복 우선", "운동 우선", "공부 우선", "부업 우선", "균형 모드"];
const routineTypes: RoutineType[] = [
  "오늘 루틴",
  "내일 루틴",
  "야간근무 후 회복 루틴",
  "Off day 성장 루틴",
];

export default function Home() {
  const [input, setInput] = useState<RoutineInput>(defaultInput);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => createRoutine(input), [input]);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;

    try {
      setInput({ ...defaultInput, ...JSON.parse(saved) });
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(input));
  }, [input]);

  function updateInput<T extends keyof RoutineInput>(key: T, value: RoutineInput[T]) {
    setInput((current) => ({ ...current, [key]: value }));
    setCopied(false);
  }

  async function copyRoutine() {
    await navigator.clipboard.writeText(formatRoutineText(input, result));
    setCopied(true);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-5 px-4 py-5 sm:px-6 sm:py-8">
      <header className="pt-2">
        <p className="text-sm font-bold text-leaf">ShiftMate Korea</p>
        <h1 className="mt-1 text-3xl font-extrabold leading-10 text-ink">
          교대근무자를 위한 오늘 루틴 생성기
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          근무표와 목표를 고르면 수면, 운동, 공부, 부업 시간을 한 번에 정리합니다.
          회원가입, 결제, 광고 없이 이 기기 안에만 저장됩니다.
        </p>
      </header>

      <Section title="1. 근무 타입 선택" description="오늘 또는 기준이 되는 근무를 고르세요.">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {shifts.map((shift) => (
            <OptionButton
              key={shift.value}
              label={shift.label}
              subLabel={shift.subLabel}
              selected={input.shiftType === shift.value}
              onSelect={(value) => updateInput("shiftType", value)}
            />
          ))}
        </div>
        {input.shiftType === "custom" ? (
          <input
            value={input.customShift}
            onChange={(event) => updateInput("customShift", event.target.value)}
            placeholder="예: 08:00~17:00, 잔업 2시간"
            className="mt-3 w-full rounded-lg border border-ink/10 bg-mist px-4 py-3 text-sm outline-none focus:border-leaf"
          />
        ) : null}
      </Section>

      <Section title="2. 근무 패턴 선택">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {patterns.map((pattern) => (
            <OptionButton
              key={pattern}
              label={pattern}
              selected={input.pattern === pattern}
              onSelect={(value) => updateInput("pattern", value)}
            />
          ))}
        </div>
        {input.pattern === "직접 입력" ? (
          <input
            value={input.customPattern}
            onChange={(event) => updateInput("customPattern", event.target.value)}
            placeholder="예: 4근2휴, 주주야야비휴"
            className="mt-3 w-full rounded-lg border border-ink/10 bg-mist px-4 py-3 text-sm outline-none focus:border-leaf"
          />
        ) : null}
      </Section>

      <Section title="3. 목표 선택">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {goals.map((goal) => (
            <OptionButton
              key={goal}
              label={goal}
              selected={input.goal === goal}
              onSelect={(value) => updateInput("goal", value)}
            />
          ))}
        </div>
      </Section>

      <Section title="4. 루틴 생성">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
          {routineTypes.map((routineType) => (
            <OptionButton
              key={routineType}
              label={routineType}
              selected={input.routineType === routineType}
              onSelect={(value) => updateInput("routineType", value)}
            />
          ))}
        </div>
      </Section>

      <RoutineResult input={input} result={result} onCopy={copyRoutine} copied={copied} />

      <footer className="pb-5 text-xs leading-5 text-ink/55">
        <p>의학적 조언이 아닌 생활 루틴 참고용입니다.</p>
        <p>수면 부족, 무리한 운동, 과로를 권장하지 않습니다.</p>
      </footer>
    </main>
  );
}
