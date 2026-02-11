export const dashboardMetrics = [
  { title: "Total Issued", value: "12,847", change: "+12.5%", icon: "badge" },
  { title: "Claim Rate", value: "73.2%", change: "+3.1%", icon: "trending_up" },
  { title: "Active Badges", value: "156", change: "+8", icon: "verified" },
  { title: "Shared", value: "3,421", change: "+18.2%", icon: "share" },
];

export const recentIssuances = [
  { badge: "Reading Master Lv.3", recipient: "Kim MinJi", email: "minji@example.com", status: "claimed" as const, date: "2026-02-05" },
  { badge: "Math Champion Gold", recipient: "Lee SeoJun", email: "seojun@example.com", status: "claimed" as const, date: "2026-02-04" },
  { badge: "Science Explorer", recipient: "Park YuNa", email: "yuna@example.com", status: "pending" as const, date: "2026-02-04" },
  { badge: "Book Worm Challenge", recipient: "Choi DaEun", email: "daeun@example.com", status: "claimed" as const, date: "2026-02-03" },
];

export const badgeList = [
  { name: "Reading Master Lv.3", category: "Learning", issued: 1240, claimRate: "89%", status: "active" as const },
  { name: "Math Champion Gold", category: "Assessment", issued: 856, claimRate: "72%", status: "active" as const },
  { name: "Science Explorer", category: "Learning", issued: 420, claimRate: "65%", status: "active" as const },
  { name: "Book Worm Challenge", category: "Reading", issued: 2100, claimRate: "91%", status: "pending" as const },
  { name: "Creative Writing", category: "Learning", issued: 180, claimRate: "\u2014", status: "draft" as const },
];

export const profileBadges = [
  { name: "Reading Master Lv.3", category: "Learning", color: "#E8F5E9" },
  { name: "Math Champion Gold", category: "Assessment", color: "#FFF3E0" },
  { name: "Science Explorer", category: "Learning", color: "#E3F2FD" },
  { name: "Book Worm Challenge", category: "Reading", color: "#FCE4EC" },
  { name: "Creative Writing", category: "Learning", color: "#F3E5F5" },
  { name: "Coding Basics", category: "STEM", color: "#E0F2F1" },
];

export const profileSkills = [
  { name: "Reading", level: "Advanced" as const },
  { name: "Mathematics", level: "Intermediate" as const },
  { name: "Science", level: "Intermediate" as const },
  { name: "Critical Thinking", level: "Beginner" as const },
  { name: "Writing", level: "Beginner" as const },
];
