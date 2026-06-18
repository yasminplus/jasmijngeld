import SignUpForm from "@/components/auth/SignupForm";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockPostSignup = vi.hoisted(() => vi.fn().mockResolvedValue(undefined))

vi.mock('@/services/signup', () => ({
    postSignupData: mockPostSignup,
  }))

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    Link: ({ to, children, ...props }: { to: string, children: React.ReactNode, [key: string]: unknown }) =>
      <a href={to} {...props}>{children}</a>,
  }
})

describe('SignupForm', () => {
  const onSuccess = vi.fn();

  beforeEach(() => {
    render (<SignUpForm onSuccess={onSuccess} />)
  })

  afterEach(() => {
    onSuccess.mockClear()
    mockPostSignup.mockClear()
  })

  describe('renders', () => {
    it('renders all the fields and submit button', () => {
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign up/i } )).toBeInTheDocument()
    })
  })

  describe('validation', () => {
    it('shows error when first name is shorter than 3 characters', async () => {
      const user = userEvent.setup()
      await user.type(screen.getByLabelText(/first name/i), 'Ga')
      await user.type(screen.getByLabelText(/email/i), 'galadriel@lorien.me')
      await user.type(screen.getByLabelText(/^password/i), 'huntsauron123')
      await user.type(screen.getByLabelText(/confirm password/i), 'huntsauron123')
      await user.click(screen.getByRole('button', { name: /sign up/i }))
      expect(screen.getByText(/3 characters/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/first name/i)).toHaveAttribute('aria-invalid', 'true')
    })

    it('does not show error when last name is empty', async () => {
      const user = userEvent.setup()
      await user.type(screen.getByLabelText(/first name/i), 'Galadriel')
      await user.type(screen.getByLabelText(/email/i), 'galadriel@lorien.me')
      await user.type(screen.getByLabelText(/^password/i), 'huntsauron123')
      await user.type(screen.getByLabelText(/confirm password/i), 'huntsauron123')
      await user.click(screen.getByRole('button', { name: /sign up/i }))
      expect(screen.getByLabelText(/last name/i)).not.toHaveAttribute('aria-invalid', 'true')
    })

    it('shows error when email is empty', async () => {
      const user = userEvent.setup()
      await user.type(screen.getByLabelText(/first name/i), 'Galadriel')
      await user.type(screen.getByLabelText(/^password/i), 'huntsauron123')
      await user.type(screen.getByLabelText(/confirm password/i), 'huntsauron123')
      await user.click(screen.getByRole('button', { name: /sign up/i }))
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-invalid', 'true')
    })

    it('shows error when email format is invalid', async () => {
      const user = userEvent.setup()
      await user.type(screen.getByLabelText(/first name/i), 'Galadriel')
      await user.type(screen.getByLabelText(/email/i), 'galadriel')
      await user.type(screen.getByLabelText(/^password/i), 'huntsauron123')
      await user.type(screen.getByLabelText(/confirm password/i), 'huntsauron123')
      await user.click(screen.getByRole('button', { name: /sign up/i }))
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-invalid', 'true')
    })

    it('shows error when password is too short', async () => {
      const user = userEvent.setup()
      await user.type(screen.getByLabelText(/first name/i), 'Galadriel')
      await user.type(screen.getByLabelText(/email/i), 'galadriel@lorien.me')
      await user.type(screen.getByLabelText(/^password/i), 'sauron')
      await user.type(screen.getByLabelText(/confirm password/i), 'huntsauron123')
      await user.click(screen.getByRole('button', { name: /sign up/i }))
      expect(screen.getByText(/8 characters/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^password/i)).toHaveAttribute('aria-invalid', 'true')
    })

    it('shows error when password and confirm password do not match', async () => {
      const user = userEvent.setup()
      await user.type(screen.getByLabelText(/first name/i), 'Galadriel')
      await user.type(screen.getByLabelText(/email/i), 'galadriel@lorien.me')
      await user.type(screen.getByLabelText(/^password/i), 'huntsauron123')
      await user.type(screen.getByLabelText(/confirm password/i), 'huntsauron')
      await user.click(screen.getByRole('button', { name: /sign up/i }))
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('on submit', () => {
    it('calls onSuccess when inputs are valid', async () => {
      mockPostSignup.mockResolvedValueOnce(undefined)     // redundant, kept for explicitness
      const user = userEvent.setup()
      await user.type(screen.getByLabelText(/first name/i), 'Galadriel')
      await user.type(screen.getByLabelText(/email/i), 'galadriel@lorien.me')
      await user.type(screen.getByLabelText(/^password/i), 'huntsauron123')
      await user.type(screen.getByLabelText(/confirm password/i), 'huntsauron123')
      await user.click(screen.getByRole('button', { name: /sign up/i }))
      expect(onSuccess).toHaveBeenCalledTimes(1)
    })

    it('shows error when email is already used', async () => {
      mockPostSignup.mockRejectedValueOnce({
        response: {
          data: {
            email: ['A user with that email already exists.']
          }
        }
      })
      const user = userEvent.setup()
      await user.type(screen.getByLabelText(/first name/i), 'Galadriel')
      await user.type(screen.getByLabelText(/email/i), 'galadriel@lorien.me')
      await user.type(screen.getByLabelText(/^password/i), 'huntsauron123')
      await user.type(screen.getByLabelText(/confirm password/i), 'huntsauron123')
      await user.click(screen.getByRole('button', { name: /sign up/i }))
      expect(onSuccess).not.toHaveBeenCalled()
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('aria-invalid', 'true')
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument()
    })
  })
})