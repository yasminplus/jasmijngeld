import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authLayout/unverified')({
  component: Unverified,
})

// TODO: maybe we need to move this to another layout that has logout button so we can clear the session.
function Unverified() {
  return (
    <>
      <h1>Please check your inbox and verify your email address.</h1>

      <h2>If you haven't received any email, you can request to resend them here.</h2>
    </>
  )
}