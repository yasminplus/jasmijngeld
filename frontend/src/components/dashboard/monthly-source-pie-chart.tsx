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
import { useGlobalDataContext } from '@/context/globaldata';
import { getMonthlySourceSummary } from '@/services/expenses';
import { type SummaryMonthlySource } from '@/types/ExpenseSummaryType';


type MonthlyWrapper = {
  currency: string
  data: SummaryMonthlySource[]
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

export default function MonthlySourcePieChart({ currency, date } :Props) {
  const [chartData, setChartData] = useState<MonthlyWrapper[]>([])
  const [pieColors, setPieColors] = useState<string[]>([])
  const formatLabel = ({ amount }: PieLabelRenderProps) => {
    return amount.toLocaleString()
  }
  const globalDataContext = useGlobalDataContext()

  useEffect(() => {
    getMonthlySourceSummary(date)
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
      const pieColorsTmp = Array.from({ length: 20 }, (_, i) => `hsl(${(i * 360) / maxTemp}, 70%, 50%)`);
      setPieColors(pieColorsTmp)
      setChartData(wrapper)
    })
    .catch(err => {
      throw err
    })
  }, [globalDataContext.enabledCurrencies, date])
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h1 className="text-xl">
            Monthly expense by source
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
                  nameKey="source_name"
                  isAnimationActive={false}
                  innerRadius={60}
                  label={formatLabel}
                >
                  {item['data'].map((entry, index) => (
                    <Cell key={`cell-${entry.source_name}`} fill={pieColors[index]} />
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
          <div className="w-full h-max mt-2 p-4 text-center align-middle border border-1">
            <h1>No data</h1>
          </div>
        }
      </CardContent>
    </Card>
  )
}