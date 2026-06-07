import { z } from 'zod'

export const settingsOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
})

export const settingsFormSchema = z.object({
  enabledCurrencies: z.array(settingsOptionSchema).min(1, "Please select at least one currency"),
  defaultCurrency: z.string(),
}).refine(
  (data) => data.enabledCurrencies.some(opt => opt.value === data.defaultCurrency),
  {
    message: "Default currency must be one of the enabled currencies",
    path: ["defaultCurrency"],
  }
)
