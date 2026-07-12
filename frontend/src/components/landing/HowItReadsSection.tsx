import { Container } from './Container'
import { SectionHead } from './SectionHead'

type ReadCell = {
  num: string
  title: string
  description: React.ReactNode
  chip: string
}

const cells: ReadCell[] = [
  {
    num: '01 describe',
    title: 'Say the amount however',
    description: (
      <>
        <code>45k</code>, <code>32rb</code>, <code>€3,80</code>, <code>S$28</code> — shorthand, symbols, and decimal
        commas all resolve to a real number and a currency.
      </>
    ),
    chip: '45k → Rp 45.000',
  },
  {
    num: '02 match',
    title: 'Names get recognised',
    description:
      'A merchant is matched against the ones you already use, with a fuzzy fallback for typos and variants. That\'s how "grab" and "gojek" land where you\'d expect.',
    chip: 'grab → Transport',
  },
  {
    num: '03 confirm',
    title: 'Review, then save',
    description:
      'The parsed entry comes back pre-filled: amount, category, merchant, account. You glance, fix anything off, and save. Never a blank form.',
    chip: 'pre-filled, not blank',
  },
]

function GridCell({ data }: { data: ReadCell }) {
  return (
    <div className='bg-celadon py-[30px] px-[28px]'>
      <div className='block text-gold-deep font-mono lowercase text-[0.72rem] tracking-[0.14em] mb-[18px]'>
        {data.num}
      </div>
      <h3 className='mb-[8px] text-[1.12rem] font-semibold'>
        {data.title}
      </h3>
      <p className='text-[0.96rem] text-ink/70'>
        {data.description}
      </p>
      <div className='bg-celadon-deep font-mono text-[0.82rem] border border-ink/14 rounded-[6px] mt-[16px] inline-block px-[9px] py-[3px]'>
        {data.chip}
      </div>
    </div>
  )
}

export function HowItReadsSection() {
  return (
    <section id="how" className='bg-celadon text-ink py-[96px] max-[860px]:py-[70px]'>
      <Container>
        <SectionHead
          eyebrow='Natural-language entry · one way in'
          eyebrowClassName='text-gold-deep'
          title='One line in. A tidy entry out.'
          description="Adding an expense shouldn't be a form. You write a phrase; the parser pulls out the parts that matter and leaves you to confirm. Once you do, it's filed to the right account like everything else."
          descriptionClassName='text-ink/72'
        />
        <div className='grid grid-cols-[1fr_1fr_1fr] gap-px overflow-hidden rounded-[14px] border border-ink/14 bg-ink/14 max-[860px]:grid-cols-1'>
          {cells.map((item) => (
            <GridCell key={item.num} data={item} />
          ))}
        </div>
      </Container>
    </section>
  )
}
