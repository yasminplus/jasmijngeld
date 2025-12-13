import axiosInstance from "./axios";
import type { RequestTokenPayload } from "./signup";

export interface ResetPwType {
  new: string
}

export async function requestResetPassword(payload: RequestTokenPayload) {
  const response = await axiosInstance.post(
    `api/auth/request-reset/`, payload
  )
  return response.data
}

export async function verifyResetPasswordToken(uidb64: string, token: string): Promise<number> {
  return axiosInstance.get(`/api/auth/verify-reset/${uidb64}/${token}/`)
  .then(response => {
    console.log(response)
    return response.status
  })
  .catch(error => {
    throw error
  })
}

export async function resetPassword(
  uidb64: string, 
  token: string, 
  payload: ResetPwType
) {
  return axiosInstance.post(`/api/auth/resetpw/${uidb64}/${token}/`, payload)
}