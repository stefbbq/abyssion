import { useEffect } from 'preact/hooks'

import { Toggle } from '@components/Toggle.tsx'
import { TextField } from '@components/TextField.tsx'
import { InlineMarkdown } from '@components/InlineMarkdown.tsx'
import { Button } from '@components/Button.tsx'
import Snackbar from '@components/Snackbar.tsx'

type FormField = { type: string; name: string; required?: boolean; rows?: number; labelKey?: string; label?: string }
type FormToggle = { name: string; required?: boolean; labelKey?: string; label?: string }
export type FormConfig = { id: string; action: string; method: string; fields: FormField[]; toggles?: FormToggle[] }

type Props = { config: FormConfig; labels: Record<string, unknown>; errors?: Record<string, string> }

/**
 * form manager + renderer
 * renders the auditions form from json schema and handles blur/input to mark fields as touched
 * so CSS can show invalid highlights immediately. works with fresh partials.
 *
 * @param config form config json schema
 * @param labels form labels json schema
 * @param errors form errors json schema
 * @returns jsx from
 *
 * @example
 *   import FormManager from '@islands/FormManager.tsx'
 *   <FormManager config={config} labels={labels} errors={errors} />
 */
export default function FormManager({ config, labels, errors }: Props) {
  const id = config.id

  useEffect(() => {
    const form = document.getElementById(id) as HTMLFormElement | null
    if (!form) return

    const markTouched = (e: Event) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      if (target.matches && target.matches('input, textarea')) target.setAttribute('data-touched', 'true')
      updateValidity()
    }

    const updateValidity = () => {
      // compute validity more explicitly to avoid edge cases
      const controls = Array.from(form.querySelectorAll('input[required], textarea[required]')) as Array<HTMLInputElement | HTMLTextAreaElement>
      let isValid = true
      for (const el of controls) {
        // use native API first
        if (typeof el.checkValidity === 'function') {
          if (!el.checkValidity()) {
            isValid = false
            break
          }
        } else {
          // basic fallback
          if (el instanceof HTMLInputElement && el.type === 'checkbox') {
            if (!el.checked) {
              isValid = false
              break
            }
          } else if (!el.value || !el.value.trim()) {
            isValid = false
            break
          }
        }
      }
      form.setAttribute('data-valid', isValid ? 'true' : 'false')
    }

    // initial validity after a tick in case the browser hasn't hydrated values yet
    requestAnimationFrame(updateValidity)

    form.addEventListener('blur', markTouched, true)
    form.addEventListener('input', markTouched, true)
    form.addEventListener('change', markTouched, true)

    return () => {
      form.removeEventListener('blur', markTouched, true)
      form.removeEventListener('input', markTouched, true)
      form.removeEventListener('change', markTouched, true)
    }
  }, [id])

  const resolveLabel = (labelKey?: string, fallback?: string): string => {
    if (!labelKey && fallback) return fallback
    if (!labelKey) return ''
    const keys = labelKey.split('.')
    let node: unknown = labels

    for (const k of keys) {
      if (typeof node !== 'object' || node === null) return ''
      node = (node as Record<string, unknown>)[k]
    }

    return typeof node === 'string' ? node : fallback || ''
  }

  return (
    <form
      id={id}
      method={config.method}
      action={config.action}
      {...(((config.method || 'GET').toUpperCase() === 'GET') ? { 'f-partial': config.action } : {})}
      class='form-requires-valid mt-8 space-y-6'
    >
      {errors?._form && <Snackbar message={errors._form} variant='error' />}
      <div class='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {config.fields.map((field) => {
          const fieldLabel = resolveLabel(field.labelKey, field.label)
          const hasError = Boolean(errors && errors[field.name])

          // inline toggle/checkbox support
          if (field.type === 'toggle' || field.type === 'checkbox') {
            return (
              <div key={field.name} class='md:col-span-2'>
                <Toggle
                  name={field.name}
                  labelNode={<InlineMarkdown as='span'>{String(fieldLabel)}</InlineMarkdown>}
                  error={errors && errors[field.name] ? errors[field.name] : null}
                  required={!!field.required}
                />
              </div>
            )
          }

          const isTextarea = field.type === 'textarea'
          return (
            <div key={field.name} class={isTextarea ? 'md:col-span-2' : ''}>
              <TextField
                label={fieldLabel}
                name={field.name}
                type={isTextarea ? undefined : (field.type === 'text' ? 'text' : field.type)}
                textarea={isTextarea}
                rows={isTextarea ? (field.rows || 4) : undefined}
                required={!!field.required}
                className={hasError ? 'border-error' : ''}
              />
            </div>
          )
        })}
      </div>

      {config.toggles && config.toggles.length > 0 && (
        <div class='space-y-2'>
          <h2 class='text-sm text-[var(--colors-text-secondary)]'>{String(resolveLabel('confirmRequirementsHeading'))}</h2>
          <div class='grid grid-cols-1 gap-2'>
            {config.toggles.map((t) => (
              <Toggle
                key={t.name}
                name={t.name}
                labelNode={<InlineMarkdown as='span'>{String(resolveLabel(t.labelKey, t.label))}</InlineMarkdown>}
                error={errors && errors[t.name] ? errors[t.name] : null}
                required={!!t.required}
              />
            ))}
          </div>
        </div>
      )}

      <div class='pt-2'>
        <div class='flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4'>
          <div data-show-when-invalid class='inline-block'>
            <Button hoverReveal type='submit' variant='primary' size='md' class='h-12' disabled>{String(labels.submitLabel)}</Button>
          </div>
          <div data-requires-valid class='inline-block'>
            <Button hoverReveal type='submit' variant='primary' size='md' class='h-12'>{String(labels.submitLabel)}</Button>
          </div>
          {Boolean(labels.submitNote) && <div class='text-xs md:mt-0 mt-2 text-[var(--colors-text-tertiary)]'>{String(labels.submitNote)}</div>}
        </div>
      </div>
    </form>
  )
}
