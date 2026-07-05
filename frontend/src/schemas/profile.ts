import { z } from 'zod'

export const editProfileSchema = z.object({
  email: z.email(),
  first_name: z.string().min(3, "Expected first name to have >= 3 characters"),
  last_name: z.string().optional().or(z.literal('')),
})

export const changePasswordSchema = z
  .object({
    old_password: z.string().trim().min(8, "Expected current password to have >= 8 characters").trim(),
    new_password: z.string().trim().min(8, "Expected new password to have >= 8 characters").trim(),
    new_confirm: z.string().trim().min(8, "Expected confirm new password to have >= 8 characters").trim(),
  })
  .refine((data) => data.new_password === data.new_confirm, {
    message: "Passwords do not match",
    path: ["new_confirm"],
  })
