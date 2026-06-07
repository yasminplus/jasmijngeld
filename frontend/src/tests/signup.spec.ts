import { signupSchema } from '@/schemas/auth'

const valid = {
  first_name: 'Galadriel',
  last_name: 'Celeborn',
  email: 'galadriel@lorien.me',
  password: 'huntsauron123',
  confirm: 'huntsauron123',
}

describe('signupSchema', () => {
  it('accepts valid input', () => {
    expect(signupSchema.safeParse(valid).success).toBe(true)
  })

  it('accepts missing last_name', () => {
    const { last_name, ...rest } = valid
    void last_name
    expect(signupSchema.safeParse(rest).success).toBe(true)
  })

  it('accepts empty last_name', () => {
    expect(signupSchema.safeParse({
      ...valid,
      last_name: '' 
    }).success).toBe(true)
  })

  describe('first_name', () => {
    it('rejects shorter than 3 characters', () => {
      expect(signupSchema.safeParse({
        ...valid,
        first_name: 'Ab'
      }).success).toBe(false)
    })

    it('accepts exactly 3 characters', () => {
      expect(signupSchema.safeParse({
        ...valid,
        first_name: 'Gal'
      }).success).toBe(true)
    })

    it('rejects missing field', () => {
      const { first_name, ...rest } = valid
      void first_name
      expect(signupSchema.safeParse(rest).success).toBe(false)
    })
  })

  describe('password', () => {
    it('rejects shorter than 8 characters', () => {
      expect(signupSchema.safeParse({
        ...valid,
        password: 'short',
        confirm: 'short'
      }).success).toBe(false)
    })

    it('accepts exactly 8 characters', () => {
      expect(signupSchema.safeParse({
        ...valid,
        password: '12345678',
        confirm: '12345678'
      }).success).toBe(true)
    })

    it('rejects whitespace-only password', () => {
      expect(signupSchema.safeParse({
        ...valid,
        password: '         ',
        confirm: '         '
      }).success).toBe(false)
    })
  })

  describe('password confirmation', () => {
    it('rejects when confirm does not match password', () => {
      const result = signupSchema.safeParse({
        ...valid,
        confirm: 'gotothewest'
      })
      expect(result.success).toBe(false)
    })

    it('puts the error on the confirm field', () => {
      const result = signupSchema.safeParse({
        ...valid,
        confirm: 'gotothewest'
      })
      if (result.success) throw new Error('expected failure')
      const paths = result.error.issues.map(i => i.path[0])
      expect(paths).toContain('confirm')
    })
  })
})
