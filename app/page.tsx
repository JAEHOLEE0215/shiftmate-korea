"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AppTabs, type AppTab } from "@/components/AppTabs";
import { GuidePanel } from "@/components/GuidePanel";
import { HandoverPanel } from "@/components/HandoverPanel";
import { OptionButton } from "@/components/OptionButton";
import { RoutineResult } from "@/components/RoutineResult";
import { Section } from "@/components/Section";
import { SideHustlePanel } from "@/components/SideHustlePanel";
import { SummaryDashboard } from "@/components/SummaryDashboard";
import { WeeklySchedule } from "@/components/WeeklySchedule";
import {
  createInputForShift,
  createRoutine,
  createWeeklySummary,
  defaultWeeklySchedule,
  formatWeeklySummaryText,
  defaultInput,
  formatRoutineText,
  getShiftShortLabel,
  getTodayWeekdayIndex,
  shiftPresets,
  type GoalType,
  type PatternType,
  type RoutineInput,
  type RoutineType,
  type ShiftType,
  type WeekdayKey,
  type WeeklySchedule as WeeklyScheduleType,
  weekdayLabels,
} from "@/lib/routine";

const storageKey = "shiftmate-korea-routine";
const weeklyStorageKey = "shiftmate-korea-weekly-schedule";
const customTemplateStorageKey = "shiftmate-korea-custom-shift-template";

const shifts: Array<{ value: ShiftType; label: ShiftType; subLabel: string }> = [
  { value: "D", label: "D", subLabel: "주간" },
  { value: "S", label: "S", subLabel: "오후" },
  { value: "G", label: "G", subLabel: "야간" },
  { value: "N", label: "N", subLabel: "야간" },
  { value: "Off", label: "Off", subLabel: "휴무" },
  { value: "custom", label: "custom", subLabel: "직접 입력" },
];

const patterns: Array<{ value: PatternType; subLabel: string }> = [
  { value: "4조3교대", subLabel: "D/S/G/Off가 반복되는 교대 형태" },
  { value: "3조2교대", subLabel: "주야 교대와 휴무가 반복되는 형태" },
  { value: "2교대", subLabel: "주간과 야간이 크게 나뉘는 형태" },
  { value: "주야비", subLabel: "주간·야간·비번 흐름을 가진 형태" },
  { value: "주주야야비비", subLabel: "주간 2일, 야간 2일, 비번 2일 흐름" },
  { value: "주간 고정", subLabel: "주간 근무가 반복되는 형태" },
  { value: "야간 고정", subLabel: "야간 근무가 반복되는 형태" },
  { value: "직접 입력", subLabel: "회사 근무시간에 맞게 직접 조정" },
];
const goals: GoalType[] = ["회복 우선", "운동 우선", "공부 우선", "부업 우선", "균형 모드"];
const routineTypes: RoutineType[] = [
  "오늘 루틴",
  "내일 루틴",
  "야간근무 후 회복 루틴",
  "Off day 성장 루틴",
];
const heroBadges = [
  "4조3교대",
  "3조2교대",
  "2교대",
  "주야비",
  "야간근무",
  "직접 입력",
  "부업 시간",
  "인수인계 메모",
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<AppTab>("today");
  const [input, setInput] = useState<RoutineInput>(defaultInput);
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklyScheduleType>(defaultWeeklySchedule);
  const [customTemplate, setCustomTemplate] = useState({
    shiftName: shiftPresets.custom.name,
    shiftStart: shiftPresets.custom.start,
    shiftEnd: shiftPresets.custom.end,
    shiftMemo: "",
  });
  const [todayIndex, setTodayIndex] = useState(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [weeklySaved, setWeeklySaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => createRoutine(input), [input]);
  const weeklySummary = useMemo(
    () => createWeeklySummary(weeklySchedule, input, customTemplate),
    [weeklySchedule, input, customTemplate],
  );
  const weeklySummaryText = useMemo(
    () => formatWeeklySummaryText(weeklySchedule, weeklySummary),
    [weeklySchedule, weeklySummary],
  );
  const selectedDay = weekdayLabels[selectedDayIndex];
  const todayDay = weekdayLabels[todayIndex];

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
    const browserTodayIndex = getTodayWeekdayIndex();
    setTodayIndex(browserTodayIndex);
    setSelectedDayIndex(browserTodayIndex);

    const savedWeekly = window.localStorage.getItem(weeklyStorageKey);
    if (savedWeekly) {
      try {
        const parsedWeekly = { ...defaultWeeklySchedule, ...JSON.parse(savedWeekly) };
        setWeeklySchedule(parsedWeekly);
        const todayShift = parsedWeekly[weekdayLabels[browserTodayIndex].key];
        setInput((current) => createInputForShift(current, todayShift, customTemplate));
      } catch {
        window.localStorage.removeItem(weeklyStorageKey);
      }
    }

    const savedCustomTemplate = window.localStorage.getItem(customTemplateStorageKey);
    if (savedCustomTemplate) {
      try {
        setCustomTemplate({ ...customTemplate, ...JSON.parse(savedCustomTemplate) });
      } catch {
        window.localStorage.removeItem(customTemplateStorageKey);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(weeklyStorageKey, JSON.stringify(weeklySchedule));
    setWeeklySaved(true);
  }, [weeklySchedule]);

  useEffect(() => {
    window.localStorage.setItem(customTemplateStorageKey, JSON.stringify(customTemplate));
  }, [customTemplate]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  function updateInput<T extends keyof RoutineInput>(key: T, value: RoutineInput[T]) {
    setInput((current) => ({ ...current, [key]: value }));
    if (
      input.shiftType === "custom" &&
      (key === "shiftName" || key === "shiftStart" || key === "shiftEnd" || key === "shiftMemo")
    ) {
      setCustomTemplate((current) => ({ ...current, [key]: value }));
    }
    setCopied(false);
  }

  function selectShift(value: ShiftType) {
    setInput((current) => createInputForShift(current, value, customTemplate));
    setCopied(false);
  }

  function selectWeeklyDay(index: number) {
    const day = weekdayLabels[index];
    setSelectedDayIndex(index);
    setInput((current) => createInputForShift(current, weeklySchedule[day.key], customTemplate));
    setCopied(false);
  }

  function changeWeeklyDay(day: WeekdayKey, shift: ShiftType) {
    setWeeklySchedule((current) => ({ ...current, [day]: shift }));
    const changedIndex = weekdayLabels.findIndex((weekday) => weekday.key === day);
    if (changedIndex === selectedDayIndex) {
      setInput((current) => createInputForShift(current, shift, customTemplate));
    }
  }

  function resetWeeklySchedule() {
    setWeeklySchedule(defaultWeeklySchedule);
    window.localStorage.removeItem(weeklyStorageKey);
    const todayShift = defaultWeeklySchedule[weekdayLabels[todayIndex].key];
    setSelectedDayIndex(todayIndex);
    setInput((current) => createInputForShift(current, todayShift, customTemplate));
  }

  async function copyRoutine() {
    await navigator.clipboard.writeText(formatRoutineText(input, result, weeklySummaryText));
    setCopied(true);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-5 px-4 py-5 sm:px-6 sm:py-8">
      <header className="pt-2">
        <p className="text-sm font-bold text-leaf">ShiftMate Korea</p>
        <h1 className="mt-1 text-3xl font-extrabold leading-10 text-ink">
          교대근무자를 위한 맞춤 루틴 플래너
        </h1>
        <p className="mt-3 break-keep text-sm leading-6 text-slate-700">
          회사마다 다른 근무표에 맞춰 수면, 회복, 운동, 공부, 부업 시간을 오늘 바로 실행 가능한 루틴으로 정리합니다.
        </p>
        <p className="mt-3 break-keep rounded-lg bg-white px-4 py-3 text-sm font-bold leading-6 text-ink shadow-soft">
          4조3교대뿐 아니라 3조2교대, 2교대, 주야비, 야간 고정, 직접 입력 근무표까지 고려합니다.
        </p>
        <p className="mt-2 rounded-lg bg-white px-4 py-3 text-sm font-bold text-ink shadow-soft">
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

      <SummaryDashboard
        input={input}
        result={result}
        todayKey={todayDay.key}
        selectedDayLabel={selectedDay.full}
        selectedIsToday={selectedDayIndex === todayIndex}
        weeklySchedule={weeklySchedule}
      />

      <AppTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "today" ? (
        <TodayRoutinePanel
          input={input}
          shifts={shifts}
          patterns={patterns}
          goals={goals}
          routineTypes={routineTypes}
          selectShift={selectShift}
          updateInput={updateInput}
        >
          <RoutineResult
            input={input}
            result={result}
            onCopy={copyRoutine}
            copied={copied}
            selectedDayLabel={selectedDay.full}
            isTodaySelected={selectedDayIndex === todayIndex}
            weeklySummaryText={weeklySummaryText}
          />
        </TodayRoutinePanel>
      ) : null}

      {activeTab === "week" ? (
        <WeeklySchedule
          schedule={weeklySchedule}
          summary={weeklySummary}
          todayIndex={todayIndex}
          selectedDayIndex={selectedDayIndex}
          onChangeDay={changeWeeklyDay}
          onSelectDay={selectWeeklyDay}
          onReset={resetWeeklySchedule}
          saved={weeklySaved}
        />
      ) : null}

      {activeTab === "sideHustle" ? (
        <SideHustlePanel result={result} weeklySummary={weeklySummary} />
      ) : null}

      {activeTab === "handover" ? (
        <HandoverPanel input={input} result={result} weeklySummaryText={weeklySummaryText} />
      ) : null}

      {activeTab === "guide" ? <GuidePanel /> : null}

      <footer className="pb-5 text-xs leading-5 text-slate-600">
        <p>의학적 조언이 아닌 생활 루틴 참고용입니다.</p>
        <p>수면 부족, 무리한 운동, 과로를 권장하지 않습니다.</p>
        <p>무료 웹앱이며 로그인과 결제 기능은 없습니다.</p>
      </footer>
    </main>
  );
}

function TodayRoutinePanel({
  input,
  shifts,
  patterns,
  goals,
  routineTypes,
  selectShift,
  updateInput,
  children,
}: {
  input: RoutineInput;
  shifts: Array<{ value: ShiftType; label: ShiftType; subLabel: string }>;
  patterns: Array<{ value: PatternType; subLabel: string }>;
  goals: GoalType[];
  routineTypes: RoutineType[];
  selectShift: (value: ShiftType) => void;
  updateInput: <T extends keyof RoutineInput>(key: T, value: RoutineInput[T]) => void;
  children: ReactNode;
}) {
  return (
    <div className="space-y-4">
      <Section title="근무 타입 선택">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-6">
          {shifts.map((shift) => (
            <OptionButton
              key={shift.value}
              label={shift.label}
              subLabel={shift.subLabel}
              selected={input.shiftType === shift.value}
              onSelect={() => selectShift(shift.value)}
              ariaLabel={`${shift.label} ${shift.subLabel} 근무 타입 선택`}
            />
          ))}
        </div>
      </Section>
      <Section title="회사별 근무시간 조정">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="text-sm font-bold text-ink">
            근무 이름
            <input
              value={input.shiftName}
              onChange={(event) => updateInput("shiftName", event.target.value)}
              placeholder="예: A조 주간"
              aria-label="근무 이름"
              disabled={input.shiftType === "Off"}
              className="mt-2 w-full rounded-lg border border-ink/10 bg-mist px-4 py-3 text-sm font-normal outline-none focus:border-leaf disabled:opacity-60"
            />
          </label>
          <label className="text-sm font-bold text-ink">
            출근 시간
            <input
              type="time"
              value={input.shiftStart}
              onChange={(event) => updateInput("shiftStart", event.target.value)}
              aria-label="출근 시간"
              disabled={input.shiftType === "Off"}
              className="mt-2 w-full rounded-lg border border-ink/10 bg-mist px-4 py-3 text-sm font-normal outline-none focus:border-leaf disabled:opacity-60"
            />
          </label>
          <label className="text-sm font-bold text-ink">
            퇴근 시간
            <input
              type="time"
              value={input.shiftEnd}
              onChange={(event) => updateInput("shiftEnd", event.target.value)}
              aria-label="퇴근 시간"
              disabled={input.shiftType === "Off"}
              className="mt-2 w-full rounded-lg border border-ink/10 bg-mist px-4 py-3 text-sm font-normal outline-none focus:border-leaf disabled:opacity-60"
            />
          </label>
        </div>
        <label className="mt-3 block text-sm font-bold text-ink">
          근무 메모
          <input
            value={input.shiftMemo}
            onChange={(event) => updateInput("shiftMemo", event.target.value)}
            placeholder="예: 잔업 가능성 있음, 통근 40분"
            aria-label="근무 메모"
            className="mt-2 w-full rounded-lg border border-ink/10 bg-mist px-4 py-3 text-sm font-normal outline-none focus:border-leaf"
          />
        </label>
      </Section>
      <Section title="근무 패턴 선택">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {patterns.map((pattern) => (
            <OptionButton
              key={pattern.value}
              label={pattern.value}
              subLabel={pattern.subLabel}
              selected={input.pattern === pattern.value}
              onSelect={(value) => updateInput("pattern", value)}
              ariaLabel={`${pattern.value} 근무 패턴 선택`}
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
      <Section title="목표 선택">
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
      <Section title="루틴 종류 선택">
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
      </Section>
      {children}
    </div>
  );
}
