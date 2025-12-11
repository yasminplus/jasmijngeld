import axiosInstance from "./axios";
import type { RequestTokenPayload } from "./signup";

export async function requestResetPassword(payload: RequestTokenPayload) {
  const response = await axiosInstance.post(
    `api/auth/request-reset/`, payload
  )
  return response.data
}