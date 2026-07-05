export type Summary12MonthsType = {
  month: string
  total: number
  currency: string
}

export interface Proc12MoSummary {
  [currency: string]: string | number
  month: string
}

export type SummaryMonthlyCategory = {
  category_name: string
  amount: number
  currency: string
}

export type SummaryMonthlySource = {
  source_name: string
  amount: number
  currency: string
}