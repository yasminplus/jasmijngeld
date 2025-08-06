import { useEffect, useState } from 'react';
import { Cell, Label as RCLabel, Pie, PieChart, type PieLabelRenderProps } from 'recharts';
import {
  Card,
  CardContent,
  CardTitle
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { CURRENCY_CHOICES, getMonthlyCategorySummary } from '@/services/expenses';
import { type SummaryMonthlyCategory } from '@/types/ExpenseSummaryType';


type MonthlyWrapper = {
  currency: string
  data: SummaryMonthlyCategory[]
  count: number
  amount: number
}

const chartConfig = {
  amount: {
    label: "Amount",
  },
} satisfies ChartConfig

interface Props {
  currency: string
}

export default function MonthlyCategoryPieChart({ currency } :Props) {
  const [chartData, setChartData] = useState<MonthlyWrapper[]>([])
  const [pieColors, setPieColors] = useState<string[]>([])
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
            'count': data.length,
            'amount': data.reduce((acc, current ) => acc + Number(current.amount), 0)
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
    <Card>
      <CardContent>
        <CardTitle>
          <h1 className="text-xl">
            Monthly expense by category
          </h1>
        </CardTitle>
        
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
                isAnimationActive={false}
                innerRadius={60}
                label={formatLabel}
              >
                {item['data'].map((entry, index) => (
                  <Cell key={`cell-${entry.category_name}`} fill={pieColors[index]} />
                ))}
                <RCLabel
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-2xl font-bold"
                          >
                            { (item['amount'].toLocaleString()) }
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            {item['currency']}
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            ))}
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}