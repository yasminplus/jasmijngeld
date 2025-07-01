import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboardLayout/expenses/$expId/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboardLayout/expenses/$expId/edit"!</div>
}
