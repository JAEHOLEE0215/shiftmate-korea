"use client";

export type AppTab = "today" | "month" | "week" | "sideHustle" | "handover" | "guide";

type AppTabsProps = {
  activeTab: AppTab;
  onChange: (tab: AppTab) => void;
};

const tabs: Array<{ id: AppTab; label: string; badge?: string }> = [
  { id: "today", label: "오늘 루틴" },
  { id: "month", label: "월간 캘린더" },
  { id: "week", label: "주간표" },
  { id: "sideHustle", label: "부업 시간", badge: "핵심" },
  { id: "handover", label: "인수인계" },
  { id: "guide", label: "가이드" },
];

export function AppTabs({ activeTab, onChange }: AppTabsProps) {
  return (
    <nav className="-mx-4 overflow-x-auto px-4" aria-label="ShiftMate 주요 탭">
      <div className="flex min-w-max gap-2 rounded-lg bg-white p-2 shadow-soft">
        {tabs.map((tab) => {
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              aria-pressed={selected}
              className={`min-h-11 rounded-lg px-4 py-2 text-sm font-bold transition ${
                selected ? "bg-ink text-white" : "bg-mist text-ink hover:bg-leaf/10"
              }`}
            >
              {tab.label}
              {tab.badge ? (
                <span
                  className={`ml-2 rounded px-1.5 py-0.5 text-[11px] ${
                    selected ? "bg-white/20 text-white" : "bg-amber/30 text-ink"
                  }`}
                >
                  {tab.badge}
                </span>
              ) : null}
              {selected ? <span className="ml-2 text-xs">선택됨</span> : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
