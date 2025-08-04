import type { Proc12MoSummary } from "@/types/ExpenseSummaryType";
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { CURRENCY_CHOICES } from "@/services/expenses";
import { useState } from "react";
import CurrencyRadioGroup from "../currency-radio-group";

interface Props {
  passedData: Proc12MoSummary
}

export default function CurrentExpense({ passedData }: Props) {
  const [selectedCurrency, setSelectedCurrency] = useState('IDR')

  return (
    <div className="pb-4">
      <CurrencyRadioGroup currency={selectedCurrency} setCurrency={setSelectedCurrency} />

      {
        CURRENCY_CHOICES.map(cur => {
          return ( selectedCurrency === cur && (
            <Card className="w-96 bg-secondary">
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