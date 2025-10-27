import { type Expense, type ExpenseCategory } from "@/services/expenses";
import { groupDigit } from "@/services/generic-utils";

interface Props {
  expense: Expense,
  categories: ExpenseCategory[]
}

export default function ExpenseRow({ expense, categories }: Props) {
  const IconObj = getIcon(expense.category)
  const catColor = getColor(expense.category)

  function getIcon(category: string) {
    const catObj = categories.find(cat => cat.name == category)
    return catObj?.iconObj
  }

  function getColor(category: string) {
    const catObj = categories.find(cat => cat.name == category)
    const color = `hsl(${catObj?.hue} 100% 55%)`
    return color
  }

  return (
    <div className="flex flex-row gap-2 text-sm my-2">
      <div className="basis-1/10">
        <div style={{
            borderRadius: '50%', width: '43px', height: '43px', 
            backgroundColor: catColor,
            paddingLeft: '7.3px', 
            paddingTop: '7.3px', 
          }}
        >
          {IconObj ? <IconObj className="size-7" /> : null}
        </div>
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