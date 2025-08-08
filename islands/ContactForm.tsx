import { TextField } from '@components/TextField.tsx'
import { Button } from '@components/Button.tsx'

const validateEmail = (value: string) => {
  if (!value) return 'Email is required'
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Please enter a valid email address'
}

const validateRequired = (label: string) => (value: string) => {
  if (!value) return `${label} is required`
  return null
}

/**
 * ContactForm island component
 * Interactive contact form with validation and theme-aware styling
 * All form elements use theme-aware border radius and styling
 */
export default function ContactForm() {
  // Optionally, manage form state here if you want to handle submission
  // For now, just render the fields
  return (
    <div>
      <h2 class='text-3xl font-bold mb-6 text-[var(--colors-text-primary)]'>send us a message</h2>
      <form class='space-y-6'>
        <TextField
          label='Name'
          name='name'
          type='text'
          required
          validate={validateRequired('Name')}
        />
        <TextField
          label='Email'
          name='email'
          type='email'
          required
          validate={validateEmail}
        />
        <TextField
          label='Subject'
          name='subject'
          type='text'
          required
          validate={validateRequired('Subject')}
        />
        <TextField
          label='Message'
          name='message'
          textarea
          required
          validate={validateRequired('Message')}
          className='min-h-[80px]'
        />
        <Button type='submit' variant='primary' class='w-auto'>
          Send Message
        </Button>
      </form>
    </div>
  )
}
