import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 - ShiftMate Korea",
  description: "ShiftMate Korea의 localStorage 기반 데이터 저장 방식과 개인정보 처리 안내",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-5 px-4 py-8 sm:px-6">
      <header className="rounded-lg bg-white p-5 shadow-soft">
        <p className="text-sm font-bold text-leaf">ShiftMate Korea</p>
        <h1 className="mt-2 text-3xl font-extrabold text-ink">개인정보처리방침 초안</h1>
        <p className="mt-3 break-keep text-sm leading-6 text-slate-700">
          이 문서는 현재 서비스 구조를 기준으로 작성한 운영 정책 초안입니다. 실제 배포 전 운영자 정보와 법률 검토에 맞게
          수정이 필요할 수 있습니다.
        </p>
      </header>

      <PolicySection title="1. 서비스 개요">
        <p>ShiftMate Korea는 교대근무자의 근무표, 생활 루틴, 컨디션 기록을 정리하는 참고용 웹앱입니다.</p>
        <p>현재 회원가입, 서버 DB, 결제, 광고, 외부 분석 도구를 사용하지 않습니다.</p>
      </PolicySection>

      <PolicySection title="2. 저장되는 데이터">
        <p>사용자가 입력한 근무표, 직접 입력 근무시간, 컨디션, 체크리스트, 메모는 브라우저 localStorage에 저장됩니다.</p>
        <p>이 데이터는 서버로 전송되거나 운영자 DB에 저장되지 않습니다.</p>
      </PolicySection>

      <PolicySection title="3. 데이터 삭제">
        <p>사용자는 브라우저 데이터 삭제, 앱 내 초기화 버튼, 또는 localStorage 삭제를 통해 저장된 데이터를 삭제할 수 있습니다.</p>
        <p>기기 변경, 브라우저 초기화, 시크릿 모드 사용 시 기존 데이터가 사라질 수 있습니다.</p>
      </PolicySection>

      <PolicySection title="4. 입력 금지 정보">
        <p>민감한 개인정보, 회사 기밀, 실제 사내 보안 정보, 타인의 개인정보는 입력하지 않는 것을 권장합니다.</p>
        <p>공용 PC에서는 사용 후 기록 초기화와 브라우저 데이터 삭제를 권장합니다.</p>
      </PolicySection>

      <PolicySection title="5. 문의">
        <p>문의 이메일은 추후 추가 예정입니다.</p>
        <p>운영자 정보가 확정되면 이 항목을 실제 연락처 기준으로 업데이트해야 합니다.</p>
      </PolicySection>

      <PolicySection title="6. 안내">
        <p>이 문서는 법률 자문이 아니며, 실제 서비스 운영 전 관련 법령과 운영 방식에 맞춘 검토가 필요합니다.</p>
      </PolicySection>

      <FooterLinks />
    </main>
  );
}

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
      <h2 className="text-lg font-extrabold text-ink">{title}</h2>
      <div className="mt-3 space-y-2 break-keep text-sm leading-6 text-slate-700">{children}</div>
    </section>
  );
}

function FooterLinks() {
  return (
    <footer className="flex flex-wrap gap-3 rounded-lg bg-white p-4 text-sm font-bold text-ink shadow-soft">
      <a className="underline-offset-4 hover:underline" href="/">
        홈으로
      </a>
      <a className="underline-offset-4 hover:underline" href="/terms">
        이용약관
      </a>
    </footer>
  );
}
