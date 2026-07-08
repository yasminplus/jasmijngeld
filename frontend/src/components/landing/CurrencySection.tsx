import { Container } from './Container'
import { Eyebrow } from './Eyebrow'

export function CurrencySection() {
  const items = [{
    left: 'NATIVE',
    content: 'Every expense stays in its original currency, exactly as spent.'
  }, {
    left: 'HOLD',
    content: 'Track balances across IDR, EUR, USD and SGD side by side.'
  }, {
    left: 'SHORTHAND',
    content: <>Local notations like <code>45k</code> and <code>32rb</code> are understood natively.</>
  }]

  const ledger = [{
    desc: 'Lunch',
    merchant: 'Warung · food',
    cur: 'IDR',
    amt: '45.000'
  }, {
    desc: 'Koffie',
    merchant: 'Toko · coffee',
    cur: 'EUR',
    amt: '3,80'
  }, {
    desc: 'Groceries',
    merchant: 'Cold Storage',
    cur: 'SGD',
    amt: '28.00'
  }]
  return (
    <section id="currency" className='bg-ink text-cream py-[96px]'>
      <Container>
        {/* sec-head */}
        <div className='max-w-[640px] mb-[52px]'>
          <Eyebrow className='text-gold mb-[16px]'>
            Built for more than one currency
          </Eyebrow>
          <h2 className='font-display font-normal leading-[1.06] tracking-[-0.01em] mb-[16px] text-[clamp(2rem,4vw,3rem)]'>
            Every currency, kept as itself.
          </h2>
          <p className='text-cream-dim font-normal leading-[1.6] text-[1.08rem]'>
            If your money lives in a few places at once, a single-currency tracker quietly lies to you. Jasmijngeld keeps each entry in the currency you spent it in, and shows you the whole picture.
          </p>
        </div>
        {/* grid */}
        <div className='grid grid-cols-[1fr_1fr] gap-[56px] items-center'>
          <ul>
            {items.map((item) => (
              <li
                key={item.left}
                className='flex flex-row gap-[14px] py-[16px] text-[1.05rem] items-baseline border-b border-cream/15 last:border-b-0'
              >
                <span className='font-mono text-gold text-[0.82rem] tracking-[0.08em] whitespace-nowrap'>{item.left}</span>
                <span>{item.content}</span>
              </li>
            ))}
          </ul>
          <div className='bg-ink-soft border border-cream/15 rounded-[16px] p-[8px]' aria-hidden="true">
            {ledger.map((item) => (
              <div
                key={item.desc}
                className='grid grid-cols-[1fr_auto_auto] gap-[14px] items-center px-[16px] py-[15px] border-b border-cream/15 last:border-b-0'
              >
                <div className='text-[0.98rem]'>
                  {item.desc}
                  <small className='mt-[2px] block font-mono text-[0.68rem] tracking-[0.08em] text-cream-dim uppercase'>
                    {item.merchant}
                  </small>
                </div>
                <div className='rounded-[5px] border border-cream/15 px-[7px] py-[2px] font-mono text-[0.68rem] text-gold'>
                  {item.cur}
                </div>
                <div className='font-mono font-medium tabular-nums'>{item.amt}</div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
