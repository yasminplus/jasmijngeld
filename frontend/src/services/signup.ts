import axiosInstance from "./axios"

export interface SignUpPayload {
  first_name: string
  last_name?: string
  email: string
  password: string
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
    console.error(error)
    throw error
  })
}