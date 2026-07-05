import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().trim().min(8),
})

export const signupSchema = z
  .object({
    first_name: z.string().min(3, "Expected first name to have >= 3 characters"),
    last_name: z.string().optional().or(z.literal('')),
    email: z.email(),
    password: z.string().trim().min(8, "Expected password to have >= 8 characters").trim(),
    confirm: z.string().trim().min(8, "Expected confirm password to have >= 8 characters").trim(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  })

export const resetPasswordSchema = z
  .object({
    new_password: z.string().trim().min(8).trim(),
    new_confirm: z.string().trim().min(8).trim(),
  })
  .refine((data) => data.new_password === data.new_confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  })

export const emailTypeSchema = z.object({
  emailType: z.enum(['verify', 'reset'])
})

export const insertEmailSchema = z.object({
  email: z.email(),
})
