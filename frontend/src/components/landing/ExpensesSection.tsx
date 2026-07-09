import { useState } from 'react'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Container } from './Container'
import { SectionHead } from './SectionHead'

type MonthKey = 'this' | 'last'

type Month = {
  key: MonthKey
  label: string
  rows: { date: string; desc: string; tags: string[]; amt: string }[]
  footLabel: string
  footTotal: string
} 

const months: Month[] = [
  {
    key: 'this',
    label: 'This month',
    rows: [
      { date: '28 Jun', desc: 'Kopi susu', tags: ['Coffee', 'Jenius'], amt: 'Rp 22.000' },
      { date: '26 Jun', desc: 'Grab ke kantor', tags: ['Transport', 'Jenius'], amt: 'Rp 32.000' },
      { date: '24 Jun', desc: 'Groceries', tags: ['Groceries', 'BCA'], amt: 'Rp 185.000' },
      { date: '20 Jun', desc: 'Listrik PLN', tags: ['Bills', 'BCA'], amt: 'Rp 142.000' },
      { date: '15 Jun', desc: 'Spotify', tags: ['Subs', 'Kartu Kredit'], amt: 'Rp 54.900' },
      { date: '11 Jun', desc: 'Lunch warung', tags: ['Food', 'Cash'], amt: 'Rp 45.000' },
    ],
    footLabel: 'June · 78 expenses',
    footTotal: 'Rp 3.740.000',
  },
  {
    key: 'last',
    label: 'Last month',
    rows: [
      { date: '30 May', desc: 'Bensin', tags: ['Transport', 'BCA'], amt: 'Rp 100.000' },
      { date: '27 May', desc: 'Kopi', tags: ['Coffee', 'Jenius'], amt: 'Rp 38.000' },
      { date: '22 May', desc: 'Netflix', tags: ['Subs', 'Kartu Kredit'], amt: 'Rp 65.000' },
      { date: '18 May', desc: 'Groceries', tags: ['Groceries', 'BCA'], amt: 'Rp 210.000' },
      { date: '12 May', desc: 'Makan siang', tags: ['Food', 'Cash'], amt: 'Rp 52.000' },
      { date: '8 May', desc: 'Pulsa', tags: ['Bills', 'Jenius'], amt: 'Rp 50.000' },
    ],
    footLabel: 'May · 71 expenses',
    footTotal: 'Rp 4.190.000',
  },
]

export function ExpensesSection() {
  const [active, setActive] = useState<MonthKey>('this')
  const current = months.find((m) => m.key === active)!

  return (
    <section id="expenses" className='bg-celadon text-ink py-[96px]'>
      <Container>
        <SectionHead 
          eyebrow="Filter by month"
          eyebrowClassName='text-gold-deep'
          title="The month, line by line."
          description="Filter your expenses down to a month and read the list. Every row carries the same category and account tags the charts are built on."
          descriptionClassName='text-ink/72'
        />

        <div role='tablist' aria-label='Filter expenses by month' className='mb-[26px] inline-flex gap-[4px] font-mono rounded-[100px] bg-celadon-deep p-[4px] border border-ink/14'>
          {months.map((m) => (
            <Button
              key={m.key} role='tab' aria-selected={m.key === active}
              onClick={() => setActive(m.key)}
              variant='ghost'
              className={cn('h-auto cursor-pointer rounded-[100px] px-[18px] py-[8px] text-[0.76rem] tracking-[0.04em] font-normal', m.key === active ?
                'bg-ink text-cream hover:bg-ink hover:text-cream' :
                'bg-transparent text-ink/60 hover:bg-celadon-deep hover:text-ink/60')}
            >
              {m.label}
            </Button>
          ))}
        </div>

        <div className='border border-ink/14 rounded-[14px] overflow-hidden bg-celadon'>
          {current.rows.map((row) => (
            <div
              key={row.date + row.desc}
              className="grid grid-cols-[66px_1fr_auto_auto_auto] gap-[14px] items-center px-[20px] py-[14px] border-b border-ink/14 last:border-b-0"
            >
              <span className='font-mono text-[0.72rem] tracking-[0.04em] text-ink/50'>{row.date}</span>
              <span className='text-[0.96rem]'>{row.desc}</span>
              {row.tags.map((t) => (
                <span
                  key={t}
                  className='font-mono uppercase text-[0.62rem] text-ink/70 tracking-[0.06em] rounded-[6px] px-[8px] py-[3px] border border-ink/14 whitespace-nowrap'
                >
                  {t}
                </span>)
              )}
              <span className='font-mono font-medium whitespace-nowrap tabular-nums'>
                {row.amt}
              </span>
            </div>
          ))}
          <div className="flex flex-row justify-between font-mono bg-celadon-deep px-[20px] py-[16px] items-baseline">
            <span className='text-ink/55 text-[0.66rem] uppercase tracking-[0.12em]'>
              {current.footLabel}
            </span>
            <span className='text-gold-deep text-[1.05rem] tabular-nums'>
              {current.footTotal}
            </span>
          </div>
        </div>

      </Container>
    </section>
  )
}
