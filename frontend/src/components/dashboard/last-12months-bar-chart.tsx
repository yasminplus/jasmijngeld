import type { ReactNode } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardTitle
} from '@/components/ui/card';
import {
    type ChartConfig, 
    ChartContainer, 
    ChartTooltip, 
    ChartTooltipContent
} from '@/components/ui/chart';
import { useGlobalDataContext } from '@/context/globaldata';
import { type Proc12MoSummary } from '@/types/ExpenseSummaryType';

interface Props {
  passedData: Proc12MoSummary[]
  currency: string
}

function formatMonthTick(val: string) {
  if (val == '')
    return ''
  const [month, yr] = val.split(" ")
  return `${month} ${yr.slice(2)}`
}

export default function Last12MonthsBarChart({ passedData = [], currency }: Props) {
  const chartData: Proc12MoSummary[] = passedData
  const globalDataContext = useGlobalDataContext()

  const chartConfig: { [key: string]: { label?: ReactNode; color?: string } } = {} satisfies ChartConfig
  globalDataContext.enabledCurrencies.forEach(cur => {
    chartConfig[cur] = {
      label: cur,
      color: "hsl(221.21, 83.19%, 53.33%)"
    }
  })

  return (
    <Card>
      <CardContent>
        <CardTitle>
          <h1 className="text-xl">
            Total expenses in the last 12 months
          </h1>
        </CardTitle>

        { passedData.length > 0 ?
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={formatMonthTick}
                />
                <ChartTooltip
                  content={<ChartTooltipContent hideIndicator={true} indicator="dot" />} 
                />
                { globalDataContext.enabledCurrencies.map(cur => cur == currency && <Bar dataKey={cur} fill={`var(--color-${cur})`} radius={5} />)}
              </BarChart>
            </ChartContainer>
        :
          <div className="w-full h-15 mt-2 p-4 text-center align-middle border border-1">
            <h1>No data</h1>
          </div>
        }
      </CardContent>
    </Card>
  )
}