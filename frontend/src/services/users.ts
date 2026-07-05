import axiosInstance from "./axios"

export interface UserAccount {
  email: string
  first_name: string
  last_name?: string
}

export interface ChangePwType {
  old: string
  new: string
}

export async function getUserAccountData() {
  return axiosInstance.get('/api/auth/')
}

export async function updateUserAccount(payload: UserAccount) {
  return axiosInstance.put('/api/auth/', payload)
}

export async function changePassword(payload: ChangePwType) {
  return axiosInstance.post('/api/auth/chgpw/', payload)
}