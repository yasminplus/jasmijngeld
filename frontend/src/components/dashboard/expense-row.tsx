import { getExpenseCategories, type Expense, type ExpenseCategory } from "@/services/expenses";
import { groupDigit } from "@/services/generic-utils";
import { PlusCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface Props {
  expense: Expense
}
export default function ExpenseRow({ expense }: Props) {
  const [categories, setCategories] = useState<ExpenseCategory[]>([])

  const fetchStaticData = useCallback(() => {
    getExpenseCategories()
    .then(res => {
      setCategories(res)
    })
    .catch(err => {
      throw err
    })
  }, [])

  useEffect(() => {
    fetchStaticData()
  }, [fetchStaticData])

  return (
    <div className="flex flex-row gap-2 text-sm my-2">
      <div className="basis-1/10">
        {/* TODO: change to respective icon */}
        <PlusCircle className="size-10"/>
      </div>
      <div className="flex flex-col basis-7/10">
        <div className="font-medium">
          {expense.description}
        </div>
        <div className="text-muted-foreground">
          {expense.date}
        </div>
      </div>
      <div className="basis-2/10 text-sm font-semibold text-right">
        <span className="text-xs">
          {expense.currency} 
        </span>
        &nbsp;
        <span className="text-lg">
          {groupDigit(expense.amount)}
        </span>
      </div>
    </div>
  )
}