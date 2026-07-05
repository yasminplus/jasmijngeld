import { resendVerificationLink } from "@/services/signup";
import { Button } from "../ui/button";
import { toast } from "sonner"


interface Props {
  uidb64: string
}
export default function ResendVerifLink({ uidb64=''}: Props) {
  async function onSubmitResend() {
    try {
      await resendVerificationLink(uidb64)
      toast.success("Successfully resent verification link.")
    } catch (error) {
      console.error(error)
      toast.error("Uh oh, we could not resend you the verification link.")
    }
  }

  return (
    <>
      <Button onClick={onSubmitResend} className="w-full">Resend email</Button>
    </>
  )
}