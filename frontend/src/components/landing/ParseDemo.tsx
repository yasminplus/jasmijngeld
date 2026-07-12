import { useEffect, useState } from 'react'

const examples = [
  { text: 'lunch 45k', amt: '45.000', cur: 'IDR', cat: 'Food', mer: '—' },
  { text: 'koffie €3,80 bij Toko', amt: '3,80', cur: 'EUR', cat: 'Coffee', mer: 'Toko' },
  { text: 'grab ke kantor 32rb', amt: '32.000', cur: 'IDR', cat: 'Transport', mer: 'Grab' },
  { text: 'groceries S$28 cold storage', amt: '28.00', cur: 'SGD', cat: 'Groceries', mer: 'Cold Storage' },
  { text: 'spotify 54900', amt: '54.900', cur: 'IDR', cat: 'Subscriptions', mer: 'Spotify' },
] as const

type Fields = { amt: string; cur: string; cat: string; mer: string }
const emptyFields: Fields = { amt: '—', cur: '—', cat: '—', mer: '—' }

export function ParseDemo() {
  const [typedText, setTypedText] = useState('')
  const [fields, setFields] = useState<Fields>(emptyFields)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    const schedule = (fn: () => void, delay: number) => {
      timers.push(setTimeout(fn, delay))
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let index = 0

    function typePhrase(str: string, onDone: () => void) {
      let i = 0
      function step() {
        setTypedText(str.slice(0, i))
        if (i <= str.length) {
          i++
          schedule(step, 45)
        } else {
          onDone()
        }
      }
      step()
    }

    function showFields(ex: (typeof examples)[number]) {
      setFading(true)
      schedule(() => {
        setFields({ amt: ex.amt, cur: ex.cur, cat: ex.cat, mer: ex.mer })
        setFading(false)
      }, 180)
    }

    function clearFields() {
      setFading(true)
      schedule(() => {
        setFields(emptyFields)
        setFading(false)
      }, 180)
    }

    function cycle() {
      const ex = examples[index % examples.length]
      if (reduceMotion) {
        setTypedText(ex.text)
        showFields(ex)
        index++
        schedule(cycle, 3200)
        return
      }
      typePhrase(ex.text, () => {
        schedule(() => showFields(ex), 350)
        schedule(() => {
          index++
          clearFields()
          schedule(cycle, 500)
        }, 2600)
      })
    }

    cycle()

    return () => {
      timers.forEach(clearTimeout)
    }
  }, [])

  return (
    <div className="flex flex-col rounded-[18px] border border-cream/15 bg-ink-soft p-[26px] font-mono text-cream shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]" aria-hidden="true">
      <div className="mb-[18px] flex flex-row items-center justify-between text-[0.7rem] tracking-[0.12em] text-cream-dim uppercase">
        <div className="flex items-center">
          <span className="mr-[7px] inline-block h-[7px] w-[7px] rounded-full bg-gold" />
          Adding an expense
        </div>
        <div>id · en · nl</div>
      </div>

      <div className="flex min-h-[62px] items-center rounded-[10px] border border-cream/15 bg-black/28 px-[18px] py-[16px] font-display text-[1.5rem] text-cream max-[860px]:text-[1.25rem]">
        <span>{typedText}</span>
        <span className="animate-blink motion-reduce:animate-none ml-0.5 inline-block h-[1.4em] w-[2px] bg-gold align-middle" />
      </div>

      <div className="py-[12px] text-center text-[0.72rem] tracking-[0.14em] text-gold/90">
        ↓ &nbsp; parsed &nbsp; ↓
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-cream/15 bg-cream/15 max-[480px]:grid-cols-1">
        <Field label="Amount" value={fields.amt} fading={fading} accent />
        <Field label="Currency" value={fields.cur} fading={fading} />
        <Field label="Category" value={fields.cat} fading={fading} />
        <Field label="Merchant" value={fields.mer} fading={fading} />
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  fading,
  accent,
}: {
  label: string
  value: string
  fading: boolean
  accent?: boolean
}) {
  return (
    <div className="flex flex-col bg-ink-soft px-[15px] py-[13px]">
      <div className="mb-[3px] text-[0.62rem] tracking-[0.14em] text-cream-dim uppercase">{label}</div>
      <div
        className={`text-[1rem] font-medium tabular-nums transition-opacity duration-300 ${
          accent ? 'text-gold' : 'text-cream'
        } ${fading ? 'opacity-0' : 'opacity-100'}`}
      >
        {value}
      </div>
    </div>
  )
}
