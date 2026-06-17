import LoginForm from "@/components/auth/LoginForm";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event'

const mockLogin = vi.hoisted(() => vi.fn())

vi.mock('@/context/auth', () => ({
  useAuthContext: () => ({
    login_i: mockLogin,
    isAuthenticated: false,
    user: null,
  }),
}))

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    Link: ({ to, children, ...props }: { to: string, children: React.ReactNode, [key: string]: unknown }) =>
      <a href={to} {...props}>{children}</a>,
  }
})


describe('LoginForm', () => {
  const onSuccess = vi.fn();
  beforeEach(() => {
    render(<LoginForm onSuccess={onSuccess} arrivalMessage=""/>)
  })

  afterEach(() => {
    onSuccess.mockClear()
    mockLogin.mockClear()
  })

  describe('renders', () => {
    it('renders the input fields and submit button', () => {
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Password')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /log in/i } )).toBeInTheDocument()
    })
  })

  describe('validation', () => {
    it('shows error when email is empty', async () => {
      const user = userEvent.setup()
      await user.click(screen.getByRole('button', { name: /log in/i }))
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    })

    it('shows error for invalid email format', async () => {
      const user = userEvent.setup()
      await user.type(screen.getByLabelText('Email'), 'notanemail')
      await user.click(screen.getByRole('button', { name: /log in/i }))
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    })
  
    it('shows error when password is too short', async () => {
      const user = userEvent.setup()
      await user.type(screen.getByLabelText('Email'), 'valid@email.com')
      await user.type(screen.getByLabelText('Password'), 'short')
      await user.click(screen.getByRole('button', { name: /log in/i }))
      expect(screen.getByText(/8 characters/)).toBeInTheDocument()
      screen.debug()
    })
  })

  describe('on submit', () => {
    it('calls onSuccess when inputs are valid', async () => {
      mockLogin.mockResolvedValueOnce(undefined)
      const user = userEvent.setup()
      await user.type(screen.getByLabelText('Email'), 'valid@email.com')
      await user.type(screen.getByLabelText('Password'), 'password1')
      await user.click(screen.getByRole('button', { name: /log in/i }))
      expect(onSuccess).toHaveBeenCalledTimes(1)
    })

    it('shows error message when login fails', async () => {
      mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'))
      const user = userEvent.setup()
      await user.type(screen.getByLabelText('Email'), 'valid@email.com')
      await user.type(screen.getByLabelText('Password'), 'password1')
      await user.click(screen.getByRole('button', { name: /log in/i }))
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })

    it('does not call onSuccess when inputs are invalid', async () => {
      const user = userEvent.setup()
      await user.type(screen.getByLabelText('Email'), 'notanemail')
      await user.click(screen.getByRole('button', { name: /log in/i }))
      expect(onSuccess).not.toHaveBeenCalled()
    })

    it('clears server error on successful resubmit', async () => {
      mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'))
      mockLogin.mockResolvedValueOnce(undefined)
      const user = userEvent.setup()
      await user.type(screen.getByLabelText('Email'), 'valid@email.com')
      await user.type(screen.getByLabelText('Password'), 'password1')
      await user.click(screen.getByRole('button', { name: /log in/i }))
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: /log in/i }))
      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument()
    })
  })
})