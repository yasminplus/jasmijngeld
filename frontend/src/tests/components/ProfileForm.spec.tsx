import ProfileForm from '@/components/profile/ProfileForm'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockUpdateUserAccount = vi.hoisted(() => vi.fn().mockResolvedValue(undefined))
const mockSetFirstName = vi.hoisted(() => vi.fn())

vi.mock('@/services/users', () => ({
  updateUserAccount: mockUpdateUserAccount,
}))

vi.mock('@/context/profile', () => ({
  useProfile: () => ({
    setFirstName: mockSetFirstName,
  }),
}))

const mockUser = {
  email: 'galadriel@lorien.me',
  first_name: 'Galadriel',
  last_name: 'Celeborn',
}

describe('ProfileForm', () => {
  beforeEach(() => {
    render(<ProfileForm user={mockUser} />)
  })

  afterEach(() => {
    mockUpdateUserAccount.mockClear()
    mockSetFirstName.mockClear()
  })

  describe('renders', () => {
    it('renders all fields and submit button', () => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /update profile/i })).toBeInTheDocument()
    })

    it('pre-fills fields with user data', () => {
      expect(screen.getByLabelText(/email/i)).toHaveValue(mockUser.email)
      expect(screen.getByLabelText(/first name/i)).toHaveValue(mockUser.first_name)
      expect(screen.getByLabelText(/last name/i)).toHaveValue(mockUser.last_name)
    })

    it('renders email field as readonly', () => {
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('readonly')
    })
  })

  describe('validation', () => {
    it('shows error when first name is shorter than 3 characters', async () => {
      const user = userEvent.setup()
      await user.clear(screen.getByLabelText(/first name/i))
      await user.type(screen.getByLabelText(/first name/i), 'Ga')
      await user.click(screen.getByRole('button', { name: /update profile/i }))
      expect(screen.getByText(/3 characters/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/first name/i)).toHaveAttribute('aria-invalid', 'true')
    })

    it('does not show error when last name is empty', async () => {
      const user = userEvent.setup()
      await user.clear(screen.getByLabelText(/last name/i))
      await user.click(screen.getByRole('button', { name: /update profile/i }))
      expect(screen.getByLabelText(/last name/i)).not.toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('on submit', () => {
    it('calls updateUserAccount with form data', async () => {
      const user = userEvent.setup()
      await user.click(screen.getByRole('button', { name: /update profile/i }))
      expect(mockUpdateUserAccount).toHaveBeenCalledWith({
        email: mockUser.email,
        first_name: mockUser.first_name,
        last_name: mockUser.last_name,
      })
    })

    it('calls setFirstName after successful update', async () => {
      const user = userEvent.setup()
      await user.click(screen.getByRole('button', { name: /update profile/i }))
      expect(mockSetFirstName).toHaveBeenCalledWith(mockUser.first_name)
    })

    it('shows server error message when update fails', async () => {
      mockUpdateUserAccount.mockRejectedValueOnce({
        response: { data: { message: 'Something went wrong' } }
      })
      const user = userEvent.setup()
      await user.click(screen.getByRole('button', { name: /update profile/i }))
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    })

    it('does not call setFirstName when update fails', async () => {
      mockUpdateUserAccount.mockRejectedValueOnce({
        response: { data: { message: 'Something went wrong' } }
      })
      const user = userEvent.setup()
      await user.click(screen.getByRole('button', { name: /update profile/i }))
      expect(mockSetFirstName).not.toHaveBeenCalled()
    })
  })
})
