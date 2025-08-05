import { addMonths, format, parse } from 'date-fns';
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

export const CURRENCY_CHOICES = [
  'IDR', 'EUR', 'USD'
]

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
      return res.results;
    })
    .catch(error => {
      console.error(error)
      throw error;
    })
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

export function getSummary12Months(): Promise<Proc12MoSummary[]> {
  return axiosInstance.get(`/api/expenses/last12months/`)
    .then(response => {
      const res = processSummary12Months(response['data'])
      return res
    })
    .catch(error => {
      console.error(error)
      throw error;
    })
}

function processSummary12Months(data: Summary12MonthsType[]) {
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
      month: '',
      IDR: 0,
      EUR: 0,
      USD: 0
    }
    filtered.forEach((el) => {
      const currency = el['currency']
      if (currency === 'IDR' || currency === 'EUR' || currency === 'USD') {
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