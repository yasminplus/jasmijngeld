import { useEffect, useState, type ReactNode } from 'react';
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

const mobileBreakpoint = 640

export default function Last12MonthsBarChart({ passedData = [], currency }: Props) {
  const chartData: Proc12MoSummary[] = passedData
  const globalDataContext = useGlobalDataContext()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function formatMonthTick(val: string) {
    if (val == '')
      return []
    const month_year = val.split(" ")
    let yr_sliced = month_year[1]
    if (windowWidth < mobileBreakpoint) {
      yr_sliced = month_year[1].slice(2)
    }
    return [month_year[0], yr_sliced]
  }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomXAxisTick = ({x, y, payload} : any) => {
  const labels = formatMonthTick(payload.value)
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={16} textAnchor="middle">
        {labels.map((item, i) => (
          <tspan key={i} x="0" dy={`${i === 0 ? 0 : 16}`}>
            {item}
          </tspan>
        ))}
      </text>
    </g>
  )
}

  const chartConfig: { [key: string]: { label?: ReactNode; color?: string } } = {} satisfies ChartConfig

  return (
    <Card>
      <CardContent>
        <CardTitle>
          <h1 className="text-xl">
            Total expenses in the last 12 months
          </h1>
        </CardTitle>

        { passedData.length > 0 ?
            <ChartContainer config={chartConfig} className="min-h-[200px] h-full w-full ">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  height={40}
                  axisLine={false}
                  tick={<CustomXAxisTick />}
                />
                <ChartTooltip
                  content={<ChartTooltipContent hideIndicator={true} indicator="dot" />} 
                />
                {/* fill is the brand gold (primary). hardcoded rather than
                var(--color-primary) because the darkreader extension messes with
                the var and made the chart not visible */}
                { globalDataContext.enabledCurrencies.map(cur =>
                  cur == currency && <Bar dataKey={cur} fill='#CB9433' radius={5} />
                )}
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