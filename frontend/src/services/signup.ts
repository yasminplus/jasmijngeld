import axiosInstance from "./axios"

export interface SignUpPayload {
  first_name: string
  last_name?: string
  email: string
  password: string
}

export interface RequestTokenPayload {
  email: string
}

export function postSignupData(data: SignUpPayload): Promise<number> {
  return axiosInstance.post(`/api/auth/register/`, data)
  .then(response => {
    return response.status
  })
  .catch(error => {
    console.error(error)
    throw error
  })
}

export function verifySignupToken(uidb64: string, token: string): Promise<number> {
  return axiosInstance.get(`/api/auth/verify/${uidb64}/${token}/`)
  .then(response => {
    console.log(response)
    return response.status
  })
  .catch(error => {
    throw error
  })
}

export function resendVerificationLink(uidb64: string): Promise<void> {
  return axiosInstance.post(`/api/auth/resend/`, {
    'uidb64': uidb64
  })
  .then(() => {
    return 
  })
  .catch(error => {
    throw error
  })
}

export function sendVerificationLink(data: RequestTokenPayload): Promise<void> {
  return axiosInstance.post(`/api/auth/request/`, data)
  .then(response => {
    console.log(response)
    return 
  })
  .catch(error => {
    throw error
  })
}