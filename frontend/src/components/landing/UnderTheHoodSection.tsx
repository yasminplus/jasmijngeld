import { Container } from './Container'
import { SectionHead } from './SectionHead'

type Step = {
  num: string
  cap: string
  val: React.ReactNode
  note?: React.ReactNode
}

const steps: Step[] = [
  {
    num: '01',
    cap: 'You type',
    val: 'grab ke kantor 32rb',
  },
  {
    num: '02',
    cap: 'One LLM call returns validated JSON',
    val: (
      <>
        {'{ '}
        <span className='text-plum'>amount</span>: 32000, <span className='text-plum'>currency</span>: "IDR",{' '}
        <span className='text-plum'>category</span>: "Transportation", <span className='text-plum'>merchant</span>: "Grab"
        {' }'}
      </>
    ),
  },
  {
    num: '03',
    cap: 'Merchant resolved',
    val: 'Grab matched to an existing merchant',
    note: (
      <>
        Exact match first, <code>rapidfuzz</code> fallback for near-misses.
      </>
    ),
  },
  {
    num: '04',
    cap: 'You approve',
    val: 'Rp 32.000 · Transportation · Grab · ready to save',
    note: 'A pre-filled entry to accept or tweak. Never a blank form.',
  },
]

type Decision = {
  question: string
  answer: string
}

const decisions: Decision[] = [
  {
    question: 'Why link every expense to a source?',
    answer:
      "An expense is money leaving a specific account, not just an amount. Storing that link is what lets the app total spending per source, not just per category.",
  },
  {
    question: 'Why store native currency?',
    answer:
      "Converting on write bakes in a rate you can't undo. Each entry keeps its original currency; conversion happens at read time, so historical totals stay honest.",
  },
  {
    question: 'Why compute the charts in the app?',
    answer:
      'The category and source breakdowns are plain aggregate queries. They\'re deterministic, testable, and fast. The model handles language and the database handles maths.',
  },
]

const stack = ['React · TypeScript', 'Django', 'DRF', 'PostgreSQL', 'LLM API', 'rapidfuzz']

function StepRow({ data }: {data: Step}) {
  return (
    <div className='grid grid-cols-[72px_1fr] gap-[14px] items-start py-[24px] border-t border-ink/14 first:border-t-0 first:pt-[2px] max-[480px]:grid-cols-[50px_1fr] max-[480px]:gap-[10px]'>
      <div className='font-display text-[2.6rem] leading-[0.8] text-gold-deep max-[480px]:text-[2.1rem]'>
        {data.num}
      </div>
      <div>
        <div className='font-semibold text-[0.82rem] mb-[8px]'>
          {data.cap}
        </div>
        <div className='font-mono text-[0.9rem] border border-ink/14 rounded-[8px] bg-celadon leading-[1.5] break-words px-[14px] py-[12px]'>
          {data.val}
        </div>
        {data.note && <div className='mt-[9px] text-[0.88rem] text-ink/68'>
          {data.note}
        </div>}
      </div>
    </div>
  )
}

export function UnderTheHoodSection() {
  return (
    <section id="hood" className='bg-celadon-deep text-ink py-[96px] max-[860px]:py-[70px]'>
      <Container>
        <SectionHead
          eyebrow='Under the hood'
          eyebrowClassName='text-gold-deep'
          title="The interesting part isn't the prompt."
          description="Getting a model to return structured data is the easy 20%. The rest is turning that output into the right merchant, currency and account, and making sure what's stored actually matches what you spent."
          descriptionClassName='text-ink/72'
        />
        <div className='max-w-[720px] mb-[48px]'>
          {steps.map((item) => (
            <StepRow key={item.num} data={item} />
          ))}
        </div>
        <div className='grid grid-cols-[1fr_1fr_1fr] gap-[20px] max-[860px]:grid-cols-1 max-[860px]:gap-[24px]'>
          {decisions.map((item) => (
            <div key={item.question} className='border-t-[2px] border-gold-deep pt-[16px]'>
              <div className='font-mono text-gold-deep text-[0.7rem] uppercase tracking-[0.08em] mb-[8px]'>
                {item.question}
              </div>
              <div className='text-ink/78 text-[0.94rem]'>
                {item.answer}
              </div>
            </div>
          ))}
        </div>
        <div className='flex flex-wrap gap-[8px] mt-[44px]'>
          {stack.map((item) => (
            <span
              key={item}
              className='font-mono text-[0.74rem] text-ink border border-ink/14 rounded-[100px] px-[14px] py-[6px]'
            >
              {item}
            </span>
          ))}
        </div>
      </Container>
    </section>
  )
}
