import axios from "axios"
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

export interface ExpenseForm {
  amount: number;
  currency: 'IDR' | 'EUR' | 'USD';
  date: Date;
  description: string;
  store: Store;
  category: ExpenseCategory;
  source: PaymentSource;
}

export interface Expense extends ExpenseForm {
  id: number;
}

// TODO: do we use zod or the interfaces?
// export const expenseSchema = z.object({
//   amount: z.number(),
//   currency: z.enum(['IDR', 'EUR', 'USD']),
//   date: z.date(),
//   description: z.string().optional().or(z.literal('')),
// })

const BE_BASE_URL = 'http://localhost:8007'

export function getStoreList(): Promise<Store[]> {
  return axios.get(`${BE_BASE_URL}/api/expenses/stores`)
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
  return axios.get(`${BE_BASE_URL}/api/expenses/categories`)
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
  return axios.get(`${BE_BASE_URL}/api/expenses`)
    .then(response => {
      const res = response['data']
      return res.results;
    })
    .catch(error => {
      console.error(error)
      throw error;
    })
}

