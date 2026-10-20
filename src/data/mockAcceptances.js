/* ============================================================================
   BACKEND NEEDED — FE-only mock, replace with real API (wrapped section START)
   ----------------------------------------------------------------------------
   Admin view of users' job applications. PAST 7 DAYS ONLY — the backend must
   filter by date; older entries never reach this list.
   List-view fields only: job title, tags, payment. Never the full job detail.
   - GET /api/admin/acceptances?window=7d -> replaces MOCK_ACCEPTANCES
   ============================================================================ */
export const MOCK_ACCEPTANCES = [
  { id: "acc-1", user: "Rio", handle: "@rio", jobTitle: "Need a landing page designer for SaaS launch", tags: ["Figma", "Landing Page"], budget: 250, currency: "USD", budgetType: "Fixed", appliedAt: "2h ago" },
  { id: "acc-2", user: "Sasa", handle: "@sasa", jobTitle: "Logo + brand mini-kit for coffee shop", tags: ["Logo", "Branding", "Poster"], budget: 1920000, currency: "IDR", budgetType: "Fixed", appliedAt: "5h ago" },
  { id: "acc-3", user: "Lutga", handle: "@lutga", jobTitle: "Mobile app UI help — 5 screens cleanup", tags: ["Mobile UI", "Design System"], budget: 600, currency: "USD", budgetType: "Fixed", appliedAt: "9h ago" },
  { id: "acc-4", user: "Maya", handle: "@maya", jobTitle: "Logo + brand mini-kit for coffee shop", tags: ["Logo", "Branding"], budget: 1920000, currency: "IDR", budgetType: "Fixed", appliedAt: "1d ago" },
  { id: "acc-5", user: "Rio", handle: "@rio", jobTitle: "Looking for illustrator for onboarding screens", tags: ["Illustration", "Flat Design"], budget: 1280000, currency: "IDR", budgetType: "Hourly", appliedAt: "1d ago" },
  { id: "acc-6", user: "Mika", handle: "@mika", jobTitle: "Need a landing page designer for SaaS launch", tags: ["Figma", "Responsive"], budget: 250, currency: "USD", budgetType: "Fixed", appliedAt: "2d ago" },
  { id: "acc-7", user: "Danar", handle: "@danar", jobTitle: "Mobile app UI help — 5 screens cleanup", tags: ["Mobile UI", "Figma"], budget: 600, currency: "USD", budgetType: "Fixed", appliedAt: "3d ago" },
  { id: "acc-8", user: "Sasa", handle: "@sasa", jobTitle: "Need a landing page designer for SaaS launch", tags: ["Landing Page"], budget: 250, currency: "USD", budgetType: "Fixed", appliedAt: "4d ago" },
  { id: "acc-9", user: "Maya", handle: "@maya", jobTitle: "Looking for illustrator for onboarding screens", tags: ["Illustration"], budget: 1280000, currency: "IDR", budgetType: "Hourly", appliedAt: "5d ago" },
  { id: "acc-10", user: "Lutga", handle: "@lutga", jobTitle: "Logo + brand mini-kit for coffee shop", tags: ["Poster", "Branding"], budget: 1920000, currency: "IDR", budgetType: "Fixed", appliedAt: "6d ago" },
]
