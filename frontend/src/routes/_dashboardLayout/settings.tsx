import MultipleSelector, { type Option } from '@/components/multiple-selector'
import { CURRENCY_CHOICES } from '@/services/expenses'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboardLayout/settings')({
  component: SettingsComponent,
})

function SettingsComponent() {
  const currencyList: Option[] = CURRENCY_CHOICES.map(c => {
    return {label: c, value: c}
  })
  console.log(currencyList)
  return (
    <div>
      <h1>Currencies</h1>
      <MultipleSelector options={currencyList} />

      <h1>Default currency</h1>

    </div>
  )
}
