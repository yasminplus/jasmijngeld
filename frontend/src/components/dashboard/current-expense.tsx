import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGlobalDataContext } from '@/context/globaldata';
import type { MonthYear } from "@/services/expenses";
import type { Proc12MoSummary } from "@/types/ExpenseSummaryType";

interface Props {
  passedData: Proc12MoSummary
  currency: string
  distinctMonths: MonthYear[]
  selectedMonth: MonthYear
  setSelectedMonth: (mo: MonthYear) => void
}

export default function CurrentExpense({ 
  passedData, currency, distinctMonths, selectedMonth, setSelectedMonth 
}: Props) {
  const globalDataContext = useGlobalDataContext()

  function onSelectValueChange(value: string) {
    const obj = distinctMonths.find(mo => mo.dateStr === value)
    setSelectedMonth(obj!)
  }
  // TODO: sometimes selectedMonth doesn't appear. debug if it still happens 

  return (
    <div className="mb-4">
      {
        globalDataContext.enabledCurrencies.map(cur => {
          return ( currency === cur && (
            <Card key={cur}>
              <CardContent>
                <div className="flex flex-row space-x-2 justify-between flex-wrap">

                  <div className="font-semibold self-end flex flex-row gap-2">
                    <div className="self-center">Total expense in</div>
                    <div>
                      <Select
                        defaultValue={selectedMonth?.dateStr} 
                        onValueChange={onSelectValueChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          {distinctMonths.map( item => 
                            <SelectItem key={item?.label} value={item?.dateStr}>
                              {item?.label}
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="">
                    <span className="text-sm">
                      {cur}
                    </span>
                    &nbsp;
                    {/* TODO: BUG: total doesn't change when month is changed! */}
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