import type { z } from "zod"
import axiosInstance from "./axios"
import { loginSchema } from "@/schemas/auth"

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

export async function google_login_service (code: string): Promise<Token> {
  const response = await axiosInstance.post(`/api/auth/google/`, { code })
  return response.data
}