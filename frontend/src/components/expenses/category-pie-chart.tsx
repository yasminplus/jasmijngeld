import { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, type PieLabelRenderProps } from 'recharts';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { CURRENCY_CHOICES, getMonthlyCategorySummary } from '@/services/expenses';
import { type SummaryMonthlyCategory } from '@/types/ExpenseSummaryType';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';


type MonthlyWrapper = {
  currency: string
  data: SummaryMonthlyCategory[]
  count: number
}

const chartConfig = {
  amount: {
    label: "Amount",
  },
} satisfies ChartConfig

export default function MonthlyCategoryPieChart() {
  const [chartData, setChartData] = useState<MonthlyWrapper[]>([])
  const [pieColors, setPieColors] = useState<string[]>([])
  const [currency, setCurrency] = useState('IDR')
  const formatLabel = ({ amount }: PieLabelRenderProps) => {
    return amount.toLocaleString()
  }
  useEffect(() => {
    getMonthlyCategorySummary()
    .then(res => {
      let maxTemp = 0
      const wrapper: MonthlyWrapper[] = []
      CURRENCY_CHOICES.map(c => {
        const data = res.filter(v => v.currency === c)
        data.sort((a, b) => b.amount - a.amount)
        if (data.length > 0) {
          maxTemp = Math.max(maxTemp, data.length)
          wrapper.push({
            'currency': c,
            'data': data,
            'count': data.length
          })
        }
      })
      const pieColorsTmp = Array.from({ length: 20 }, (_, i) => `hsl(${(i * 360) / maxTemp}, 70%, 50%)`);
      setPieColors(pieColorsTmp)
      setChartData(wrapper)
    })
    .catch(err => {
      throw err
    })
  }, [])
  
  return (
    <div>
      <h1 className="text-xl">Expense category</h1>
      <RadioGroup value={currency} onValueChange={setCurrency} className='py-4' >
        <div className='flex flex-row justify-start space-x-10'>
          { CURRENCY_CHOICES.map(cur => {
            return (
              <div className="flex flex-row space-x-2" key={cur}>
                  <RadioGroupItem value={cur} id={cur} />
                  <Label htmlFor={cur}>{cur}</Label>
                </div>
            )
          })
        }
        </div>
      </RadioGroup>
      <ChartContainer 
        config={chartConfig}
        className="[&_.recharts-pie-label-text]:fill-foreground aspect-square max-h-[250px] pb-0 min-h-[200px] w-96"
      >
        <PieChart>
           <ChartTooltip content={<ChartTooltipContent hideLabel/>} />
          {chartData.map((item) => item['currency'] === currency && (
            <Pie
              key={item['currency']}
              data={item['data'].map(d => ({ ...d, amount: Number(d.amount) }))}
              dataKey="amount"
              nameKey="category_name"
              innerRadius={60}
              label={formatLabel}
            >
              {item['data'].map((entry, index) => (
                <Cell key={`cell-${entry.category_name}`} fill={pieColors[index]} />
              ))}
            </Pie>
          ))}
        </PieChart>
      </ChartContainer>
    </div>
  )
}