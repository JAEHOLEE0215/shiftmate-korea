"use client";

type OnboardingCardsProps = {
  onDismiss: () => void;
};

const onboardingItems = [
  {
    title: "근무표를 먼저 등록하세요",
    body: "월간 캘린더와 반복 패턴으로 회사 근무표를 빠르게 채울 수 있습니다.",
  },
  {
    title: "오늘 루틴을 확인하세요",
    body: "선택한 날짜와 근무 타입에 맞춰 수면, 회복, 운동, 공부, 부업 루틴을 정리합니다.",
  },
  {
    title: "매일 컨디션을 기록하세요",
    body: "오늘 컨디션과 체크리스트를 저장해 최근 7일 흐름을 확인할 수 있습니다.",
  },
];

export function OnboardingCards({ onDismiss }: OnboardingCardsProps) {
  return (
    <section className="rounded-lg border border-leaf/20 bg-white p-4 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold text-leaf">처음 사용하는 방법</p>
          <h2 className="mt-1 text-xl font-extrabold text-ink">ShiftMate를 매일 루틴 체크 앱처럼 사용하세요</h2>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="온보딩 다시 보지 않기"
          className="min-h-11 rounded-lg border border-ink/10 bg-mist px-4 py-2 text-sm font-bold text-ink"
        >
          다시 보지 않기
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-3">
        {onboardingItems.map((item, index) => (
          <article key={item.title} className="rounded-lg bg-mist p-4">
            <p className="text-xs font-bold text-leaf">Step {index + 1}</p>
            <h3 className="mt-1 text-base font-extrabold text-ink">{item.title}</h3>
            <p className="mt-2 break-keep text-sm leading-6 text-slate-700">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
