import { createFileRoute, useCanGoBack, useRouter } from '@tanstack/react-router'
import { AxiosError } from 'axios';
import { ArrowLeft } from 'lucide-react';
import PaymentSourceForm from '@/components/sources/source-form';
import { Button } from '@/components/ui/button';
import { getPaymentSource } from '@/services/accounts-cards';

export const Route = createFileRoute(
  '/_dashboardLayout/accountscards/$sourceId/edit',
)({
  component: EditAccount,
  loader: async ({ params }) => {
    try {
      const res = await getPaymentSource(params.sourceId)
      return res
    } catch (error) {
      if (error instanceof AxiosError) {
        // return a consistent shape so Route.useLoaderData() can be typed/checked
        return { status: error.response?.status ?? 500, message: error.message }
      }
      // re-throw unexpected errors so the router can handle them
      throw error
    }
  }
})

function EditAccount() {
  const loaderData = Route.useLoaderData()
  console.log(loaderData)
  const router = useRouter()
  const canGoBack = useCanGoBack()

  if (loaderData && typeof loaderData === 'object' && 'status' in loaderData) {
    return (
      <div>
        <h1>Data not found</h1>
      </div>
    )
  } else if (typeof loaderData === 'object' && 'source_type' in loaderData) {
    return (
      <div>
        <h1 className='text-2xl font-medium'>
          {canGoBack? (
            <Button onClick={() => router.history.back()} variant="ghost" size="icon">
              <ArrowLeft />
            </Button>
          ) : null}
          Edit account/card
        </h1>
        <PaymentSourceForm account={loaderData!} />
      </div>
    )
  }
}
