import { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, PieLabelRenderProps, Tooltip } from 'recharts';

import { CURRENCY_CHOICES, getMonthlyCategorySummary } from '@/services/expenses';
import { SummaryMonthlyCategory } from '@/types/ExpenseSummaryType';

type MonthlyWrapper = {
  currency: string
  data: SummaryMonthlyCategory[]
  count: number
}

const CustomTooltip = ({ active, payload }) => {
  const isVisible = active && payload && payload.length;
  return (
    <div className="custom-tooltip" style={{ visibility: isVisible ? 'visible' : 'hidden' }}>
      {isVisible && (
        <>
          <p className="text-sm bg-white px-2 py-2 text-gray-800 border-gray-400 border rounded-sm opacity-95">
            {`${payload[0].name} : ${payload[0].value.toLocaleString()}`}
          </p>
        </>
      )}
    </div>
  );
};

export default function MonthlyCategoryPieChart() {
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
    <>
      <h1 className="text-xl">Expense category</h1>
        <PieChart width={500} height={400}>
          {chartData.map((item, idx) => (
            <Pie
              key={item['currency']}
              data={item['data'].map(d => ({ ...d, amount: Number(d.amount) }))}
              dataKey="amount"
              nameKey="category_name"
              isAnimationActive={false}
              cx="150"
              cy={100 * (idx + 1) + (idx * 90)}
              outerRadius={70}
              fill="#8884d8"
              label={formatLabel}
            >
              {item['data'].map((entry, index) => (
                <Cell key={`cell-${entry.category_name}`} fill={pieColors[index]} />
              ))}
            </Pie>
          ))}
          <Tooltip content={CustomTooltip} />
        </PieChart>
    </>
  )
}