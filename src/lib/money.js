/**
 * Money helpers shared by the Hire page and the admin tables.
 *
 * Extracted from the old community mock so every surface formats and
 * filters budgets the same way.
 */

export const USD_TO_IDR_RATE = 16000

export const CURRENCIES = [
  { id: "USD", label: "USD ($)" },
  { id: "IDR", label: "IDR (Rp)" },
]

export const BUDGET_FILTERS = [
  { id: "all", label: "Any budget" },
  { id: "under100", label: "Under $100" },
  { id: "100-500", label: "$100 – $500" },
  { id: "500plus", label: "$500+" },
]

export function formatBudget(price, currency = "USD") {
  if (currency === "IDR") {
    return `Rp${new Intl.NumberFormat("id-ID").format(Math.round(price))}`
  }
  return `$${new Intl.NumberFormat("en-US").format(price)}`
}

// Normalize any price to USD so the budget-range filter works across currencies.
export function toUsd(price, currency = "USD") {
  if (currency === "IDR") return price / USD_TO_IDR_RATE
  return price
}

export function getBudgetFilters(currency = "USD") {
  if (currency === "IDR") {
    const fmt = (usd) => `Rp${new Intl.NumberFormat("id-ID").format(usd * USD_TO_IDR_RATE)}`
    return [
      { id: "all", label: "Any budget" },
      { id: "under100", label: `Under ${fmt(100)}` },
      { id: "100-500", label: `${fmt(100)} – ${fmt(500)}` },
      { id: "500plus", label: `${fmt(500)}+` },
    ]
  }
  return BUDGET_FILTERS
}
