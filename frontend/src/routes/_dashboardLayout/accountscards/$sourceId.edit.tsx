
import { createFileRoute } from '@tanstack/react-router'
import PaymentSourceForm from '@/components/sources/source-form';
import { getPaymentSource } from '@/services/accounts-cards';

export const Route = createFileRoute(
  '/_dashboardLayout/accountscards/$sourceId/edit',
)({
  component: EditAccount,
  loader: async ({ params }) => await getPaymentSource(params.sourceId),
})


function EditAccount() {
  const loaderData = Route.useLoaderData()

  return (
    <>
      <h1>Edit account/card</h1>
      <PaymentSourceForm account={loaderData} />
    </>
  )
}
