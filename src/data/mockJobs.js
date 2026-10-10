export const JOB_CATEGORIES = [
  "All",
  "UI Design",
  "UX Research",
  "Branding",
  "Illustration",
  "Motion",
  "Web Design",
  "Other",
]

export const BUDGET_FILTERS = [
  { id: "all", label: "Any budget" },
  { id: "under100", label: "Under $100" },
  { id: "100-500", label: "$100 – $500" },
  { id: "500plus", label: "$500+" },
]

export const MOCK_JOBS = [
  {
    id: "job-1",
    title: "Need a landing page designer for SaaS launch",
    description:
      "We are launching a small SaaS product and need a landing page design in Figma. 3-4 sections, clean style, mobile responsive mockup. Reference links will be provided.",
    budget: 250,
    budgetType: "Fixed",
    category: "Web Design",
    skills: ["Figma", "Landing Page", "Responsive"],
    author: "Nadia",
    handle: "@nadia_builds",
    postedAt: "2h ago",
    proposals: 4,
    saved: false,
    comments: [
      { id: "c1", author: "Rio", text: "Is the copy already ready, or do you need help with that too?" },
      { id: "c2", author: "Nadia", text: "Copy draft is ready, mostly need visual design." },
    ],
  },
  {
    id: "job-2",
    title: "Logo + brand mini-kit for coffee shop",
    description:
      "Local coffee shop needs a logo, color palette, and 2 poster templates. Friendly / warm style. Deliverables in Figma + PNG export.",
    budget: 120,
    budgetType: "Fixed",
    category: "Branding",
    skills: ["Logo", "Branding", "Poster"],
    author: "Kopi Kita",
    handle: "@kopikita",
    postedAt: "5h ago",
    proposals: 9,
    saved: false,
    comments: [
      { id: "c1", author: "Sasa", text: "Do you already have a name / tagline locked in?" },
    ],
  },
  {
    id: "job-3",
    title: "Mobile app UI help — 5 screens cleanup",
    description:
      "We have wireframes for a habit tracker app. Need someone to turn them into clean UI, set up a simple design system (buttons, inputs, cards).",
    budget: 600,
    budgetType: "Fixed",
    category: "UI Design",
    skills: ["Mobile UI", "Design System", "Figma"],
    author: "Danar",
    handle: "@danar",
    postedAt: "1d ago",
    proposals: 6,
    saved: false,
    comments: [],
  },
  {
    id: "job-4",
    title: "Looking for illustrator for onboarding screens",
    description:
      "Need 3 custom illustrations for app onboarding. Flat style, friendly colors. Open to your style, portfolio required.",
    budget: 80,
    budgetType: "Hourly",
    category: "Illustration",
    skills: ["Illustration", "Onboarding", "Flat Design"],
    author: "Lutga",
    handle: "@lutga",
    postedAt: "2d ago",
    proposals: 12,
    saved: false,
    comments: [],
  },
]
