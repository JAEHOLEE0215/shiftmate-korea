export type ShiftType = "D" | "S" | "G" | "N" | "Off" | "custom";
export type PatternType =
  | "4조3교대"
  | "3조2교대"
  | "2교대"
  | "주야비"
  | "주주야야비비"
  | "주간 고정"
  | "야간 고정"
  | "직접 입력";
export type GoalType = "회복 우선" | "운동 우선" | "공부 우선" | "부업 우선" | "균형 모드";
export type RoutineType =
  | "오늘 루틴"
  | "내일 루틴"
  | "야간근무 후 회복 루틴"
  | "Off day 성장 루틴";

export type RoutineInput = {
  shiftType: ShiftType;
  shiftName: string;
  shiftStart: string;
  shiftEnd: string;
  shiftMemo: string;
  customShift: string;
  pattern: PatternType;
  customPattern: string;
  goal: GoalType;
  routineType: RoutineType;
};

export type ScheduleItem = {
  time: string;
  title: string;
  detail: string;
  tone: "rest" | "work" | "growth" | "care";
};

export type SideHustleTime = {
  label: string;
  minutes: number;
  note: string;
  focusLabel?: string;
  workType: string;
};

export type HandoverMemo = {
  title: string;
  lines: string[];
};

export type RoutineResult = {
  title: string;
  summary: string;
  schedule: ScheduleItem[];
  actions: string[];
  caution: string;
  fatigueScore: number;
  fatigueLabel: string;
  fatigueNote: string;
  recommendedMode: string;
  sideHustleTime: SideHustleTime;
  handoverMemo: HandoverMemo;
  coreRoutine: string;
};

export type WeekdayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type WeeklySchedule = Record<WeekdayKey, ShiftType>;

export type WeeklySummary = {
  nightCount: number;
  offCount: number;
  recoveryDays: number;
  sideHustleFocusMin: number;
  sideHustleFocusMax: number;
  sideHustleHoursMin: number;
  sideHustleHoursMax: number;
};

export const weekdayLabels: Array<{ key: WeekdayKey; short: string; full: string }> = [
  { key: "mon", short: "월", full: "월요일" },
  { key: "tue", short: "화", full: "화요일" },
  { key: "wed", short: "수", full: "수요일" },
  { key: "thu", short: "목", full: "목요일" },
  { key: "fri", short: "금", full: "금요일" },
  { key: "sat", short: "토", full: "토요일" },
  { key: "sun", short: "일", full: "일요일" },
];

export const defaultWeeklySchedule: WeeklySchedule = {
  mon: "D",
  tue: "S",
  wed: "G",
  thu: "Off",
  fri: "D",
  sat: "S",
  sun: "Off",
};

type ScheduleTuple = [string, string, string, ScheduleItem["tone"]];
type RoutineBase = Omit<
  RoutineResult,
  | "actions"
  | "caution"
  | "schedule"
  | "fatigueScore"
  | "fatigueLabel"
  | "fatigueNote"
  | "recommendedMode"
  | "sideHustleTime"
  | "handoverMemo"
  | "coreRoutine"
> & {
  schedule: ScheduleTuple[];
};

type ShiftPreset = {
  name: string;
  start: string;
  end: string;
};

export const shiftPresets: Record<ShiftType, ShiftPreset> = {
  D: { name: "D 주간", start: "06:00", end: "14:00" },
  S: { name: "S 오후", start: "14:00", end: "22:00" },
  G: { name: "G 야간", start: "22:00", end: "06:00" },
  N: { name: "N 야간", start: "20:00", end: "08:00" },
  Off: { name: "Off 휴무", start: "", end: "" },
  custom: { name: "직접 입력", start: "07:00", end: "15:00" },
};

const goalAction: Record<GoalType, string> = {
  "회복 우선": "수면과 휴식을 먼저 확보하고 나머지는 짧게 처리하기",
  "운동 우선": "몸 상태를 보고 20~40분 안에서 가볍게 움직이기",
  "공부 우선": "집중이 잘 되는 시간에 40~60분 공부하기",
  "부업 우선": "작게 팔 수 있는 결과물 1개만 만들기",
  "균형 모드": "수면, 몸풀기, 공부를 작게 나누기",
};

export const defaultInput: RoutineInput = {
  shiftType: "D",
  shiftName: shiftPresets.D.name,
  shiftStart: shiftPresets.D.start,
  shiftEnd: shiftPresets.D.end,
  shiftMemo: "",
  customShift: "",
  pattern: "4조3교대",
  customPattern: "",
  goal: "균형 모드",
  routineType: "오늘 루틴",
};

export function getShiftText(input: RoutineInput) {
  if (isOff(input)) return "Off 휴무";

  const name = input.shiftName.trim() || shiftPresets[input.shiftType].name;
  const timeText = input.shiftStart && input.shiftEnd ? `${input.shiftStart}~${input.shiftEnd}` : "";
  return timeText ? `${name} ${timeText}` : name;
}

export function getPatternText(input: RoutineInput) {
  return input.pattern === "직접 입력" && input.customPattern.trim()
    ? input.customPattern.trim()
    : input.pattern;
}

export function createRoutine(input: RoutineInput): RoutineResult {
  if (isOff(input) || input.routineType === "Off day 성장 루틴") {
    return offDayGrowth(input);
  }

  if (isNightShift(input) || input.routineType === "야간근무 후 회복 루틴") {
    return nightRecovery(input);
  }

  if (input.shiftType === "S") {
    return swingRoutine(input);
  }

  return workdayRoutine(input);
}

export function formatHandoverMemo(result: RoutineResult) {
  return result.handoverMemo.lines.join("\n");
}

export function formatRoutineText(input: RoutineInput, result: RoutineResult, weeklySummaryText?: string) {
  const coreSteps = result.schedule.map((item, index) => `${index + 1}. ${item.title}`).join("\n");
  const actions = result.actions.map((action, index) => `${index + 1}. ${action}`).join("\n");
  const weeklyText = weeklySummaryText ? `\n\n${weeklySummaryText}` : "";

  return `[ShiftMate Korea 루틴]
근무: ${getShiftText(input)}
패턴: ${getPatternText(input)}
목표: ${input.goal}
피로도: ${result.fatigueScore}점 / ${result.fatigueLabel}
부업 가능 시간: ${result.sideHustleTime.label}

오늘 핵심 루틴:
${coreSteps}

추천 행동:
${actions}
${weeklyText}

주의:
의학적 조언이 아닌 생활 루틴 참고용입니다.
수면 부족, 무리한 운동, 과로를 권장하지 않습니다.`;
}

export function createInputForShift(
  base: RoutineInput,
  shiftType: ShiftType,
  customTemplate?: Pick<RoutineInput, "shiftName" | "shiftStart" | "shiftEnd" | "shiftMemo">,
): RoutineInput {
  if (shiftType === "custom" && customTemplate) {
    return {
      ...base,
      shiftType,
      shiftName: customTemplate.shiftName || shiftPresets.custom.name,
      shiftStart: customTemplate.shiftStart || shiftPresets.custom.start,
      shiftEnd: customTemplate.shiftEnd || shiftPresets.custom.end,
      shiftMemo: customTemplate.shiftMemo,
    };
  }

  const preset = shiftPresets[shiftType];
  return {
    ...base,
    shiftType,
    shiftName: preset.name,
    shiftStart: preset.start,
    shiftEnd: preset.end,
    shiftMemo: shiftType === "Off" ? "" : base.shiftMemo,
  };
}

export function getShiftShortLabel(shiftType: ShiftType) {
  if (shiftType === "D") return "D 주간";
  if (shiftType === "S") return "S 오후";
  if (shiftType === "G") return "G 야간";
  if (shiftType === "N") return "N 야간";
  if (shiftType === "Off") return "Off 휴무";
  return "직접 입력";
}

export function getTodayWeekdayIndex(date = new Date()) {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

export function createWeeklySummary(
  schedule: WeeklySchedule,
  baseInput: RoutineInput,
  customTemplate?: Pick<RoutineInput, "shiftName" | "shiftStart" | "shiftEnd" | "shiftMemo">,
): WeeklySummary {
  let nightCount = 0;
  let offCount = 0;
  let recoveryDays = 0;
  let focusDays = 0;
  let minutesMin = 0;
  let minutesMax = 0;

  weekdayLabels.forEach((day) => {
    const dayInput = createInputForShift(baseInput, schedule[day.key], customTemplate);
    const result = createRoutine(dayInput);
    const isNight = isNightShift(dayInput) || endsNextDay(dayInput);
    const isRest = isOff(dayInput);

    if (isNight) nightCount += 1;
    if (isRest) offCount += 1;
    if (result.fatigueScore >= 70 || isNight) recoveryDays += 1;
    if (result.sideHustleTime.minutes >= 60 && result.fatigueScore < 70) focusDays += 1;

    const minutes = result.sideHustleTime.minutes;
    minutesMin += Math.max(15, Math.round(minutes * 0.65));
    minutesMax += minutes;
  });

  return {
    nightCount,
    offCount,
    recoveryDays,
    sideHustleFocusMin: Math.max(0, Math.floor(focusDays * 0.7)),
    sideHustleFocusMax: focusDays,
    sideHustleHoursMin: Math.round(minutesMin / 60),
    sideHustleHoursMax: Math.max(1, Math.round(minutesMax / 60)),
  };
}

export function createDayPreview(shiftType: ShiftType) {
  if (shiftType === "D") {
    return ["퇴근 후 회복 식사", "30~60분 부업 가능", "수면 준비"];
  }
  if (shiftType === "S") {
    return ["오전 공부/운동 가능", "출근 전 가벼운 정리", "퇴근 후 짧은 휴식"];
  }
  if (shiftType === "G" || shiftType === "N") {
    return ["출근 전 긴 휴식", "퇴근 후 회복 수면 우선", "부업은 메모형 작업만 추천"];
  }
  if (shiftType === "Off") {
    return ["회복 블록 먼저 확보", "1~3시간 집중 작업 가능", "다음 근무 준비"];
  }
  return ["직접 입력 시간 기준", "퇴근 후 회복 먼저", "짧은 목표 활동 배치"];
}

export function formatWeeklyScheduleLine(schedule: WeeklySchedule) {
  return weekdayLabels
    .map((day) => `${day.short} ${getShiftShortLabel(schedule[day.key]).split(" ")[0]}`)
    .join(" / ");
}

export function formatWeeklySummaryText(schedule: WeeklySchedule, summary: WeeklySummary) {
  return `[이번 주 근무표 요약]
${formatWeeklyScheduleLine(schedule)}
야간근무 ${summary.nightCount}일 · 휴무 ${summary.offCount}일
예상 부업 가능 시간 ${summary.sideHustleHoursMin}~${summary.sideHustleHoursMax}시간`;
}

function workdayRoutine(input: RoutineInput): RoutineResult {
  return buildResult(input, {
    title: `${input.shiftName || "선택 근무"} 흐름에 맞춘 루틴`,
    summary: "회사별 근무시간을 기준으로 회복과 목표 시간을 나눠 배치했습니다.",
    schedule: [
      ["출근 60분 전", "출근 준비", "물 한 컵, 가벼운 스트레칭, 간단한 식사", "care"],
      [workTimeText(input), "근무", "중간중간 물을 마시고 퇴근 후 추가 일정을 줄이기", "work"],
      ["퇴근 후 1시간", "회복 식사", "과식보다 부담 낮은 식사와 샤워 먼저 하기", "care"],
      ["회복 후", "목표 시간", goalBlock(input.goal), "growth"],
      ["취침 전", "수면 준비", "휴대폰 밝기를 낮추고 다음 근무 준비물 정리", "rest"],
    ],
  });
}

function swingRoutine(input: RoutineInput): RoutineResult {
  return buildResult(input, {
    title: "오후 근무자를 위한 오전 활용 루틴",
    summary: "출근 전 집중 시간을 쓰고 퇴근 후에는 바로 쉬는 구성입니다.",
    schedule: [
      ["기상 후", "가벼운 시작", "햇빛 보기, 물 한 컵, 10분 산책", "care"],
      ["출근 전", "목표 시간", goalBlock(input.goal), "growth"],
      ["출근 90분 전", "식사와 준비", "속이 부담스럽지 않은 식사와 준비물 확인", "care"],
      [workTimeText(input), "근무", "늦은 카페인은 피하고 퇴근 후 일을 늘리지 않기", "work"],
      ["퇴근 후", "수면 준비", "샤워 후 조명 낮추고 바로 쉬기", "rest"],
    ],
  });
}

function nightRecovery(input: RoutineInput): RoutineResult {
  return buildResult(input, {
    title: "야간근무 후 회복 루틴",
    summary: "야간근무 후에는 긴 집중 작업보다 수면, 식사, 짧은 정리를 먼저 배치했습니다.",
    schedule: [
      ["퇴근 직후", "귀가와 정리", "빛 자극을 줄이고 바로 귀가하기", "care"],
      ["귀가 후", "가벼운 식사", "과식하지 말고 잠을 방해하지 않는 양만 먹기", "care"],
      ["식사 후", "핵심 수면", "방을 어둡게 하고 알림 끄기", "rest"],
      ["기상 후", "회복 활동", "가벼운 걷기나 스트레칭 15분", "care"],
      ["회복 후", "짧은 성장 시간", goalBlock(input.goal), "growth"],
    ],
  });
}

function offDayGrowth(input: RoutineInput): RoutineResult {
  return buildResult(input, {
    title: "휴무일 회복과 성장 루틴",
    summary: "휴무일에는 회복 블록을 먼저 두고 남는 시간을 성장 활동에 배치했습니다.",
    schedule: [
      ["오전", "기상과 회복", "평소보다 너무 늦지 않게 일어나 리듬 유지", "care"],
      ["오전 후반", "가벼운 운동", "걷기, 헬스, 홈트 중 하나를 30~50분", "growth"],
      ["점심 후", "정리 시간", "집안일과 다음 근무 준비를 짧게 처리", "care"],
      ["오후", "성장 블록", goalBlock(input.goal), "growth"],
      ["밤", "수면 준비", "다음 근무에 맞춰 취침 시간 조정", "rest"],
    ],
  });
}

function buildResult(input: RoutineInput, base: RoutineBase): RoutineResult {
  const fatigueScore = calculateFatigueScore(input);
  const sideHustleTime = calculateSideHustleTime(input, fatigueScore);

  return {
    ...base,
    schedule: base.schedule.map(([time, title, detail, tone]) => ({
      time,
      title,
      detail,
      tone,
    })),
    actions: [
      goalAction[input.goal],
      fatigueScore >= 70 ? "오늘은 추가 계획을 줄이고 짧게만 진행하기" : "작은 할 일 1개를 끝내기",
      "선택한 근무 패턴에 맞춰 다음 근무 준비물 미리 챙기기",
    ],
    caution: cautionText(input, fatigueScore),
    fatigueScore,
    fatigueLabel: fatigueLabel(fatigueScore),
    fatigueNote: fatigueNote(input, fatigueScore),
    recommendedMode: recommendedMode(fatigueScore),
    sideHustleTime,
    handoverMemo: createHandoverMemo(),
    coreRoutine: createCoreRoutine(input, fatigueScore, sideHustleTime),
  };
}

function calculateFatigueScore(input: RoutineInput) {
  let score = 42;
  const night = isNightShift(input);
  const nextDayEnd = endsNextDay(input);

  if (isOff(input)) score -= input.goal === "회복 우선" ? 20 : 8;
  if (night) score += 28;
  if (nextDayEnd) score += 10;
  if (input.shiftType === "S") score += 8;
  if (input.shiftType === "custom") score += 6;

  if (input.routineType === "야간근무 후 회복 루틴") score += 18;
  if (input.routineType === "Off day 성장 루틴") score += input.goal === "회복 우선" ? -10 : 3;
  if (input.routineType === "내일 루틴") score -= 4;

  if (input.goal === "회복 우선") score -= 10;
  if (input.goal === "운동 우선") score += 7;
  if (input.goal === "공부 우선") score += 4;
  if (input.goal === "부업 우선") score += night ? 14 : 9;

  return Math.min(100, Math.max(0, score));
}

function calculateSideHustleTime(input: RoutineInput, fatigueScore: number): SideHustleTime {
  if (isOff(input) || input.routineType === "Off day 성장 루틴") {
    const minutes = input.goal === "회복 우선" ? 60 : input.goal === "부업 우선" ? 180 : 120;
    return {
      label: minutes >= 180 ? "1~3시간" : minutes >= 120 ? "1~2시간" : "60분",
      minutes,
      focusLabel: "집중 작업 가능 시간",
      note: "휴무일에는 1~3시간도 가능하지만 회복 블록을 먼저 두는 편이 현실적입니다.",
      workType: sideHustleWorkType(minutes),
    };
  }

  if (isNightShift(input) || endsNextDay(input) || input.routineType === "야간근무 후 회복 루틴") {
    return {
      label: "15~30분",
      minutes: 30,
      note: "야간근무 후에는 15~30분 이하의 짧은 메모형 작업을 추천합니다.",
      workType: sideHustleWorkType(30),
    };
  }

  if (fatigueScore >= 70) {
    return {
      label: "15~30분",
      minutes: 30,
      note: "피로도 70점 이상이면 짧은 메모형 작업이 맞습니다.",
      workType: sideHustleWorkType(30),
    };
  }

  const minutes = input.goal === "부업 우선" ? 90 : 60;
  return {
    label: minutes > 60 ? "60~90분" : "30~60분",
    minutes,
    note: "주간근무 후에는 회복 뒤 30~90분 범위에서 작은 결과물 1개를 목표로 잡기 좋습니다.",
    workType: sideHustleWorkType(minutes),
  };
}

function sideHustleWorkType(minutes: number) {
  if (minutes <= 30) return "아이디어 메모, 블로그 초안, 가벼운 코드 수정";
  if (minutes <= 60) return "글 1개 초안, 기능 1개 수정, 자료 정리";
  return "집중 개발, 콘텐츠 제작, 긴 글 작성";
}

function createHandoverMemo(): HandoverMemo {
  return {
    title: "교대근무 인수인계 메모",
    lines: [
      "금일 근무 특이사항:",
      "확인 필요 항목:",
      "다음 근무자 전달사항:",
      "개인 컨디션 메모:",
    ],
  };
}

function createCoreRoutine(input: RoutineInput, fatigueScore: number, sideHustleTime: SideHustleTime) {
  if (fatigueScore >= 70) {
    return `오늘 근무 흐름에 맞춰 회복 먼저, 부업은 ${sideHustleTime.label} 안에서 메모나 초안만 진행`;
  }

  if (isOff(input) || input.routineType === "Off day 성장 루틴") {
    return `휴무일에는 회복 블록을 먼저 두고 ${sideHustleTime.focusLabel ?? "부업 가능 시간"} ${sideHustleTime.label}`;
  }

  if (input.goal === "부업 우선") {
    return `퇴근 후 회복 시간을 먼저 확보한 뒤 부업 ${sideHustleTime.label}`;
  }

  return `수면 준비를 먼저 고정하고 목표 활동은 ${sideHustleTime.label} 안에서 진행`;
}

function fatigueLabel(score: number) {
  if (score >= 70) return "회복 우선";
  if (score >= 40) return "균형 필요";
  return "여유 있음";
}

function recommendedMode(score: number) {
  if (score >= 70) return "회복 우선";
  if (score >= 40) return "균형 유지";
  return "짧은 집중 가능";
}

function fatigueNote(input: RoutineInput, score: number) {
  if (isNightShift(input) || endsNextDay(input)) {
    return "야간 시간대가 포함되어 피로도를 높게 잡았습니다. 오늘은 회복 시간을 먼저 확보하세요.";
  }

  if (isOff(input)) {
    return input.goal === "회복 우선"
      ? "휴무일 회복형 루틴으로 피로도를 낮게 잡았습니다."
      : "휴무일 성장형 루틴이라 집중 시간은 늘리고 과한 일정은 줄였습니다.";
  }

  if (score >= 70) return "계획을 줄이고 꼭 필요한 활동만 남기는 편이 좋습니다.";
  return "오늘 근무 흐름에 맞춰 남는 에너지를 작은 루틴으로 나눠 쓰는 상태입니다.";
}

function goalBlock(goal: GoalType) {
  if (goal === "회복 우선") return "낮잠 20분 또는 가벼운 산책 후 일찍 쉬기";
  if (goal === "운동 우선") return "근력 30분 또는 빠르게 걷기 40분";
  if (goal === "공부 우선") return "자격증, 영어, 업무 공부 중 하나를 50분";
  if (goal === "부업 우선") return "아이디어 정리, 콘텐츠 초안, 자동화 실험 중 하나 완료";
  return "운동 20분, 공부 30분, 부업 메모 15분";
}

function cautionText(input: RoutineInput, fatigueScore: number) {
  if (isNightShift(input) || endsNextDay(input)) {
    return input.goal === "부업 우선"
      ? "야간근무 후 부업 우선 목표라면 긴 집중 작업보다 짧은 메모형 작업만 남기세요."
      : "야간근무 후에는 피로가 쌓이기 쉬우므로 강한 운동과 긴 공부를 피하세요.";
  }

  if (fatigueScore >= 70) {
    return "피로도가 높습니다. 오늘은 계획을 줄이고 쉬는 시간을 먼저 두세요.";
  }

  if (input.goal === "운동 우선") {
    return "피로가 높은 날에는 운동 강도를 낮추고 수면 시간을 먼저 확보하세요.";
  }

  if (input.goal === "부업 우선") {
    return "퇴근 후 부업 시간을 길게 늘리기보다 작은 결과물 1개에 집중하세요.";
  }

  return "피로가 심하면 루틴을 줄이고 회복을 먼저 선택하세요.";
}

function workTimeText(input: RoutineInput) {
  if (!input.shiftStart || !input.shiftEnd) return getShiftText(input);
  return endsNextDay(input) ? `${input.shiftStart}~다음 날 ${input.shiftEnd}` : `${input.shiftStart}~${input.shiftEnd}`;
}

function isOff(input: RoutineInput) {
  return input.shiftType === "Off";
}

function isNightShift(input: RoutineInput) {
  if (input.shiftType === "G" || input.shiftType === "N") return true;
  if (!input.shiftStart || !input.shiftEnd || isOff(input)) return false;

  const start = parseTime(input.shiftStart);
  const end = parseTime(input.shiftEnd);
  if (start === null || end === null) return false;

  return includesNightHour(start, end) || endsNextDay(input);
}

function endsNextDay(input: RoutineInput) {
  if (!input.shiftStart || !input.shiftEnd || isOff(input)) return false;
  const start = parseTime(input.shiftStart);
  const end = parseTime(input.shiftEnd);
  if (start === null || end === null) return false;
  return end <= start;
}

function includesNightHour(start: number, end: number) {
  const adjustedEnd = end <= start ? end + 24 * 60 : end;
  for (let minute = start; minute <= adjustedEnd; minute += 60) {
    const hour = Math.floor((minute % (24 * 60)) / 60);
    if (hour >= 22 || hour < 6) return true;
  }
  return false;
}

function parseTime(value: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;
  return hour * 60 + minute;
}
