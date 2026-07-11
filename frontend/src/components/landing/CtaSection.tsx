import { Container } from './Container'

export function CtaSection() {
  return (
    <section id="access" className='bg-ink text-center py-[96px]'>
      <Container>
        <h2 className='mb-[18px] font-display text-[clamp(2.2rem,5vw,3.4rem)] leading-[1.04]'>
          Take a look <em className='italic text-gold'>inside</em>.
        </h2>
        <p className='mx-auto mb-[34px] max-w-[44ch] text-[1.08rem] text-cream-dim'>
          A side project I keep polished, both to stay sharp on the backend and to prove I can carry the frontend too.
        </p>
        <div className='flex flex-wrap gap-[14px] justify-center'>
          <a
            href="/signup"
            className='inline-flex items-center gap-2 rounded-full bg-gold px-6 py-[13px] text-[0.98rem] font-medium text-ink transition duration-150 hover:-translate-y-0.5 hover:bg-[#d8a244]'
          >
            Create an account
          </a>
          <a
            href="https://github.com/yasminplus/jasmijngeld"
            target="_blank"
            rel="noopener noreferrer"
            className='inline-flex items-center gap-2 rounded-full border border-cream/15 px-6 py-[13px] text-[0.98rem] font-medium text-cream transition duration-150 hover:border-cream'
          >
            View source ↗
          </a>
        </div>
      </Container>
    </section>
  )
}
