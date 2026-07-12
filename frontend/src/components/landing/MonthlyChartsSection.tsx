import { Container } from './Container'
import { SectionHead } from './SectionHead'

type Slice = { label: string; color: string; percent: number }

const categoryData: Slice[] = [
  { label: 'Food', color: 'var(--color-gold)', percent: 38 },
  { label: 'Transport', color: 'var(--color-plum)', percent: 23 },
  { label: 'Bills', color: '#7a9b86', percent: 18 },
  { label: 'Groceries', color: '#5f7d8a', percent: 15 },
  { label: 'Subs', color: 'var(--color-cream-dim)', percent: 6 },
]

const sourceData: Slice[] = [
  { label: 'BCA', color: 'var(--color-gold)', percent: 46 },
  { label: 'Jenius', color: 'var(--color-plum)', percent: 26 },
  { label: 'Kartu Kredit', color: '#7a9b86', percent: 16 },
  { label: 'Cash', color: 'var(--color-cream-dim)', percent: 12 },
]

function toConicGradient(data: Slice[]) {
  let cumulative = 0
  const stops = data.map(({ color, percent }) => {
    const start = cumulative
    cumulative += percent
    return `${color} ${start}% ${cumulative}%`
  })
  return `conic-gradient(${stops.join(', ')})`
}

function ChartCard({
  title,
  data,
  centerBig,
  centerLabel,
}: {
  title: string
  data: Slice[]
  centerBig: string
  centerLabel: string
}) {
  return (
    <div className="rounded-[16px] border border-cream/[0.16] bg-ink-soft p-[26px]">
      <div className="mb-[24px] font-mono text-[0.68rem] uppercase tracking-[0.14em] text-cream-dim">
        {title}
      </div>
      <div className="flex flex-wrap items-center gap-[26px]">
        <div
          className="after:content-[''] relative mx-auto h-[150px] w-[150px] flex-shrink-0 rounded-full after:absolute after:inset-[24px] after:rounded-full after:bg-ink-soft"
          style={{ background: toConicGradient(data) }}
          aria-hidden="true"
        >
          <div className="relative z-2 flex h-full w-full flex-col items-center justify-center">
            <span className="font-mono text-[0.98rem] text-gold tabular-nums">{centerBig}</span>
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-cream-dim">
              {centerLabel}
            </span>
          </div>
        </div>
        <ul className="min-w-[150px] flex-1">
          {data.map((item) => (
            <li 
              key={item.label} 
              className="flex items-center gap-[9px] py-[5px] text-[0.82rem] text-cream"
            >
              <span 
                className="h-[11px] w-[11px] flex-shrink-0 rounded-[3px]" 
                style={{ background: item.color }} 
              />
              {item.label}
              <span 
                className="ml-auto font-mono text-[0.74rem] tabular-nums text-cream-dim"
              >
                {item.percent}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function MonthlyChartsSection() {
  return (
    <section id="month" className='bg-ink text-cream py-[96px] max-[860px]:py-[70px]'>
      <Container>
        <SectionHead
          eyebrow='The month, at a glance'
          eyebrowClassName='text-gold'
          title='Where it went, by category and by source.'
          description='Two views of the same month: what you spent it on, and which account it left from. Everything is computed in the app, so no data leaves your database.'
          descriptionClassName='text-cream-dim'
        />
        <div className="grid grid-cols-[1fr_1fr] items-stretch gap-[24px] max-[860px]:grid-cols-1 max-[860px]:gap-[20px]">
          <ChartCard title="By category · June" data={categoryData} centerBig="Rp 3,7M" centerLabel="spent" />
          <ChartCard title="By source · June" data={sourceData} centerBig="Rp 3,7M" centerLabel="total" />
        </div>
      </Container>
    </section>
  )
}
