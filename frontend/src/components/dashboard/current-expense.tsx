import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { useGlobalDataContext } from '@/context/globaldata';
import type { MonthYear } from "@/services/expenses";
import type { Proc12MoSummary } from "@/types/ExpenseSummaryType";

interface Props {
  passedData: Proc12MoSummary
  currency: string
  distinctMonths: MonthYear[]
}

export default function CurrentExpense({ passedData, currency, distinctMonths }: Props) {
  const globalDataContext = useGlobalDataContext()

  return (
    <div className="mb-4">
      {
        globalDataContext.enabledCurrencies.map(cur => {
          return ( currency === cur && (
            <Card key={cur}>
              <CardContent>
                <div className="flex flex-row space-x-2 justify-between">
                  <div className="font-semibold self-end">
                    Total expense this month
                  </div>
                  <div className="">
                    <span className="text-sm">
                      {cur}
                    </span>
                    &nbsp;
                    <span className="text-2xl font-semibold">
                      {passedData && cur in passedData? Number(passedData[cur]).toLocaleString() : 0}
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