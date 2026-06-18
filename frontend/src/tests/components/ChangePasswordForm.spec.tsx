import ChangePasswordForm from '@/components/profile/ChangePasswordForm'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AxiosError } from 'axios'

const mockChangePassword = vi.hoisted(() => vi.fn().mockResolvedValue(undefined))

vi.mock('@/services/users', () => ({
  changePassword: mockChangePassword,
}))

function makeAxiosError(status: number, message: string) {
  const error = new AxiosError(message)
  error.response = { status, data: { message } } as AxiosError['response']
  return error
}

describe('ChangePasswordForm', () => {
  beforeEach(() => {
    render(<ChangePasswordForm />)
  })

  afterEach(() => {
    mockChangePassword.mockClear()
  })

  describe('renders', () => {
    it('renders all fields and submit button', () => {
      expect(screen.getByLabelText(/current password/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^new password/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument()
    })
  })

  describe('validation', () => {
    it('shows error when current password is too short', async () => {
      const user = userEvent.setup()
      await user.type(screen.getByLabelText(/current password/i), 'sauron')
      await user.type(screen.getByLabelText(/^new password/i), 'huntsauron123')
      await user.type(screen.getByLabelText(/confirm new password/i), 'huntsauron123')
      await user.click(screen.getByRole('button', { name: /change password/i }))
      expect(screen.getByText(/8 characters/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/current password/i)).toHaveAttribute('aria-invalid', 'true')
    })

    it('shows error when passwords do not match', async () => {
      const user = userEvent.setup()
      await user.type(screen.getByLabelText(/current password/i), 'huntsauron123')
      await user.type(screen.getByLabelText(/^new password/i), 'huntsauron123')
      await user.type(screen.getByLabelText(/confirm new password/i), 'ringsofpower1')
      await user.click(screen.getByRole('button', { name: /change password/i }))
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm new password/i)).toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('on submit', () => {
    it('calls changePassword with correct payload', async () => {
      const user = userEvent.setup()
      await user.type(screen.getByLabelText(/current password/i), 'huntsauron123')
      await user.type(screen.getByLabelText(/^new password/i), 'ringsofpower1')
      await user.type(screen.getByLabelText(/confirm new password/i), 'ringsofpower1')
      await user.click(screen.getByRole('button', { name: /change password/i }))
      expect(mockChangePassword).toHaveBeenCalledWith({
        old: 'huntsauron123',
        new: 'ringsofpower1',
      })
    })

    it('shows error on current password field when server returns 403', async () => {
      mockChangePassword.mockRejectedValueOnce(makeAxiosError(403, 'Wrong password'))
      const user = userEvent.setup()
      await user.type(screen.getByLabelText(/current password/i), 'huntsauron123')
      await user.type(screen.getByLabelText(/^new password/i), 'ringsofpower1')
      await user.type(screen.getByLabelText(/confirm new password/i), 'ringsofpower1')
      await user.click(screen.getByRole('button', { name: /change password/i }))
      expect(screen.getByText('Wrong password')).toBeInTheDocument()
      expect(screen.getByLabelText(/current password/i)).toHaveAttribute('aria-invalid', 'true')
    })

    it('shows server error message for non-403 errors', async () => {
      mockChangePassword.mockRejectedValueOnce(makeAxiosError(500, 'Server error'))
      const user = userEvent.setup()
      await user.type(screen.getByLabelText(/current password/i), 'huntsauron123')
      await user.type(screen.getByLabelText(/^new password/i), 'ringsofpower1')
      await user.type(screen.getByLabelText(/confirm new password/i), 'ringsofpower1')
      await user.click(screen.getByRole('button', { name: /change password/i }))
      expect(screen.getByText('Server error')).toBeInTheDocument()
    })

    it('shows fallback error message for non-Axios errors', async () => {
      mockChangePassword.mockRejectedValueOnce(new Error('Network failure'))
      const user = userEvent.setup()
      await user.type(screen.getByLabelText(/current password/i), 'huntsauron123')
      await user.type(screen.getByLabelText(/^new password/i), 'ringsofpower1')
      await user.type(screen.getByLabelText(/confirm new password/i), 'ringsofpower1')
      await user.click(screen.getByRole('button', { name: /change password/i }))
      expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument()
    })
  })
})
