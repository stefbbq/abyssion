type Props = {
  visible: boolean // whether the debug info is visible
  content: string // the html content to display
}

/**
 * debug information display component
 * renders at bottom-left with theme-aware styling and border radius
 */
export const DebugInfo = (props: Props) => {
  if (!props.visible || !props.content) return null

  return (
    <div
      className='fixed bottom-4 left-4 glass-effect rounded-theme-lg p-3 font-mono text-xs text-text-primary max-w-md max-h-96 overflow-auto z-50'
      // deno-lint-ignore react-no-danger
      dangerouslySetInnerHTML={{ __html: props.content }}
    />
  )
}
