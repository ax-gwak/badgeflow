import Link from "next/link";

const prototypePages = [
  {
    href: "/test",
    title: "Mission Test",
    description:
      "미션 완료 → 뱃지 자동 발급 → 블록체인 해시 기록 → 외부 공유 URL 생성. 전체 플로우를 한 페이지에서 테스트합니다.",
    icon: "science",
    highlight: true,
    tags: ["SQLite", "Blockchain", "ethers.js"],
  },
];

const adminPages = [
  {
    href: "/dashboard",
    title: "Dashboard",
    description:
      "메트릭 카드 4개(총 발급, 클레임율, 활성 뱃지, 공유) + 최근 발급 테이블. 관리자 대시보드 UI.",
    icon: "dashboard",
    tags: ["UI"],
  },
  {
    href: "/badges",
    title: "Badge Management",
    description:
      "등록된 뱃지를 실시간 API로 조회. 검색, 카테고리별 필터, 삭제 기능. + Create Badge 버튼으로 신규 등록.",
    icon: "verified",
    tags: ["API", "CRUD"],
  },
  {
    href: "/badges/create",
    title: "Create Badge",
    description:
      "분류(시험 인증/책읽기/학습/STEM/창작/체육) 선택 + 뱃지 이름, 설명, 인증처, 인증조건 입력. 실시간 미리보기 + DB 저장.",
    icon: "add_circle",
    tags: ["API", "Form"],
  },
];

const publicPages = [
  {
    href: "/login",
    title: "Login",
    description:
      "실제 인증 연동 — NextAuth.js Credentials 로그인. 데모: admin@badgeflow.com / admin1234. 로그인 후 관리자 대시보드로 이동.",
    icon: "login",
    tags: ["NextAuth.js", "Auth"],
  },
  {
    href: "/claim/{earned-badge-id}",
    title: "Badge Claim",
    description:
      "뱃지 클레임 페이지 — 실제 DB 데이터 기반. 뱃지 비주얼 + 상세 정보 + 카테고리 + 블록체인 검증 상태 + CTA 버튼.",
    icon: "card_giftcard",
    tags: ["DB", "Dynamic"],
  },
  {
    href: "/profile/test-user",
    title: "Profile",
    description:
      "사용자 프로필 — 실제 DB 기반. 획득 뱃지 그리드 + 통계(Badges/Verified/Skills) + 카테고리별 스킬 레벨.",
    icon: "person",
    tags: ["DB", "SSR"],
  },
];

const apis = [
  {
    method: "GET",
    path: "/api/missions",
    desc: "미션 목록 + 완료 여부",
  },
  {
    method: "POST",
    path: "/api/missions/[id]/complete",
    desc: "미션 완료 → 뱃지 발급 + 블록체인 기록",
  },
  {
    method: "GET",
    path: "/api/badges",
    desc: "등록된 뱃지 전체 목록",
  },
  {
    method: "POST",
    path: "/api/badges",
    desc: "새 뱃지 등록 (이름, 카테고리, 설명, 인증처, 인증조건)",
  },
  {
    method: "DELETE",
    path: "/api/badges/[id]",
    desc: "뱃지 삭제",
  },
  {
    method: "GET",
    path: "/api/earned-badges",
    desc: "획득 뱃지 목록",
  },
  {
    method: "GET",
    path: "/api/earned-badges/[id]",
    desc: "단일 뱃지 상세 (공유용)",
  },
  {
    method: "GET",
    path: "/api/verify/[id]",
    desc: "뱃지 블록체인 검증 (on-chain 해시 비교)",
  },
];

const methodColor: Record<string, string> = {
  GET: "bg-[var(--color-success)] text-[var(--color-success-foreground)]",
  POST: "bg-[var(--color-warning)] text-[var(--color-warning-foreground)]",
  DELETE: "bg-red-100 text-red-700",
};

function PageCard({
  page,
}: {
  page: {
    href: string;
    title: string;
    description: string;
    icon: string;
    highlight?: boolean;
    tags?: string[];
  };
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
          <div className="flex items-center gap-2 mt-2">
            <code className="text-[12px] text-[var(--muted-foreground)] font-primary">
              {page.href}
            </code>
            {page.tags?.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-primary font-bold px-1.5 py-0.5 rounded bg-[var(--muted)] text-[var(--muted-foreground)]"
              >
                {tag}
              </span>
            ))}
          </div>
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
            디지털 뱃지를 생성, 발급, 관리하는 블록체인 하이브리드 플랫폼
            프로토타입입니다. 아래 링크에서 각 페이지를 확인해 보세요.
          </p>
          <div className="flex gap-2 mt-4">
            {["Next.js 16", "TypeScript", "SQLite", "Solidity", "Hardhat", "ethers.js"].map(
              (tech) => (
                <span
                  key={tech}
                  className="text-[11px] font-primary font-bold px-2 py-1 rounded-[999px] bg-[var(--muted)] text-[var(--muted-foreground)]"
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[900px] mx-auto px-8 py-8">
        {/* Prototype Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-icons text-[var(--primary)]">bolt</span>
            <h2 className="text-[18px] font-primary font-bold">
              Prototype (백엔드 + 블록체인 연동)
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

        {/* Architecture */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-icons text-[var(--muted-foreground)]">
              architecture
            </span>
            <h2 className="text-[18px] font-primary font-bold">
              Blockchain Hybrid Architecture
            </h2>
          </div>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-[16px] p-6">
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { label: "뱃지 등록", icon: "add_circle", color: "var(--primary)" },
                { label: "미션 완료", icon: "check_circle", color: "var(--color-success-foreground)" },
                { label: "keccak256 해시", icon: "tag", color: "var(--muted-foreground)" },
                { label: "블록체인 기록", icon: "link", color: "var(--primary)" },
                { label: "DB 저장", icon: "storage", color: "var(--muted-foreground)" },
                { label: "공유 페이지", icon: "share", color: "var(--color-success-foreground)" },
                { label: "On-chain 검증", icon: "verified", color: "var(--color-success-foreground)" },
              ].map((step, i) => (
                <div key={step.label} className="flex items-center gap-2">
                  {i > 0 && (
                    <span className="material-icons text-[14px] text-[var(--border)]">
                      arrow_forward
                    </span>
                  )}
                  <div className="flex items-center gap-1.5 bg-[var(--muted)] rounded-[999px] px-3 py-1.5">
                    <span
                      className="material-icons text-[16px]"
                      style={{ color: step.color }}
                    >
                      {step.icon}
                    </span>
                    <span className="text-[12px] font-secondary font-medium text-[var(--foreground)]">
                      {step.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[13px] text-[var(--muted-foreground)] font-secondary mt-4">
              뱃지 데이터는 SQLite에 저장되고, 발급 시 데이터 해시가 Solidity
              스마트 컨트랙트(BadgeRegistry)에 기록됩니다. 공유 페이지에서 DB
              데이터의 해시를 온체인 기록과 비교하여 위변조 여부를 검증합니다.
            </p>
          </div>
        </section>

        {/* API Section */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-icons text-[var(--muted-foreground)]">
              api
            </span>
            <h2 className="text-[18px] font-primary font-bold">
              API Endpoints ({apis.length})
            </h2>
          </div>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-[16px] overflow-hidden">
            {apis.map((api, i) => (
              <div
                key={`${api.method}-${api.path}`}
                className={`flex items-center gap-4 px-5 py-3 ${
                  i > 0 ? "border-t border-[var(--border)]" : ""
                }`}
              >
                <span
                  className={`text-[11px] font-primary font-bold px-2 py-0.5 rounded min-w-[52px] text-center ${
                    methodColor[api.method]
                  }`}
                >
                  {api.method}
                </span>
                <code className="text-[13px] font-primary text-[var(--foreground)] min-w-[240px]">
                  {api.path}
                </code>
                <span className="text-[13px] text-[var(--muted-foreground)] font-secondary">
                  {api.desc}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* How to Run */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-icons text-[var(--muted-foreground)]">
              terminal
            </span>
            <h2 className="text-[18px] font-primary font-bold">
              How to Run
            </h2>
          </div>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-[16px] p-5 space-y-3">
            {[
              { step: "1", cmd: "npm run chain", desc: "Hardhat 로컬 블록체인 시작 (터미널 1)" },
              { step: "2", cmd: "npm run deploy", desc: "스마트 컨트랙트 배포 — 로컬 (터미널 2)" },
              { step: "3", cmd: "npm run dev", desc: "Next.js 개발 서버 시작 (터미널 2)" },
              { step: "★", cmd: "npm run deploy:sepolia", desc: "Sepolia 테스트넷 배포 (.env.local 설정 필요)" },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-4">
                <span className="w-[28px] h-[28px] rounded-full bg-[var(--primary)] text-white text-[13px] font-primary font-bold flex items-center justify-center shrink-0">
                  {item.step}
                </span>
                <code className="text-[13px] font-primary text-[var(--foreground)] bg-[var(--muted)] px-3 py-1 rounded min-w-[180px]">
                  {item.cmd}
                </code>
                <span className="text-[13px] text-[var(--muted-foreground)] font-secondary">
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
