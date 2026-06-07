import {
  resetPasswordSchema,
  emailTypeSchema,
  insertEmailSchema,
} from '@/schemas/auth'

describe('resetPasswordSchema', () => {
  const valid = {
    new_password: 'huntsauron123',
    new_confirm: 'huntsauron123',
  }

  it('accepts valid matching passwords', () => {
    expect(resetPasswordSchema.safeParse(valid).success).toBe(true)
  })

  it('accepts exactly 8 characters', () => {
    expect(resetPasswordSchema.safeParse({
      new_password: '12345678',
      new_confirm: '12345678',
    }).success).toBe(true)
  })

  it('rejects password shorter than 8 characters', () => {
    expect(resetPasswordSchema.safeParse({
      new_password: 'short',
      new_confirm: 'short',
    }).success).toBe(false)
  })

  it('rejects whitespace-only password', () => {
    expect(resetPasswordSchema.safeParse({
      new_password: '         ',
      new_confirm: '         ',
    }).success).toBe(false)
  })

  describe('password confirmation', () => {
    it('rejects when confirm does not match', () => {
      expect(resetPasswordSchema.safeParse({
        ...valid,
        new_confirm: 'gotothewest',
      }).success).toBe(false)
    })

    it('puts the error on the confirm field', () => {
      const result = resetPasswordSchema.safeParse({
        ...valid,
        new_confirm: 'gotothewest',
      })
      if (result.success) throw new Error('expected failure')
      const paths = result.error.issues.map(i => i.path[0])
      expect(paths).toContain('confirm')
    })
  })
})

describe('emailTypeSchema', () => {
  it('accepts "verify"', () => {
    expect(emailTypeSchema.safeParse({
      emailType: 'verify',
    }).success).toBe(true)
  })

  it('accepts "reset"', () => {
    expect(emailTypeSchema.safeParse({
      emailType: 'reset',
    }).success).toBe(true)
  })

  it('rejects any other string', () => {
    expect(emailTypeSchema.safeParse({
      emailType: 'other',
    }).success).toBe(false)
  })

  it('rejects missing field', () => {
    expect(emailTypeSchema.safeParse({}).success).toBe(false)
  })
})

describe('insertEmailSchema', () => {
  it('accepts a valid email', () => {
    expect(insertEmailSchema.safeParse({
      email: 'galadriel@lorien.me',
    }).success).toBe(true)
  })

  it('rejects invalid email format', () => {
    expect(insertEmailSchema.safeParse({
      email: 'not an email',
    }).success).toBe(false)
  })

  it('rejects empty email', () => {
    expect(insertEmailSchema.safeParse({
      email: '',
    }).success).toBe(false)
  })

  it('rejects missing field', () => {
    expect(insertEmailSchema.safeParse({}).success).toBe(false)
  })
})
