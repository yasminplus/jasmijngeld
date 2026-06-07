import { z } from 'zod'

export const editProfileSchema = z.object({
  email: z.email(),
  first_name: z.string().min(3),
  last_name: z.string().optional().or(z.literal('')),
})

export const changePasswordSchema = z
  .object({
    old_password: z.string().trim().min(8).trim(),
    new_password: z.string().trim().min(8).trim(),
    new_confirm: z.string().trim().min(8).trim(),
  })
  .refine((data) => data.new_password === data.new_confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  })
