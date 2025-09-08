import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboardLayout/settings')({
  component: SettingsComponent,
})

function SettingsComponent() {
  return (
    <div>
      <h1>Currencies</h1>
      <h1>Default currency</h1>
    </div>
  )
}
