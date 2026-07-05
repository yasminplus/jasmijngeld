import { loginSchema } from '@/schemas/auth'

const valid = {
  email: 'galadriel@lorien.me',
  password: 'huntsauron123',
}

describe('loginSchema', () => {
  it('accepts valid input', () => {
    expect(loginSchema.safeParse(valid).success).toBe(true)
  })

  describe('email', () => {
    it('rejects invalid format', () => {
      expect(loginSchema.safeParse({
        ...valid,
        email: 'not galadriel',
      }).success).toBe(false)
    })

    it('rejects empty email', () => {
      expect(loginSchema.safeParse({
        ...valid,
        email: '',
      }).success).toBe(false)
    })

    it('rejects missing field', () => {
      const { email, ...rest } = valid
      void email
      expect(loginSchema.safeParse(rest).success).toBe(false)
    })
  })

  describe('password', () => {
    it('rejects shorter than 8 characters', () => {
      expect(loginSchema.safeParse({
        ...valid,
        password: 'sauron',
      }).success).toBe(false)
    })

    it('accepts exactly 8 characters', () => {
      expect(loginSchema.safeParse({
        ...valid,
        password: '12345678',
      }).success).toBe(true)
    })

    it('rejects whitespace-only password', () => {
      expect(loginSchema.safeParse({
        ...valid,
        password: '         ',
      }).success).toBe(false)
    })

    it('rejects password that meets min length only due to whitespace', () => {
      expect(loginSchema.safeParse({
        ...valid,
        password: '   abc   ',
      }).success).toBe(false)
    })

    it('rejects empty password', () => {
      expect(loginSchema.safeParse({
        ...valid,
        password: '',
      }).success).toBe(false)
    })

    it('rejects missing field', () => {
      const { password, ...rest } = valid
      void password
      expect(loginSchema.safeParse(rest).success).toBe(false)
    })
  })
})
