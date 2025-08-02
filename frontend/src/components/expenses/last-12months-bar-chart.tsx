import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
    type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent
} from '@/components/ui/chart';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CURRENCY_CHOICES, getSummary12Months } from '@/services/expenses';
import { type Proc12MoSummary } from '@/types/ExpenseSummaryType';

export default function Last12MonthsBarChart() {
  const [chartData, setChartData] = useState<Proc12MoSummary[]>([])
  const [currency, setCurrency] = useState('EUR')

  const chartConfig = {
    IDR: {
      label: "IDR",
      color: "hsl(221.21, 83.19%, 53.33%)",
    },
    EUR: {
      label: "EUR",
      color: "hsl(221.21, 80.19%, 48.33%)",
    },
    USD: {
      label: "USD",
      color: "hsl(221.21, 76.19%, 45.33%)",
    },
  } satisfies ChartConfig

  useEffect(() => {
    getSummary12Months()
    .then(res => {
      setChartData(res)
    })
    .catch(err => {
      throw err
    })
  }, [])

  return (
    <div>
      <h1 className="text-xl">Total expenses in the last 12 months</h1>
      
      <RadioGroup value={currency} onValueChange={setCurrency} className='py-4' >
        { CURRENCY_CHOICES.map(cur => {
          return (
              <div className="flex space-x-2" key={cur}>
                <RadioGroupItem value={cur} id={cur} />
                <Label htmlFor={cur}>{cur}</Label>
              </div>
          )
        })
      }
      </RadioGroup>

      <ChartContainer config={chartConfig} className="min-h-[200px] w-96">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip  content={<ChartTooltipContent hideIndicator={true} indicator="dot" />} />
          { CURRENCY_CHOICES.map(cur => cur == currency && <Bar dataKey={cur} fill={`var(--color-${cur})`} radius={5} />)}
        </BarChart>
      </ChartContainer>

    </div>
  )
}