import axiosInstance from "@/services/axios";
import { z } from "zod"


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
