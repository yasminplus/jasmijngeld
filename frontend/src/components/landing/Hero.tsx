import { Link } from '@tanstack/react-router'
import { Container } from './Container'
import { ParseDemo } from './ParseDemo'
import { Eyebrow } from './Eyebrow'

export function Hero() {
  return (
    <header className='bg-ink text-cream overflow-hidden relative after:pointer-events-none 
      after:absolute after:-top-[30%] after:-right-[10%] after:h-[60vw] after:w-[60vw] 
      after:max-h-[720px] after:max-w-[720px] after:rounded-full 
      after:bg-[radial-gradient(circle,rgba(203,148,51,0.16),transparent_62%)] after:content-[""]'
    >
      <Container>
        {/* nav — brand, #currency/#expenses/#month anchors, Link to="/login", Link to="/signup" */}
        <nav className='flex flex-row items-center justify-between pt-[26px] pb-[8px] relative z-2'>
          <span className='font-display text-[1.5rem] tracking-[0.01em]'>
            <span className='text-cream'>Jasmijn</span><span className='text-gold'>geld</span>
          </span>

          <span className='flex flex-row items-center gap-[26px]'>
            <a href="#currency" className='text-[0.9rem] text-cream-dim hover:text-cream transition-colors duration-200 max-[860px]:hidden'>
              Currencies
            </a>
            <a href="#expenses" className='text-[0.9rem] text-cream-dim hover:text-cream transition-colors duration-200 max-[860px]:hidden'>
              Expenses
            </a>
            <a href="#month" className='text-[0.9rem] text-cream-dim hover:text-cream transition-colors duration-200 max-[860px]:hidden'>
              Monthly
            </a>
            <Link to="/login" className='text-[0.9rem] ml-[4px] text-cream-dim hover:text-cream transition-colors duration-200 '>
              Login
            </Link>
            <Link to="/signup"
              className='font-mono text-ink text-[0.9rem] px-[16px] py-[8px] rounded-full bg-gold hover:bg-[#d8a244] transition-colors'
            >
              Sign Up
            </Link>
          </span>
        </nav>

        <div className='grid grid-cols-[1.05fr_0.95fr] items-center gap-[56px] pt-[68px] pb-[92px] relative z-2 max-[860px]:grid-cols-1 max-[860px]:gap-[40px] max-[860px]:pt-[44px] max-[860px]:pb-[64px]'>
          <div>
            <Eyebrow className='text-gold mb-[22px]'>
              Side project · Multi-Currency Expense Tracker
            </Eyebrow>
            <h1 className='font-display font-normal leading-[1.02] tracking-[-0.01em] text-[clamp(2.9rem,6vw,4.6rem)] mb-[22px]'>
              Every currency.<br/>
              Every <em className='text-gold italic'>account</em>.
            </h1>
            <p className='text-[1.12rem] text-cream-dim max-w-[30ch] mb-[34px]'>
              Jasmijngeld tracks what you spend across currencies and ties each expense to the account it came from. Adding one is as easy as typing a sentence.
            </p>
            <div className='flex flex-wrap items-center gap-[14px]'>
              <a
                href="#expenses"
                className='inline-flex items-center gap-2 rounded-full bg-gold px-6 py-[13px] text-[0.98rem] font-medium text-ink transition duration-150 hover:-translate-y-0.5 hover:bg-[#d8a244]'
              >
                See how it works
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
          </div>
          <ParseDemo />
        </div>
      </Container>
    </header>
  )
}
