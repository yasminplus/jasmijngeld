import { useEffect, useState } from 'react';
import { Cell, Label as RCLabel, Pie, PieChart, type PieLabelRenderProps } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useExpenseStatic } from '@/context/expense-static';
import { useGlobalDataContext } from '@/context/globaldata';
import {
  getMonthlyCategorySummary
} from '@/services/expenses';
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
  date: string
}

export default function MonthlyCategoryPieChart({ currency, date }: Props) {
  const [chartData, setChartData] = useState<MonthlyWrapper[]>([])
  const [catColors, setCatColors] = useState<Map<string, string>>()
  const formatLabel = ({ amount }: PieLabelRenderProps) => {
    return amount.toLocaleString()
  }
  const globalDataContext = useGlobalDataContext()
  const expStatic = useExpenseStatic()
  
  useEffect(() => {
    getMonthlyCategorySummary(date)
    .then(res => {
      let maxTemp = 0
      const wrapper: MonthlyWrapper[] = []
      globalDataContext.enabledCurrencies.map(c => {
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
      setChartData(wrapper)
    })
    .catch(err => {
      throw err
    })
  }, [globalDataContext.enabledCurrencies, date])

  useEffect(() => {
    const categoryHues = new Map()
    expStatic.categories.map(cat => categoryHues.set(cat.name, `hsl(${cat.hue} 100% 55%)`))
    setCatColors(categoryHues)
  }, [expStatic.categories])
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h1 className="text-xl">
            Monthly expense by category
          </h1>
        </CardTitle>
      </CardHeader>
      <CardContent>
        { chartData.length > 0 ? 
          <ChartContainer 
            config={chartConfig}
            className="[&_.recharts-pie-label-text]:fill-foreground aspect-square max-h-[250px] pb-0 min-h-[200px] w-full"
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
                  {item['data'].map((entry) => (
                    <Cell key={`cell-${entry.category_name}`} fill={catColors?.get(entry.category_name)} />
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
        : 
          <div className="w-full mt-2 p-4 text-center align-middle border border-1">
            <h1>No data</h1>
          </div>
        }
      </CardContent>
    </Card>
  )
}