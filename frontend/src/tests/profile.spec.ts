import {
  editProfileSchema,
  changePasswordSchema,
} from '@/schemas/profile'

describe('editProfileSchema', () => {
  const valid = {
    email: 'galadriel@lorien.me',
    first_name: 'Galadriel',
    last_name: 'Celeborn',
  }

  it('accepts valid input', () => {
    expect(editProfileSchema.safeParse(valid).success).toBe(true)
  })

  it('accepts missing last_name', () => {
    const { last_name, ...rest } = valid
    void last_name
    expect(editProfileSchema.safeParse(rest).success).toBe(true)
  })

  it('accepts empty last_name', () => {
    expect(editProfileSchema.safeParse({ ...valid, last_name: '' }).success).toBe(true)
  })

  describe('email', () => {
    it('rejects invalid email format', () => {
      expect(editProfileSchema.safeParse({
        ...valid,
        email: 'not an email',
      }).success).toBe(false)
    })

    it('rejects missing field', () => {
      const { email, ...rest } = valid
      void email
      expect(editProfileSchema.safeParse(rest).success).toBe(false)
    })
  })

  describe('first_name', () => {
    it('rejects shorter than 3 characters', () => {
      expect(editProfileSchema.safeParse({
        ...valid,
        first_name: 'Ga',
      }).success).toBe(false)
    })

    it('accepts exactly 3 characters', () => {
      expect(editProfileSchema.safeParse({
        ...valid,
        first_name: 'Gal',
      }).success).toBe(true)
    })

    it('rejects missing field', () => {
      const { first_name, ...rest } = valid
      void first_name
      expect(editProfileSchema.safeParse(rest).success).toBe(false)
    })
  })
})

describe('changePasswordSchema', () => {
  const valid = {
    old_password: 'huntsauron123',
    new_password: 'ringsofpower1',
    new_confirm: 'ringsofpower1',
  }

  it('accepts valid input', () => {
    expect(changePasswordSchema.safeParse(valid).success).toBe(true)
  })

  it('accepts exactly 8 characters', () => {
    expect(changePasswordSchema.safeParse({
      old_password: '12345678',
      new_password: '87654321',
      new_confirm: '87654321',
    }).success).toBe(true)
  })

  it('rejects password shorter than 8 characters', () => {
    expect(changePasswordSchema.safeParse({
      ...valid,
      new_password: 'short',
      new_confirm: 'short',
    }).success).toBe(false)
  })

  it('rejects whitespace-only password', () => {
    expect(changePasswordSchema.safeParse({
      ...valid,
      new_password: '         ',
      new_confirm: '         ',
    }).success).toBe(false)
  })

  it('rejects missing old_password', () => {
    const { old_password, ...rest } = valid
    void old_password
    expect(changePasswordSchema.safeParse(rest).success).toBe(false)
  })

  describe('password confirmation', () => {
    it('rejects when confirm does not match', () => {
      expect(changePasswordSchema.safeParse({
        ...valid,
        new_confirm: 'gotothewest',
      }).success).toBe(false)
    })

    it('puts the error on the confirm field', () => {
      const result = changePasswordSchema.safeParse({
        ...valid,
        new_confirm: 'gotothewest',
      })
      if (result.success) throw new Error('expected failure')
      const paths = result.error.issues.map(i => i.path[0])
      expect(paths).toContain('confirm')
    })
  })
})
