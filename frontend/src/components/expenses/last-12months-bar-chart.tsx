import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
    type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent
} from '@/components/ui/chart';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getSummary12Months } from '@/services/expenses';
import { type Proc12MoSummary } from '@/types/ExpenseSummaryType';

export default function Last12MonthsBarChart() {
  const [chartData, setChartData] = useState<Proc12MoSummary[]>([])
  const [currency, setCurrency] = useState('IDR')
  // for testing with example data
  // because there's too much gap for the EUR and IDR, the EUR won't show
  // const [chartData, setChartData] = useState<Proc12MoSummary[]>([
  //   {month: 'Jun 2025', IDR: 300000.00, EUR: 0, USD: 0}, 
  //   {month: 'Jul 2025', IDR: 275045.00, EUR: 15.51, USD: 0}
  // ])
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
      {/* TODO: show a radio button to select which currency to show in this bar chart */}

      <h1 className="text-xl">Total expenses in the last 12 months</h1>
      
      <RadioGroup value={currency} onValueChange={setCurrency} className='py-4' >
        <div className="flex space-x-2">
          <RadioGroupItem value="IDR" id="IDR" />
          <Label htmlFor="IDR">IDR</Label>
        </div>
        <div className="flex space-x-2">
          <RadioGroupItem value="EUR" id="EUR" />
          <Label htmlFor="EUR">EUR</Label>
        </div>
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
          <Bar dataKey="IDR" fill="var(--color-IDR)" radius={5} />
          {/* <Bar dataKey="EUR" fill="var(--color-EUR)" radius={4} />
          <Bar dataKey="USD" fill="var(--color-USD)" radius={4} /> */}
        </BarChart>
      </ChartContainer>

    </div>
  )
}