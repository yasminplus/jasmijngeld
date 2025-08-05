import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import {
    type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent
} from '@/components/ui/chart';
import { CURRENCY_CHOICES } from '@/services/expenses';
import { type Proc12MoSummary } from '@/types/ExpenseSummaryType';

interface Props {
  passedData: Proc12MoSummary[]
  currency: string
}
export default function Last12MonthsBarChart({ passedData = [], currency }: Props) {
  const chartData: Proc12MoSummary[] = passedData

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

  return (
    <div>
      <h1 className="text-xl">Total expenses in the last 12 months</h1>

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