"use client";

import { Section } from "@/components/Section";

export function GuidePanel() {
  return (
    <div className="space-y-4">
      <Section title="교대근무 루틴이 어려운 이유">
        <p className="break-keep text-sm leading-6 text-slate-700">
          교대근무는 회사마다 근무 이름, 시작 시간, 종료 시간, 휴무 흐름이 다릅니다.
          그래서 일반 일정 앱만으로는 수면, 식사, 운동, 공부, 부업 시간을 현실적으로 나누기 어렵습니다.
        </p>
      </Section>
      <Section title="회사마다 다른 근무시간을 반영해야 하는 이유">
        <p className="break-keep text-sm leading-6 text-slate-700">
          같은 D, S, G, N 근무라도 출근과 퇴근 시간이 다르면 퇴근 후 회복 시간과 부업 가능 시간이 달라집니다.
          ShiftMate Korea는 입력한 시간을 기준으로 야간 여부와 다음 날 퇴근 여부를 함께 봅니다.
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
          <Faq question="4조3교대가 아니어도 사용할 수 있나요?" answer="네. 3조2교대, 2교대, 주야비, 주주야야비비, 고정 근무, 직접 입력 근무표까지 생활 루틴 참고용으로 사용할 수 있습니다." />
          <Faq question="회사 근무시간이 다른데 직접 바꿀 수 있나요?" answer="네. 근무 이름, 출근 시간, 퇴근 시간, 근무 메모를 직접 입력할 수 있습니다. 입력값은 이 기기의 localStorage에 저장됩니다." />
          <Faq question="야간근무 후 바로 운동해도 되나요?" answer="야간근무 후에는 긴 운동보다 수면, 식사, 가벼운 정리부터 배치하는 방식으로 안내합니다. 의학적 조언이 아닌 생활 루틴 참고용입니다." />
          <Faq question="교대근무 중 부업 시간은 언제 잡는 게 좋나요?" answer="피로도가 낮은 날은 퇴근 후 회복 뒤, 휴무일은 오후 집중 블록에 잡는 식으로 나눌 수 있습니다. 이 기준은 생활 루틴 참고용입니다." />
          <Faq question="이 서비스는 수면 의학 조언인가요?" answer="아닙니다. ShiftMate Korea는 의학적 조언이 아닌 생활 루틴 참고용 웹앱입니다." />
        </div>
      </Section>
      <Section title="앱처럼 사용하기">
        <ul className="space-y-2 text-sm leading-6 text-slate-700">
          <li>iPhone Safari: 공유 버튼 → 홈 화면에 추가</li>
          <li>Android Chrome: 메뉴 → 홈 화면에 추가</li>
          <li>앱스토어 등록 전에도 웹앱처럼 빠르게 다시 열 수 있습니다.</li>
          <li>월간 근무표와 기록 데이터는 이 기기 localStorage에 저장됩니다.</li>
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
