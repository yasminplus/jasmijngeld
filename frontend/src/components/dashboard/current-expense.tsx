import type { Proc12MoSummary } from "@/types/ExpenseSummaryType";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CURRENCY_CHOICES } from "@/services/expenses";
import { useState } from "react";
import CurrencyRadioGroup from "../currency-radio-group";

interface Props {
  passedData: Proc12MoSummary
}

export default function CurrentExpense({ passedData }: Props) {
  const [selectedCurrency, setSelectedCurrency] = useState('IDR')
  console.log(passedData)

  return (
    <div>
      <CurrencyRadioGroup currency={selectedCurrency} setCurrency={setSelectedCurrency} />
      
      {
        CURRENCY_CHOICES.map(cur => {
          return ( selectedCurrency === cur && (
            <Card className="w-96">
              <CardHeader>
                <CardTitle>Expense this month</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{passedData[cur]}</p>
              </CardContent>
            </Card>
          ))
        })
      }
      
    </div>
  )

}