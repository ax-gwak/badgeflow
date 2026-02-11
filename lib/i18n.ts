export type Locale = "ko" | "en";

const translations: Record<Locale, Record<string, string>> = {
  ko: {
    // Nav
    "nav.dashboard": "대시보드",
    "nav.badges": "뱃지 관리",
    "nav.issuance": "미션 발급",
    "nav.analytics": "분석",
    "nav.settings": "설정",
    "nav.users": "유저 관리",
    "nav.profile": "프로필",
    "nav.missions": "미션",
    "nav.signIn": "로그인",
    "nav.signOut": "로그아웃",

    // Dashboard
    "dashboard.title": "대시보드",
    "dashboard.subtitle": "뱃지 플랫폼 활동 요약",
    "dashboard.totalIssued": "총 발급",
    "dashboard.claimRate": "수령률",
    "dashboard.activeBadges": "활성 뱃지",
    "dashboard.users": "유저 수",
    "dashboard.recentIssuances": "최근 발급",
    "dashboard.viewAll": "전체보기",
    "dashboard.newBadge": "+ 새 뱃지",
    "dashboard.noBadges": "아직 발급된 뱃지가 없습니다.",

    // Badges
    "badges.title": "뱃지 관리",
    "badges.subtitle": "디지털 뱃지를 생성하고 관리하세요",
    "badges.create": "+ 뱃지 생성",
    "badges.noBadges": "등록된 뱃지가 없습니다",
    "badges.noResults": "검색 결과가 없습니다",
    "badges.total": "총 {count}개 뱃지",
    "badges.search": "검색...",
    "badges.allBadges": "전체",

    // Analytics
    "analytics.title": "분석",
    "analytics.subtitle": "플랫폼 통계 및 뱃지 발급 추이",
    "analytics.totalBadges": "총 뱃지",
    "analytics.onChainRate": "온체인 비율",
    "analytics.totalUsers": "총 유저",
    "analytics.totalMissions": "총 미션",
    "analytics.byCategory": "카테고리별 뱃지",
    "analytics.dailyIssuances": "일일 발급 (14일)",
    "analytics.topMissions": "인기 미션",

    // Settings
    "settings.title": "설정",
    "settings.subtitle": "계정 및 환경설정 관리",
    "settings.profile": "프로필",
    "settings.changePassword": "비밀번호 변경",
    "settings.name": "이름",
    "settings.email": "이메일",
    "settings.role": "역할",
    "settings.save": "저장",
    "settings.currentPassword": "현재 비밀번호",
    "settings.newPassword": "새 비밀번호",
    "settings.confirmPassword": "새 비밀번호 확인",
    "settings.change": "변경",

    // Users
    "users.title": "유저 관리",
    "users.subtitle": "플랫폼 유저와 역할을 관리합니다",
    "users.total": "전체 {count}명",

    // Common
    "common.loading": "로딩 중...",
    "common.badge": "뱃지",
    "common.category": "카테고리",
    "common.issuer": "발급자",
    "common.created": "생성일",
    "common.actions": "작업",
    "common.mission": "미션",
    "common.completions": "완료 수",
    "common.verified": "검증됨",
    "common.delete": "삭제",
  },
  en: {
    "nav.dashboard": "Dashboard",
    "nav.badges": "Badge Management",
    "nav.issuance": "Issuance",
    "nav.analytics": "Analytics",
    "nav.settings": "Settings",
    "nav.users": "User Management",
    "nav.profile": "Profile",
    "nav.missions": "Missions",
    "nav.signIn": "Sign In",
    "nav.signOut": "Sign Out",

    "dashboard.title": "Dashboard",
    "dashboard.subtitle": "Overview of your badge platform activity",
    "dashboard.totalIssued": "Total Issued",
    "dashboard.claimRate": "Claim Rate",
    "dashboard.activeBadges": "Active Badges",
    "dashboard.users": "Users",
    "dashboard.recentIssuances": "Recent Issuances",
    "dashboard.viewAll": "View All",
    "dashboard.newBadge": "+ New Badge",
    "dashboard.noBadges": "No badges issued yet.",

    "badges.title": "Badge Management",
    "badges.subtitle": "Create and manage your digital badges",
    "badges.create": "+ Create Badge",
    "badges.noBadges": "No badges registered",
    "badges.noResults": "No results found",
    "badges.total": "{count} badges total",
    "badges.search": "Search...",
    "badges.allBadges": "All Badges",

    "analytics.title": "Analytics",
    "analytics.subtitle": "Platform statistics and badge issuance trends",
    "analytics.totalBadges": "Total Badges",
    "analytics.onChainRate": "On-Chain Rate",
    "analytics.totalUsers": "Total Users",
    "analytics.totalMissions": "Total Missions",
    "analytics.byCategory": "Badges by Category",
    "analytics.dailyIssuances": "Daily Issuances (14 days)",
    "analytics.topMissions": "Top Missions",

    "settings.title": "Settings",
    "settings.subtitle": "Manage your account and preferences",
    "settings.profile": "Profile",
    "settings.changePassword": "Change Password",
    "settings.name": "Name",
    "settings.email": "Email",
    "settings.role": "Role",
    "settings.save": "Save Changes",
    "settings.currentPassword": "Current Password",
    "settings.newPassword": "New Password",
    "settings.confirmPassword": "Confirm New Password",
    "settings.change": "Change Password",

    "users.title": "User Management",
    "users.subtitle": "Manage platform users and their roles",
    "users.total": "Total {count} users",

    "common.loading": "Loading...",
    "common.badge": "Badge",
    "common.category": "Category",
    "common.issuer": "Issuer",
    "common.created": "Created",
    "common.actions": "Actions",
    "common.mission": "Mission",
    "common.completions": "Completions",
    "common.verified": "Verified",
    "common.delete": "Delete",
  },
};

export function t(key: string, locale: Locale, vars?: Record<string, string | number>): string {
  let text = translations[locale]?.[key] || translations.en[key] || key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}

export const LOCALES: { key: Locale; label: string }[] = [
  { key: "ko", label: "한국어" },
  { key: "en", label: "English" },
];
