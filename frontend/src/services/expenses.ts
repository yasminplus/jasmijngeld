import { addMonths, format, parse, parseISO } from 'date-fns';
import { 
  BanknoteArrowDown, 
  Bus, 
  CircleQuestionMark, 
  Drama, 
  Gift, 
  GraduationCap, 
  HeartPulse, 
  House, 
  Luggage, 
  MonitorSmartphone, 
  Repeat, 
  Shirt, 
  ShoppingBasket, 
  SoapDispenserDroplet, 
  Utensils, 
  WalletCards, 
  type LucideIcon 
} from 'lucide-react';
import { z } from 'zod';

import axiosInstance from '@/services/axios';
import {
  type Proc12MoSummary, 
  type Summary12MonthsType, 
  type SummaryMonthlyCategory,
  type SummaryMonthlySource
} from '@/types/ExpenseSummaryType';

export interface ExpenseCategory {
  id: number;
  name: string;
  icon: string;
  iconObj?: LucideIcon
  hue: number;
}

export interface Store {
  id: number;
  name: string;
}

export interface ExpenseFormType {
  amount: number;
  currency: 'IDR' | 'EUR' | 'USD';
  date: string;
  description?: string;
  category: string;
  store?: string;
  source?: string;
}

export interface MonthYear {
  label: string;
  dateStr: string;
}

export const expenseFormSchema = z.object({
  // amount: z.string().transform((val) => Number(val) || 0), 
  amount: z.preprocess((val) => {
    if (typeof val === "string") {
      return Number(val);
    }
    return val;
  }, z.number()), 
  currency: z.enum(['IDR', 'EUR', 'USD']).default("IDR"),
  date: z.date(),
  description: z.string().optional().or(z.literal('')),
  category: z.string(),
  store: z.string().optional().or(z.literal('')),
  source: z.string().optional().or(z.literal('')),
})


export interface Expense extends ExpenseFormType {
  id: number;
}

export function getStoreList(): Promise<Store[]> {
  return axiosInstance.get(`/api/expenses/stores/`)
    .then(response => {
      const res = response['data']
      return res.results;
    })
    .catch(error => {
      console.error(error)
      throw error;
    })
}

export function getExpenseCategories(): Promise<ExpenseCategory[]> {
  return axiosInstance.get(`/api/expenses/categories/`)
    .then(response => {
      const res = response['data']
      return expandCategoriesWithIcon(res.results);
    })
    .catch(error => {
      console.error(error)
      throw error;
    })
}

function expandCategoriesWithIcon(categories: ExpenseCategory[]) {
  const iconMap = {
    "banknote-arrow-down": BanknoteArrowDown,
    "bus": Bus,
    "circle-question-mark": CircleQuestionMark,
    "drama": Drama,
    "gift": Gift,
    "graduation-cap": GraduationCap,
    "heart-pulse": HeartPulse,
    "house": House,
    "luggage": Luggage,
    "monitor-smartphone": MonitorSmartphone,
    "repeat": Repeat,
    "shirt": Shirt,
    "shopping-basket": ShoppingBasket,
    "soap-dispenser-droplet": SoapDispenserDroplet,
    "utensils": Utensils,
    "wallet-cards": WalletCards
  }
  const res = categories.map(cat => ({
    ...cat,
    iconObj: iconMap[cat.icon as keyof typeof iconMap]
  }))
  return res
}

// for client-side pagination
export function getExpenseList(): Promise<{rows: Expense[], total: number}> {
  return axiosInstance.get(`/api/expenses/`)
    .then(response => {
      const res = response['data']
      return {
        rows: res.results,
        total: res.count
      }
    })
    .catch(error => {
      console.error(error)
      throw error;
    })
}

// for server-side pagination, currently not in use
export function getExpenseListPaginated(pagination: {
  pageIndex: number
  pageSize: number
}): Promise<{ rows: Expense[]; total: number; pageCount: number }> {
  return axiosInstance.get(`/api/expenses/?page=${pagination.pageIndex + 1}&page_size=${pagination.pageSize}`)
    .then(response => {
      const res = response['data']
      return {
        rows: res.results,
        total: res.count,
        pageCount: Math.ceil(res.count / pagination.pageSize)
      }
    })
    .catch(error => {
      console.error(error)
      throw error;
    })
}

export function createExpense(data: ExpenseFormType): Promise<Expense> {
  return axiosInstance.post(`/api/expenses/`, data)
    .then(response => {
      const res = response['data'];
      return res;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
}

export function getExpense(id:number): Promise<Expense> {
  return axiosInstance.get(`/api/expenses/${id}`)
    .then(response => {
      const res = response['data'];
      return res;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
}

export function updateExpense(id:number, data: ExpenseFormType): Promise<Expense> {
  return axiosInstance.put(`/api/expenses/${id}`, data)
    .then(response => {
      const res = response['data'];
      return res;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
}

export function deleteExpense(id:number): Promise<boolean> {
  return axiosInstance.delete(`/api/expenses/${id}`)
    .then(response => {
      if (response['status'] == 204) {
        return true;
      } else {
        return false;
      }
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
}

export function getSummary12Months(enabledCurrencies: string[]): Promise<Proc12MoSummary[]> {
  return axiosInstance.get(`/api/expenses/last12months/`)
    .then(response => {
      const res = processSummary12Months(response['data'], enabledCurrencies)
      return res
    })
    .catch(error => {
      console.error(error)
      throw error;
    })
}

function processSummary12Months(data: Summary12MonthsType[], enabledCurrencies: string[]) {
  if (data.length == 0) {
    return []
  }

  // collect all months
  const monthsSet = new Set(data.map(item => item.month))
  const allMonths = [...monthsSet]
  allMonths.sort()

  // get min max months
  const months = data.map(item => item.month)
  months.sort()
  const minMoStr = months[0]
  const maxMoStr = months[months.length - 1]
  const minMo = parse(minMoStr, 'yyyy-MM-dd', new Date())
  const maxMo = parse(maxMoStr, 'yyyy-MM-dd', new Date())

  const sortedMonths = []
  let mo = minMo
  while (mo.getTime() <= maxMo.getTime()) {
    sortedMonths.push(mo)
    mo = addMonths(mo, 1)
  }

  const res: Proc12MoSummary[] = []
  // for each item in sortedMonths, convert the date to string, 
  // get the value from the array
  for (const dt of sortedMonths) {
    const dtStr = format(dt, 'yyyy-MM-dd')
    const filtered = data.filter(v => v.month === dtStr)
    const entry: Proc12MoSummary = {
      month: ''
    }
    for (const currency of enabledCurrencies) {
      entry[currency] = 0
    }
    filtered.forEach((el) => {
      const currency = el['currency']
      if (enabledCurrencies.includes(currency)) {
        entry[currency] = Number(el['total'])
      }
      entry['month'] = format(dt, 'MMM yyyy')
    })
    res.push(entry)
  }
  return res
}

export function getMonthlyCategorySummary(): Promise<SummaryMonthlyCategory[]> {
  const dateStr = format(new Date(), 'yyyy-MM-dd')
  return axiosInstance.get(`/api/expenses/monthly-cat/?date=${dateStr}`, )
    .then(response => {
      return response['data']
    })
    .catch(error => {
      console.error(error)
      throw error;
    })
}

export function getMonthlySourceSummary(): Promise<SummaryMonthlySource[]> {
  const dateStr = format(new Date(), 'yyyy-MM-dd')
  return axiosInstance.get(`/api/expenses/monthly-src/?date=${dateStr}`, )
    .then(response => {
      return response['data']
    })
    .catch(error => {
      console.error(error)
      throw error;
    })
}

/**
 * get distinct month-year to change the month-year in the dashboard
 * @returns promise list of monthyear type
 */
export function getDistinctMonths(): Promise<MonthYear[]> {
  return axiosInstance.get(`api/expenses/dist-mo/`)
    .then(response => {
      const monthList = response['data']
      // reverse so we get the most recent on top
      monthList.reverse()
      const res = monthList.map((dtObj) => {
        const dt = parseISO(dtObj.month)
        return {
          label: format(dt, 'MMM yyyy'),
          dateStr: dtObj.month
        }
      })
      return res
    })
    .catch(error => {
      console.error(error)
      throw error;
    })
}