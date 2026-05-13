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
const heroBadges = ["4조3교대", "야간근무", "수면 루틴", "부업 시간", "인수인계 메모"];

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

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

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
          4조3교대·야간근무자를 위한 현실 루틴 플래너
        </h1>
        <p className="mt-3 break-keep text-sm leading-6 text-slate-700">
          D/S/G/Off 근무표에 맞춰 수면, 운동, 공부, 부업 시간을 오늘 바로 실행 가능한 루틴으로 정리합니다.
        </p>
        <p className="mt-3 rounded-lg bg-white px-4 py-3 text-sm font-bold text-ink shadow-soft">
          회원가입 없음 · 결제 없음 · 이 기기 안에만 저장
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {heroBadges.map((badge) => (
            <span key={badge} className="rounded-md bg-leaf/10 px-3 py-2 text-xs font-bold text-leaf">
              {badge}
            </span>
          ))}
        </div>
      </header>

      <Section title="1. 근무 타입 선택" description="오늘 또는 기준이 되는 근무를 고르세요.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {shifts.map((shift) => (
            <OptionButton
              key={shift.value}
              label={shift.label}
              subLabel={shift.subLabel}
              selected={input.shiftType === shift.value}
              onSelect={(value) => updateInput("shiftType", value)}
              ariaLabel={`${shift.label} 근무 타입 선택`}
            />
          ))}
        </div>
        {input.shiftType === "custom" ? (
          <input
            value={input.customShift}
            onChange={(event) => updateInput("customShift", event.target.value)}
            placeholder="예: 08:00~17:00, 잔업 2시간"
            aria-label="직접 입력 근무 시간"
            className="mt-3 w-full rounded-lg border border-ink/10 bg-mist px-4 py-3 text-sm outline-none focus:border-leaf"
          />
        ) : null}
      </Section>

      <Section title="2. 근무 패턴 선택">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {patterns.map((pattern) => (
            <OptionButton
              key={pattern}
              label={pattern}
              selected={input.pattern === pattern}
              onSelect={(value) => updateInput("pattern", value)}
              ariaLabel={`${pattern} 근무 패턴 선택`}
            />
          ))}
        </div>
        {input.pattern === "직접 입력" ? (
          <input
            value={input.customPattern}
            onChange={(event) => updateInput("customPattern", event.target.value)}
            placeholder="예: 4근2휴, 주주야야비휴"
            aria-label="직접 입력 근무 패턴"
            className="mt-3 w-full rounded-lg border border-ink/10 bg-mist px-4 py-3 text-sm outline-none focus:border-leaf"
          />
        ) : null}
      </Section>

      <Section title="3. 목표 선택">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {goals.map((goal) => (
            <OptionButton
              key={goal}
              label={goal}
              selected={input.goal === goal}
              onSelect={(value) => updateInput("goal", value)}
              ariaLabel={`${goal} 목표 선택`}
            />
          ))}
        </div>
      </Section>

      <Section title="4. 루틴 생성">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          {routineTypes.map((routineType) => (
            <OptionButton
              key={routineType}
              label={routineType}
              selected={input.routineType === routineType}
              onSelect={(value) => updateInput("routineType", value)}
              ariaLabel={`${routineType} 선택`}
            />
          ))}
        </div>
        <a
          href="#result"
          className="mt-3 inline-flex min-h-11 items-center rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white"
          aria-label="생성된 루틴 결과 카드로 이동"
        >
          결과 카드 바로 보기
        </a>
      </Section>

      <RoutineResult input={input} result={result} onCopy={copyRoutine} copied={copied} />

      <InfoSections />

      <footer className="pb-5 text-xs leading-5 text-slate-600">
        <p>의학적 조언이 아닌 생활 루틴 참고용입니다.</p>
        <p>수면 부족, 무리한 운동, 과로를 권장하지 않습니다.</p>
        <p>무료 웹앱이며 로그인과 결제 기능은 없습니다.</p>
      </footer>
    </main>
  );
}

function InfoSections() {
  return (
    <div className="space-y-4">
      <Section title="교대근무 루틴이 어려운 이유">
        <p className="break-keep text-sm leading-6 text-slate-700">
          4조3교대, 3조2교대, 야간근무는 매일 같은 시간에 자고 일어나기 어렵습니다.
          그래서 일반 일정 앱만으로는 수면, 식사, 운동, 공부, 부업 시간을 현실적으로 나누기 어렵습니다.
        </p>
      </Section>

      <Section title="야간근무 후에는 회복 블록이 먼저입니다">
        <p className="break-keep text-sm leading-6 text-slate-700">
          야간근무 후에는 무리한 운동이나 긴 부업보다 수면, 식사, 가벼운 정리부터 배치하는 편이 현실적입니다.
          이 내용은 생활 루틴 참고용이며 개인 상황에 맞게 줄여서 사용하세요.
        </p>
      </Section>

      <Section title="교대근무자가 부업 시간을 만들 때 주의할 점">
        <p className="break-keep text-sm leading-6 text-slate-700">
          피로도가 높은 날에는 긴 작업보다 짧은 메모, 아이디어 정리, 가벼운 수정 작업처럼 부담 낮은 작업을 추천합니다.
          작은 결과물을 반복해서 쌓는 방식이 교대근무 일정에 더 잘 맞습니다.
        </p>
      </Section>

      <Section title="자주 묻는 질문">
        <div className="space-y-3">
          <Faq
            question="4조3교대 근무자도 매일 같은 루틴을 가져야 하나요?"
            answer="매일 같은 시간표를 고정하기보다 D/S/G/Off에 맞춰 바꾸는 편이 현실적입니다. 이 서비스는 생활 루틴 참고용으로 근무 타입별 기준 루틴을 제안합니다."
          />
          <Faq
            question="야간근무 후 바로 운동해도 되나요?"
            answer="야간근무 후에는 긴 운동보다 수면, 식사, 가벼운 정리부터 배치하는 방식으로 안내합니다. 의학적 조언이 아닌 생활 루틴 참고용입니다."
          />
          <Faq
            question="교대근무 중 부업 시간은 언제 잡는 게 좋나요?"
            answer="피로도가 낮은 날은 퇴근 후 회복 뒤, Off day는 오후 집중 블록에 잡는 식으로 나눌 수 있습니다. 이 기준은 생활 루틴 참고용입니다."
          />
          <Faq
            question="이 서비스는 수면 의학 조언인가요?"
            answer="아닙니다. ShiftMate Korea는 의학적 조언이 아닌 생활 루틴 참고용 웹앱입니다."
          />
        </div>
      </Section>

      <Section title="휴대폰 홈 화면에 추가해서 사용하세요">
        <ul className="space-y-2 text-sm leading-6 text-slate-700">
          <li>iPhone Safari: 공유 버튼 → 홈 화면에 추가</li>
          <li>Android Chrome: 메뉴 → 홈 화면에 추가</li>
          <li>앱 설치 없이 웹앱처럼 빠르게 다시 열 수 있습니다.</li>
        </ul>
      </Section>
    </div>
  );
}

function Faq({ question, answer }: { question: string; answer: string }) {
  return (
    <article className="rounded-lg bg-mist p-3">
      <h3 className="text-sm font-bold text-ink">{question}</h3>
      <p className="mt-1 break-keep text-sm leading-6 text-slate-700">{answer}</p>
    </article>
  );
}
