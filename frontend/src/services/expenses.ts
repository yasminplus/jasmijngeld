import axiosInstance from "@/services/axios";
import { z } from "zod"
import { PaymentSource } from "./accounts-cards";


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
  date: Date;
  description: string;
  store: Store;
  category: ExpenseCategory;
  source: PaymentSource;
}

export interface Expense extends ExpenseFormType {
  id: number;
}

export const CURRENCY_CHOICES = [
  'IDR', 'EUR', 'USD'
]

// TODO: do we use zod or the interfaces?
// export const expenseSchema = z.object({
//   amount: z.number(),
//   currency: z.enum(['IDR', 'EUR', 'USD']),
//   date: z.date(),
//   description: z.string().optional().or(z.literal('')),
// })

export function getStoreList(): Promise<Store[]> {
  return axiosInstance.get(`/api/expenses/stores`)
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
  return axiosInstance.get(`/api/expenses/categories`)
    .then(response => {
      const res = response['data']
      return res.results;
    })
    .catch(error => {
      console.error(error)
      throw error;
    })
}

export function getExpenseList(): Promise<Expense[]> {
  return axiosInstance.get(`/api/expenses`)
    .then(response => {
      const res = response['data']
      return res.results;
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
