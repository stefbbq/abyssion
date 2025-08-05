type Props = {
  visible: boolean // whether the video debug info is visible
  content: string // the html content to display
}

/**
 * video debug information display component
 * renders in a flex container with theme-aware styling and border radius
 * specifically for video background debugging
 */
export const VideoDebugInfo = (props: Props) => {
  if (!props.visible || !props.content) return null

  return (
    <div
      className='bg-black/80 backdrop-blur-sm border border-accent/30 rounded-theme-lg p-3 font-mono text-xs text-text-primary max-w-md overflow-auto'
      // deno-lint-ignore react-no-danger
      dangerouslySetInnerHTML={{ __html: props.content }}
    />
  )
}
