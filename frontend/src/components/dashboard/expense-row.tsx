import CategoryIcon  from "@/components/category-icon"
import { type Expense } from "@/services/expenses";
import { groupDigit } from "@/services/generic-utils";

interface Props {
  expense: Expense,
  actions?: React.ReactNode,
}

export default function ExpenseRow({ expense, actions }: Props) {

  return (
    <div className="flex items-center gap-[11px] py-[11px] px-1 border-b text-sm">
      {/* Icon */}
      <div className="flex-none">
        <CategoryIcon
          category={expense.category}
          iconSize="size-4"
          circleDia="34px"
        />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="font-medium truncate">
          {expense.description}
        </div>
        {/* Date, source */}
        <div className="text-faint flex flex-row gap-1 font-mono text-[10.5px] mt-[2px]">
          <span>{expense.date}</span>
          {expense.source && (
            <>
              <span>·</span>
              <span>{expense.source}</span>
            </>
          )}
        </div>
      </div>
      {/* Amount */}
      <div className="flex-none flex flex-col items-end font-mono text-[12.5px] gap-[3px]">
        <span>
          {expense.currency}&nbsp;{groupDigit(expense.amount)}
        </span>
        {actions}
      </div>
    </div>
  )
}