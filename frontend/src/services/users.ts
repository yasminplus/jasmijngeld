import axiosInstance from "./axios"

export interface UserAccount {
  email: string
  first_name: string
  last_name?: string
}

export async function getUserAccountData() {
  return axiosInstance.get('/api/auth/')
}

export async function updateUserAccount(payload: UserAccount) {
  return axiosInstance.put('/api/auth/', payload)
}