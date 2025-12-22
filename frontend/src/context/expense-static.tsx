import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
// import { base_key } from "@/context/auth"
import { type ExpenseCategory } from "@/services/expenses";
import { getExpenseCategories } from '@/services/expenses'

type ExpenseStaticProviderState = {
  categories: ExpenseCategory[]
  // setFirstName: (fname: string | null) => void
}

const initialState: ExpenseStaticProviderState = {
  categories: [],
  // setFirstName: () => null
}

const ExpenseStaticProviderContext = createContext<ExpenseStaticProviderState>(initialState)

// const CATEGORIES_KEY = base_key + ".categories";

// async function getCategories() {
//   let cats = localStorage.getItem(CATEGORIES_KEY)
//   if (!cats) {
//     cats = await getExpenseCategories()
//   }
//   return cats
//   // return localStorage.getItem(CATEGORIES_KEY) ?? "";
// }

export function ExpenseStaticProvider({
  children
}: {children: ReactNode}) {
  const [categories, setCategoriesState] = useState<ExpenseCategory[]>([])
  
  // const setCategories = useCallback((name: string | null) => {
  //   if (name == null || name === "") {
  //     localStorage.removeItem(CATEGORIES_KEY);
  //     setCategoriesState("");
  //   } else {
  //     localStorage.setItem(CATEGORIES_KEY, name);
  //     setCategoriesState(name);
  //   }
  //   // note: same-tab listener using the CustomEvent does not work.
  //   // instead call this function directly after editing profile.
  // }, []);

  const fetchCategoriesCallback = useCallback(async () => {
    const cats = await getExpenseCategories();
    console.log("in fetchCategoriesCallback")
    setCategoriesState(cats);
  }, [setCategoriesState])

  useEffect(() => {
    // const fetchCategories = async () => {
    //   const cats = await getExpenseCategories();
    //   setCategoriesState(cats);
    // };
    // fetchCategories();
    fetchCategoriesCallback()
  }, [fetchCategoriesCallback]);

  const value = { categories };

  return (
    <ExpenseStaticProviderContext.Provider value={value}>
      {children}
    </ExpenseStaticProviderContext.Provider>
  )
}

export function useExpenseStatic() {
  const context = useContext(ExpenseStaticProviderContext)

  if (!context) {
    throw new Error('useExpenseStatic must be used within a ExpenseStaticProviderContext');
  }

  return context
}