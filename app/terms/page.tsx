import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이용약관 - ShiftMate Korea",
  description: "ShiftMate Korea 이용 조건과 생활 루틴 참고용 안내",
};

export default function TermsPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-5 px-4 py-8 sm:px-6">
      <header className="rounded-lg bg-white p-5 shadow-soft">
        <p className="text-sm font-bold text-leaf">ShiftMate Korea</p>
        <h1 className="mt-2 text-3xl font-extrabold text-ink">이용약관 초안</h1>
        <p className="mt-3 break-keep text-sm leading-6 text-slate-700">
          이 문서는 앱 배포 준비를 위한 이용약관 초안입니다. 실제 운영 전 운영자 정보와 서비스 정책에 맞춘 검토가 필요합니다.
        </p>
      </header>

      <TermsSection title="1. 서비스 목적">
        <p>ShiftMate Korea는 교대근무 루틴 관리를 돕는 참고용 도구입니다.</p>
        <p>근무표, 수면 준비, 회복, 운동, 공부, 부업 시간을 사용자가 정리할 수 있도록 돕습니다.</p>
      </TermsSection>

      <TermsSection title="2. 참고용 안내">
        <p>이 서비스는 의학적, 법률적, 세무적, 노무적 자문이 아닙니다.</p>
        <p>수면, 건강, 부업 수익, 업무 성과를 보장하지 않습니다.</p>
      </TermsSection>

      <TermsSection title="3. 사용자 판단">
        <p>사용자는 본인의 건강 상태, 근무 환경, 회사 규정, 생활 상황에 맞게 내용을 조정해야 합니다.</p>
        <p>과로, 수면 부족, 무리한 운동, 무리한 부업을 권장하지 않습니다.</p>
      </TermsSection>

      <TermsSection title="4. 입력 금지 정보">
        <p>회사 기밀, 개인정보, 민감정보, 타인의 개인정보, 실제 사내 보안 정보는 입력하지 마세요.</p>
        <p>인수인계 메모에는 공개 가능한 범위의 개인 정리용 문장만 입력하는 것을 권장합니다.</p>
      </TermsSection>

      <TermsSection title="5. 데이터 저장">
        <p>ShiftMate Korea는 localStorage 기반 웹앱입니다.</p>
        <p>기기 변경, 브라우저 데이터 삭제, 시크릿 모드 사용 시 저장된 데이터가 사라질 수 있습니다.</p>
      </TermsSection>

      <TermsSection title="6. 서비스 변경">
        <p>서비스 화면, 기능, 문구는 사전 고지 없이 변경될 수 있습니다.</p>
        <p>중요한 근무 기록은 필요한 경우 사용자가 별도로 보관해야 합니다.</p>
      </TermsSection>

      <footer className="flex flex-wrap gap-3 rounded-lg bg-white p-4 text-sm font-bold text-ink shadow-soft">
        <a className="underline-offset-4 hover:underline" href="/">
          홈으로
        </a>
        <a className="underline-offset-4 hover:underline" href="/privacy">
          개인정보처리방침
        </a>
      </footer>
    </main>
  );
}

function TermsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
      <h2 className="text-lg font-extrabold text-ink">{title}</h2>
      <div className="mt-3 space-y-2 break-keep text-sm leading-6 text-slate-700">{children}</div>
    </section>
  );
}
