import {
  settingsOptionSchema,
  settingsFormSchema,
} from '@/schemas/settings'

describe('settingsOptionSchema', () => {
  it('accepts valid option', () => {
    expect(settingsOptionSchema.safeParse({
      label: 'USD',
      value: 'USD',
    }).success).toBe(true)
  })

  it('accepts option with disable flag', () => {
    expect(settingsOptionSchema.safeParse({
      label: 'USD',
      value: 'USD',
      disable: true,
    }).success).toBe(true)
  })

  it('accepts missing disable field', () => {
    expect(settingsOptionSchema.safeParse({
      label: 'USD',
      value: 'USD',
    }).success).toBe(true)
  })

  it('rejects missing label', () => {
    expect(settingsOptionSchema.safeParse({
      value: 'USD',
    }).success).toBe(false)
  })

  it('rejects missing value', () => {
    expect(settingsOptionSchema.safeParse({
      label: 'USD',
    }).success).toBe(false)
  })
})

describe('settingsFormSchema', () => {
  const validOption = { label: 'IDR', value: 'IDR' }
  const valid = {
    enabledCurrencies: [validOption],
    defaultCurrency: 'IDR',
  }

  it('accepts valid input', () => {
    expect(settingsFormSchema.safeParse(valid).success).toBe(true)
  })

  it('accepts multiple enabled currencies', () => {
    expect(settingsFormSchema.safeParse({
      ...valid,
      enabledCurrencies: [validOption, { label: 'USD', value: 'USD' }],
    }).success).toBe(true)
  })

  it('rejects empty enabledCurrencies array', () => {
    expect(settingsFormSchema.safeParse({
      ...valid,
      enabledCurrencies: [],
    }).success).toBe(false)
  })

  it('rejects missing enabledCurrencies', () => {
    const { enabledCurrencies, ...rest } = valid
    void enabledCurrencies
    expect(settingsFormSchema.safeParse(rest).success).toBe(false)
  })

  it('rejects missing defaultCurrency', () => {
    const { defaultCurrency, ...rest } = valid
    void defaultCurrency
    expect(settingsFormSchema.safeParse(rest).success).toBe(false)
  })

  it('rejects defaultCurrency not in enabledCurrencies array', () => {
    expect(settingsFormSchema.safeParse({
      ...valid,
      defaultCurrency: 'USD',
    }).success).toBe(false)
  })
})
