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

const shiftLabels: Record<ShiftType, string> = {
  D: "D 06:00~14:00",
  S: "S 14:00~22:00",
  G: "G 22:00~06:00",
  Off: "Off",
  custom: "직접 입력",
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

export function formatHandoverMemo(result: RoutineResult) {
  return result.handoverMemo.lines.join("\n");
}

export function formatRoutineText(input: RoutineInput, result: RoutineResult) {
  const coreSteps = result.schedule.map((item, index) => `${index + 1}. ${item.title}`).join("\n");
  const actions = result.actions.map((action, index) => `${index + 1}. ${action}`).join("\n");

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

주의:
의학적 조언이 아닌 생활 루틴 참고용입니다.
수면 부족, 무리한 운동, 과로를 권장하지 않습니다.`;
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
    summary: "출근 전 집중 시간을 쓰고, 퇴근 후에는 바로 쉬는 구성입니다.",
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
    summary: "퇴근 후 수면을 먼저 두고 짧은 정리와 휴식 위주로 배치한 구성입니다.",
    schedule: [
      ["06:20", "퇴근 직후", "빛 자극을 줄이고 바로 귀가하기", "care"],
      ["07:00", "가벼운 식사", "과식하지 말고 잠을 방해하지 않는 양만 먹기", "care"],
      ["08:00~13:30", "핵심 수면", "방을 어둡게 하고 알림 끄기", "rest"],
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
      ["22:30", "수면 준비", "다음 근무에 맞춰 취침 시간 조정", "rest"],
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
      `${getPatternText(input)} 리듬에 맞춰 다음 근무 준비물 미리 챙기기`,
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
  let score = 45;

  if (input.shiftType === "D") score += 8;
  if (input.shiftType === "S") score += 12;
  if (input.shiftType === "G") score += 35;
  if (input.shiftType === "Off") score -= input.goal === "회복 우선" ? 20 : 6;
  if (input.shiftType === "custom") score += 15;

  if (input.routineType === "야간근무 후 회복 루틴") score += 28;
  if (input.routineType === "Off day 성장 루틴") {
    score += input.goal === "회복 우선" ? -12 : 4;
  }
  if (input.routineType === "내일 루틴") score -= 4;

  if (input.goal === "회복 우선") score -= 10;
  if (input.goal === "운동 우선") score += 7;
  if (input.goal === "공부 우선") score += 4;
  if (input.goal === "부업 우선") score += 9;

  return Math.min(100, Math.max(0, score));
}

function calculateSideHustleTime(input: RoutineInput, fatigueScore: number): SideHustleTime {
  if (input.shiftType === "Off" || input.routineType === "Off day 성장 루틴") {
    const minutes = input.goal === "회복 우선" ? 60 : input.goal === "부업 우선" ? 120 : 90;
    return {
      label: minutes >= 120 ? "1~2시간" : `${minutes}분`,
      minutes,
      focusLabel: "집중 작업 가능 시간",
      note:
        input.goal === "회복 우선"
          ? "쉬는 날이어도 회복을 먼저 두고 60분 안에서 진행하세요."
          : "Off day는 집중 작업 가능 시간을 따로 잡기 좋습니다.",
      workType: sideHustleWorkType(minutes),
    };
  }

  if (input.shiftType === "G" || input.routineType === "야간근무 후 회복 루틴") {
    return {
      label: "15~30분",
      minutes: 30,
      note: "긴 집중 작업보다 회복 후 짧은 메모형 부업을 추천합니다.",
      workType: sideHustleWorkType(30),
    };
  }

  if (fatigueScore >= 70) {
    return {
      label: "15~30분",
      minutes: 30,
      note: "오늘은 15~30분 이하의 가벼운 작업만 추천합니다.",
      workType: sideHustleWorkType(30),
    };
  }

  if (fatigueScore >= 40) {
    return {
      label: "30~60분",
      minutes: 60,
      note: "긴 작업보다 초안, 자료 정리, 가벼운 수정이 맞습니다.",
      workType: sideHustleWorkType(60),
    };
  }

  const minutes = input.goal === "부업 우선" ? 120 : 60;
  return {
    label: minutes >= 120 ? "1~2시간" : "30~60분",
    minutes,
    note: "작은 결과물 1개를 목표로 잡기 좋은 시간입니다.",
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
    return `회복 먼저, 부업은 ${sideHustleTime.label} 안에서 메모나 초안만 진행`;
  }

  if (input.shiftType === "Off" || input.routineType === "Off day 성장 루틴") {
    return `오전 회복, 오후 ${sideHustleTime.focusLabel ?? "부업 가능 시간"} ${sideHustleTime.label}`;
  }

  if (input.goal === "부업 우선") {
    return `퇴근 후 회복 1시간 확보 뒤 부업 ${sideHustleTime.label}`;
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
  if (input.shiftType === "G" || input.routineType === "야간근무 후 회복 루틴") {
    return "야간 리듬이라 피로도를 높게 잡았습니다. 오늘은 회복 시간을 먼저 확보하세요.";
  }

  if (input.shiftType === "Off" || input.routineType === "Off day 성장 루틴") {
    return input.goal === "회복 우선"
      ? "회복형 Off day로 피로도를 낮게 잡았습니다."
      : "성장형 Off day라 집중 시간은 늘리고 과한 일정은 줄였습니다.";
  }

  if (score >= 70) return "계획을 줄이고 꼭 필요한 활동만 남기는 편이 좋습니다.";
  return "근무 후 남는 에너지를 작은 루틴으로 나눠 쓰는 상태입니다.";
}

function goalBlock(goal: GoalType) {
  if (goal === "회복 우선") return "낮잠 20분 또는 가벼운 산책 후 일찍 쉬기";
  if (goal === "운동 우선") return "근력 30분 또는 빠르게 걷기 40분";
  if (goal === "공부 우선") return "자격증, 영어, 업무 공부 중 하나를 50분";
  if (goal === "부업 우선") return "아이디어 정리, 콘텐츠 초안, 자동화 실험 중 하나 완료";
  return "운동 20분, 공부 30분, 부업 메모 15분";
}

function cautionText(input: RoutineInput, fatigueScore: number) {
  if (input.shiftType === "G" || input.routineType === "야간근무 후 회복 루틴") {
    return "야간 후에는 피로가 쌓이기 쉬우므로 강한 운동과 긴 공부를 피하세요.";
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
