import CategoryIcon  from "@/components/category-icon"
import { type Expense, type ExpenseCategory } from "@/services/expenses";
import { groupDigit } from "@/services/generic-utils";

interface Props {
  expense: Expense,
  categories: ExpenseCategory[]
}

export default function ExpenseRow({ expense, categories }: Props) {

  return (
    <div className="flex flex-row gap-2 text-sm my-2">
      <div className="basis-1/10">
        <CategoryIcon category={expense.category} categories={categories} />
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