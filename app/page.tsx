import Link from "next/link";

const adminPages = [
  {
    href: "/dashboard",
    title: "Dashboard",
    description: "메트릭 카드 4개(총 발급, 클레임율, 활성 뱃지, 공유) + 최근 발급 테이블",
    icon: "dashboard",
  },
  {
    href: "/badges",
    title: "Badge Management",
    description: "탭 필터(All/Active/Draft/Archived) + 검색 + 뱃지 목록 테이블 + 페이지네이션",
    icon: "verified",
  },
  {
    href: "/badges/create",
    title: "Create Badge",
    description: "뱃지 생성 폼(이름, 카테고리, 설명, 스킬, 유효기간, 획득조건) + 미리보기",
    icon: "add_circle",
  },
];

const publicPages = [
  {
    href: "/login",
    title: "Login",
    description: "스플릿 레이아웃 로그인 — 오렌지 브랜딩 패널 + 로그인 폼(소셜 로그인 포함)",
    icon: "login",
  },
  {
    href: "/claim/1",
    title: "Badge Claim",
    description: "뱃지 클레임 페이지 — 뱃지 비주얼 + 상세 정보 + 스킬 태그 + CTA 버튼",
    icon: "card_giftcard",
  },
  {
    href: "/profile/kim-minji",
    title: "Profile",
    description: "사용자 프로필 — 아바타 + 통계(Badges, Earned, Shared) + 뱃지 그리드 + 스킬 목록",
    icon: "person",
  },
];

const prototypePages = [
  {
    href: "/test",
    title: "Mission Test",
    description: "미션 완료 → 뱃지 자동 발급 → 외부 공유 URL 생성 (SQLite 백엔드 연동)",
    icon: "science",
    highlight: true,
  },
];

function PageCard({
  page,
}: {
  page: { href: string; title: string; description: string; icon: string; highlight?: boolean };
}) {
  return (
    <Link
      href={page.href}
      className={`group block rounded-[16px] border p-5 transition-all hover:shadow-md ${
        page.highlight
          ? "border-[var(--primary)] bg-[var(--primary)]/5"
          : "border-[var(--border)] bg-[var(--card)]"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-[44px] h-[44px] rounded-full flex items-center justify-center shrink-0 ${
            page.highlight ? "bg-[var(--primary)]" : "bg-[var(--muted)]"
          }`}
        >
          <span
            className={`material-icons text-[22px] ${
              page.highlight ? "text-white" : "text-[var(--muted-foreground)]"
            }`}
          >
            {page.icon}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-primary font-bold group-hover:text-[var(--primary)] transition-colors">
              {page.title}
            </h3>
            <span className="material-icons text-[16px] text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity">
              arrow_forward
            </span>
          </div>
          <p className="text-[13px] text-[var(--muted-foreground)] font-secondary mt-1">
            {page.description}
          </p>
          <code className="text-[12px] text-[var(--muted-foreground)] font-primary mt-2 block">
            {page.href}
          </code>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="min-h-full bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="max-w-[900px] mx-auto px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-[48px] h-[48px] bg-[var(--primary)] rounded-[12px] flex items-center justify-center">
              <span className="material-icons text-white text-[28px]">
                workspace_premium
              </span>
            </div>
            <span className="text-[24px] font-primary font-bold text-[var(--primary)]">
              BADGEFLOW
            </span>
          </div>
          <h1 className="text-[32px] font-primary font-bold mt-4">
            Digital Badge Platform
          </h1>
          <p className="text-[16px] text-[var(--muted-foreground)] font-secondary mt-2 max-w-[600px]">
            디지털 뱃지를 생성, 발급, 관리하는 플랫폼 프로토타입입니다.
            아래 링크에서 각 페이지를 확인해 보세요.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[900px] mx-auto px-8 py-8">
        {/* Prototype Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-icons text-[var(--primary)]">bolt</span>
            <h2 className="text-[18px] font-primary font-bold">
              Prototype (백엔드 연동)
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {prototypePages.map((page) => (
              <PageCard key={page.href} page={page} />
            ))}
          </div>
        </section>

        {/* Admin Pages */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-icons text-[var(--muted-foreground)]">
              admin_panel_settings
            </span>
            <h2 className="text-[18px] font-primary font-bold">
              Admin Pages (관리자)
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {adminPages.map((page) => (
              <PageCard key={page.href} page={page} />
            ))}
          </div>
        </section>

        {/* Public Pages */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-icons text-[var(--muted-foreground)]">
              public
            </span>
            <h2 className="text-[18px] font-primary font-bold">
              Public Pages (공개)
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {publicPages.map((page) => (
              <PageCard key={page.href} page={page} />
            ))}
          </div>
        </section>

        {/* API Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-icons text-[var(--muted-foreground)]">
              api
            </span>
            <h2 className="text-[18px] font-primary font-bold">
              API Endpoints
            </h2>
          </div>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-[16px] overflow-hidden">
            {[
              { method: "GET", path: "/api/missions", desc: "미션 목록 + 완료 여부" },
              { method: "POST", path: "/api/missions/[id]/complete", desc: "미션 완료 → 뱃지 발급" },
              { method: "GET", path: "/api/earned-badges", desc: "획득 뱃지 목록" },
              { method: "GET", path: "/api/earned-badges/[id]", desc: "단일 뱃지 상세 (공유용)" },
              { method: "GET", path: "/api/verify/[id]", desc: "뱃지 블록체인 검증 (on-chain 해시 비교)" },
            ].map((api, i) => (
              <div
                key={api.path}
                className={`flex items-center gap-4 px-5 py-3 ${
                  i > 0 ? "border-t border-[var(--border)]" : ""
                }`}
              >
                <span
                  className={`text-[12px] font-primary font-bold px-2 py-0.5 rounded ${
                    api.method === "POST"
                      ? "bg-[var(--color-warning)] text-[var(--color-warning-foreground)]"
                      : "bg-[var(--color-success)] text-[var(--color-success-foreground)]"
                  }`}
                >
                  {api.method}
                </span>
                <code className="text-[13px] font-primary text-[var(--foreground)]">
                  {api.path}
                </code>
                <span className="text-[13px] text-[var(--muted-foreground)] font-secondary ml-auto">
                  {api.desc}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
