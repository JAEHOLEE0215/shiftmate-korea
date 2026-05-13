export type ShiftType = "D" | "S" | "G" | "Off" | "custom";
export type PatternType = "4조3교대" | "3조2교대" | "2교대" | "야간 고정" | "직접 입력";
export type GoalType = "회복 우선" | "운동 우선" | "공부 우선" | "부업 우선" | "균형 모드";
export type RoutineType =
  | "오늘 루틴"
  | "내일 루틴"
  | "야간근무 후 회복 루틴"
  | "Off day 성장 루틴";

export type RoutineInput = {
  shiftType: ShiftType;
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

export type RoutineResult = {
  title: string;
  summary: string;
  schedule: ScheduleItem[];
  actions: string[];
  caution: string;
};

type ScheduleTuple = [string, string, string, ScheduleItem["tone"]];
type RoutineBase = Omit<RoutineResult, "actions" | "caution" | "schedule"> & {
  schedule: ScheduleTuple[];
};

const shiftLabels: Record<ShiftType, string> = {
  D: "D 06:00~14:00",
  S: "S 14:00~22:00",
  G: "G 22:00~06:00",
  Off: "Off",
  custom: "직접 입력",
};

const goalAction: Record<GoalType, string> = {
  "회복 우선": "잠을 먼저 확보하고 나머지는 짧게 처리하기",
  "운동 우선": "무리 없는 강도로 20~40분 움직이기",
  "공부 우선": "집중이 잘 되는 시간에 40~60분 공부하기",
  "부업 우선": "작게 팔 수 있는 결과물 1개 만들기",
  "균형 모드": "수면, 몸풀기, 공부를 작게 나누기",
};

export const defaultInput: RoutineInput = {
  shiftType: "D",
  customShift: "",
  pattern: "4조3교대",
  customPattern: "",
  goal: "균형 모드",
  routineType: "오늘 루틴",
};

export function getShiftText(input: RoutineInput) {
  return input.shiftType === "custom" && input.customShift.trim()
    ? input.customShift.trim()
    : shiftLabels[input.shiftType];
}

export function getPatternText(input: RoutineInput) {
  return input.pattern === "직접 입력" && input.customPattern.trim()
    ? input.customPattern.trim()
    : input.pattern;
}

export function createRoutine(input: RoutineInput): RoutineResult {
  if (input.routineType === "야간근무 후 회복 루틴" || input.shiftType === "G") {
    return nightRecovery(input);
  }

  if (input.routineType === "Off day 성장 루틴" || input.shiftType === "Off") {
    return offDayGrowth(input);
  }

  if (input.shiftType === "S") {
    return swingRoutine(input);
  }

  if (input.shiftType === "custom") {
    return customRoutine(input);
  }

  return dayRoutine(input);
}

export function formatRoutineText(input: RoutineInput, result: RoutineResult) {
  const rows = result.schedule
    .map((item) => `- ${item.time} ${item.title}: ${item.detail}`)
    .join("\n");
  const actions = result.actions.map((action, index) => `${index + 1}. ${action}`).join("\n");

  return `ShiftMate Korea 루틴
근무: ${getShiftText(input)}
패턴: ${getPatternText(input)}
목표: ${input.goal}

${result.title}
${result.summary}

시간표
${rows}

오늘의 추천 행동 3개
${actions}

주의: ${result.caution}
의학적 조언이 아닌 생활 루틴 참고용입니다. 수면 부족, 무리한 운동, 과로를 권장하지 않습니다.`;
}

function dayRoutine(input: RoutineInput): RoutineResult {
  return buildResult(input, {
    title: "D 근무자를 위한 퇴근 후 회복 루틴",
    summary: "오전 근무 후 오후 에너지를 회복과 성장에 나눠 쓰는 구성입니다.",
    schedule: [
      ["05:10", "출근 준비", "물 한 컵, 가벼운 스트레칭, 간단한 식사", "care"],
      ["06:00~14:00", "근무", "카페인은 오전 중으로 줄이고 물을 자주 마시기", "work"],
      ["14:30", "회복 식사", "과식보다 단백질과 탄수화물을 적당히 챙기기", "care"],
      ["16:00", "목표 시간", goalBlock(input.goal), "growth"],
      ["21:30", "수면 준비", "휴대폰 밝기를 낮추고 내일 준비물 정리", "rest"],
    ],
  });
}

function swingRoutine(input: RoutineInput): RoutineResult {
  return buildResult(input, {
    title: "S 근무자를 위한 오전 활용 루틴",
    summary: "출근 전 집중 시간을 쓰고, 퇴근 후에는 바로 가라앉히는 구성입니다.",
    schedule: [
      ["08:30", "기상", "햇빛 보기, 물 한 컵, 10분 산책", "care"],
      ["10:00", "목표 시간", goalBlock(input.goal), "growth"],
      ["12:30", "출근 전 식사", "속이 부담스럽지 않은 식사와 준비물 확인", "care"],
      ["14:00~22:00", "근무", "늦은 카페인은 피하고 퇴근 후 일을 늘리지 않기", "work"],
      ["23:20", "수면 준비", "샤워 후 조명 낮추고 바로 쉬기", "rest"],
    ],
  });
}

function nightRecovery(input: RoutineInput): RoutineResult {
  return buildResult(input, {
    title: "야간근무 후 회복 루틴",
    summary: "퇴근 후 수면을 최우선으로 두고 몸을 천천히 회복시키는 구성입니다.",
    schedule: [
      ["06:20", "퇴근 직후", "선글라스나 모자로 빛 자극 줄이기", "care"],
      ["07:00", "가벼운 식사", "과식하지 말고 수면을 방해하지 않는 양만 먹기", "care"],
      ["08:00~13:30", "핵심 수면", "방을 어둡게 하고 알림을 끄기", "rest"],
      ["15:00", "회복 활동", "가벼운 걷기나 스트레칭 15분", "care"],
      ["18:30", "짧은 성장 시간", goalBlock(input.goal), "growth"],
    ],
  });
}

function offDayGrowth(input: RoutineInput): RoutineResult {
  return buildResult(input, {
    title: "Off day 성장 루틴",
    summary: "쉬는 날을 몰아붙이지 않고 회복과 성장을 같이 챙기는 구성입니다.",
    schedule: [
      ["09:00", "기상", "평소보다 너무 늦지 않게 일어나 리듬 유지", "care"],
      ["10:30", "운동", "걷기, 헬스, 홈트 중 하나를 30~50분", "growth"],
      ["13:00", "정리 시간", "집안일과 다음 근무 준비를 짧게 처리", "care"],
      ["15:00", "성장 블록", goalBlock(input.goal), "growth"],
      ["22:30", "수면 준비", "다음 근무에 맞춰 취침 시간을 조정", "rest"],
    ],
  });
}

function customRoutine(input: RoutineInput): RoutineResult {
  return buildResult(input, {
    title: "직접 입력 근무 맞춤 루틴",
    summary: "입력한 근무 시간을 기준으로 회복, 운동, 공부, 부업 시간을 작게 배치했습니다.",
    schedule: [
      ["근무 90분 전", "준비", "식사, 물, 준비물을 먼저 챙기기", "care"],
      [getShiftText(input), "근무", "중간중간 물을 마시고 무리한 추가 일정을 줄이기", "work"],
      ["퇴근 후 1시간", "회복", "식사와 샤워 후 몸 상태를 먼저 확인", "rest"],
      ["회복 후", "목표 시간", goalBlock(input.goal), "growth"],
      ["취침 전", "마무리", "내일 할 일 1개만 적고 쉬기", "rest"],
    ],
  });
}

function buildResult(
  input: RoutineInput,
  base: RoutineBase,
): RoutineResult {
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
      "졸리면 계획을 줄이고 20분 이내로 짧게 쉬기",
      `${getPatternText(input)} 리듬에 맞춰 내일 준비물 미리 챙기기`,
    ],
    caution: cautionText(input),
  };
}

function goalBlock(goal: GoalType) {
  if (goal === "회복 우선") return "낮잠 20분 또는 가벼운 산책 후 일찍 쉬기";
  if (goal === "운동 우선") return "근력 30분 또는 빠르게 걷기 40분";
  if (goal === "공부 우선") return "자격증, 영어, 업무 공부 중 하나를 50분";
  if (goal === "부업 우선") return "아이디어 정리, 콘텐츠 초안, 자동화 실험 중 하나 완료";
  return "운동 20분, 공부 30분, 부업 메모 15분";
}

function cautionText(input: RoutineInput) {
  if (input.shiftType === "G" || input.routineType === "야간근무 후 회복 루틴") {
    return "야간 후에는 수면 부족이 쌓이기 쉬워 강한 운동과 긴 공부를 피하세요.";
  }

  if (input.goal === "운동 우선") {
    return "피로가 높은 날에는 운동 강도를 낮추고 수면 시간을 먼저 확보하세요.";
  }

  if (input.goal === "부업 우선") {
    return "퇴근 후 부업 시간을 길게 늘리기보다 작은 결과물 1개에 집중하세요.";
  }

  return "피로가 심하면 루틴을 줄이고 회복을 먼저 선택하세요.";
}
