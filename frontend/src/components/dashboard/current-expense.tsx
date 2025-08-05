import {
  Card,
  CardContent,
} from "@/components/ui/card"
import type { Proc12MoSummary } from "@/types/ExpenseSummaryType";
import { CURRENCY_CHOICES } from "@/services/expenses";

interface Props {
  passedData: Proc12MoSummary
  currency: string
}

export default function CurrentExpense({ passedData, currency }: Props) {

  return (
    <div className="pb-4">
      {
        CURRENCY_CHOICES.map(cur => {
          return ( currency === cur && (
            <Card className="w-96 bg-secondary" key={cur}>
              <CardContent>
                <div className="flex flex-row space-x-2 justify-between">
                  <div className="font-semibold self-end">
                    Expense this month
                  </div>
                  <div className="">
                    <span className="text-sm">
                      {cur}
                    </span>
                    &nbsp;
                    <span className="text-2xl font-semibold">
                      {Number(passedData[cur]).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        })
      }
    </div>
  )

}