import { createFileRoute, redirect } from '@tanstack/react-router'
import { Hero } from '@/components/landing/Hero'
import { CurrencySection } from '@/components/landing/CurrencySection'
import { ExpensesSection } from '@/components/landing/ExpensesSection'
import { MonthlyChartsSection } from '@/components/landing/MonthlyChartsSection'
import { HowItReadsSection } from '@/components/landing/HowItReadsSection'
import { UnderTheHoodSection } from '@/components/landing/UnderTheHoodSection'
import { CtaSection } from '@/components/landing/CtaSection'
import { LandingFooter } from '@/components/landing/LandingFooter'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (context.authContext.isAuthenticated) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Hero />
      <CurrencySection />
      <ExpensesSection />
      <MonthlyChartsSection />
      <HowItReadsSection />
      <UnderTheHoodSection />
      <CtaSection />
      <LandingFooter />
    </div>
  )
}
