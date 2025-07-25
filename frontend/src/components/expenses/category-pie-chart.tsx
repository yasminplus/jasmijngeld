import { useEffect, useState } from 'react';
import { Pie, PieChart, Tooltip } from 'recharts';

import { CURRENCY_CHOICES, getMonthlyCategorySummary } from '@/services/expenses';
import { SummaryMonthlyCategory } from '@/types/ExpenseSummaryType';

type MonthlyWrapper = {
  currency: string
  data: SummaryMonthlyCategory[]
}

export default function MonthlyCategoryPieChart() {
  const [chartData, setChartData] = useState<MonthlyWrapper[]>([])
  // const [chartData, setChartData] = useState<MonthlyWrapper[]>(
  //   [{
  //     'currency': 'IDR',
  //     'data':[
  //       {
  //           "category_name": "Bills",
  //           "amount": 51000.00,
  //           "currency": "IDR"
  //       },
  //       {
  //           "category_name": "Charity & Gift",
  //           "amount": 150147.00,
  //           "currency": "IDR"
  //       },
  //       {
  //           "category_name": "Eat Out",
  //           "amount": 319000.00,
  //           "currency": "IDR"
  //       },
  //       {
  //           "category_name": "Education",
  //           "amount": 300000.00,
  //           "currency": "IDR"
  //       },
  //       {
  //           "category_name": "Entertainment",
  //           "amount": 50000.00,
  //           "currency": "IDR"
  //       },
  //       {
  //           "category_name": "Health",
  //           "amount": 250000.00,
  //           "currency": "IDR"
  //       },
  //       {
  //           "category_name": "Household Stuffs",
  //           "amount": 140045.00,
  //           "currency": "IDR"
  //       },
  //       {
  //           "category_name": "Personal Care",
  //           "amount": 520000.00,
  //           "currency": "IDR"
  //       },
  //       {
  //           "category_name": "Shopping",
  //           "amount": 100000.00,
  //           "currency": "IDR"
  //       }
  //     ]
  //   }]
  // )

  useEffect(() => {
    getMonthlyCategorySummary()
    .then(res => {
      console.log(res)
      const wrapper: MonthlyWrapper[] = []
      CURRENCY_CHOICES.map(c => {
        const data = res.filter(v => v.currency === c)
        if (data.length > 0) {
          wrapper.push({
            'currency': c,
            'data': data 
          })
        }
      })
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
              cy={100 * (idx + 1) + (idx * 60)}
              outerRadius={70}
              fill="#8884d8"
              label
            />
          ))}
          {/* <Pie dataKey="value" data={data02} cx={500} cy={200} innerRadius={40} outerRadius={80} fill="#82ca9d" /> */}
          <Tooltip />
        </PieChart>
    </>
  )
}