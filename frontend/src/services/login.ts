import { z } from "zod"
import axiosInstance from "./axios"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().trim().min(8),
})

export interface Token {
  access: string;
  refresh: string;
}

type LoginFormType = z.infer<typeof loginSchema>;

export default async function login_service (credentials: LoginFormType): Promise<Token> {
  const response = await axiosInstance.post(`/api/auth/token/`, credentials)
  // setting the defaults below does not work
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`
  return response.data
}