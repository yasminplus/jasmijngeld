import { Container } from './Container'

export function LandingFooter() {
  return (
    <footer className='bg-ink text-cream-dim border-t border-cream/15'>
      <Container>
        <div className='flex flex-row flex-wrap justify-between items-center py-[34px] gap-[16px] '>
          <span className='font-display text-[1.25rem]'>
            <span className='text-cream'>Jasmijn</span><span className='text-gold'>geld</span>
          </span>
          <div className='flex flex-row flex-wrap font-mono text-[0.72rem] tracking-[0.08em] gap-[20px]'>
            <span className='whitespace-nowrap'>
              Built by Yasmin
            </span>
            <span className='whitespace-nowrap'>
              <a
                href="https://github.com/yasminplus/jasmijngeld"
                target="_blank"
                rel="noopener noreferrer"
                className='border-b border-cream/15'
              >
                Github
              </a>
            </span>
            <span className='whitespace-nowrap'>
              <a
                href="https://yasminkhairina.com?utm_source=jasmijngeld&utm_medium=project&utm_content=footer"
                target="_blank"
                rel="noopener noreferrer"
                className='border-b border-cream/15'
              >
                Portfolio
              </a>
            </span>
          </div>
        </div>
      </Container>
    </footer>
  )
}
