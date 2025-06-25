import { ActionZoneContainer } from './ActionZoneContainer.tsx'
import { ActionZoneButton } from './ActionZoneButton.tsx'
import { ActionZoneMenuButton } from './ActionZoneMenuButton.tsx'
import { SocialLinks } from '@molecules/SocialLinks.tsx'
import type { ComponentType } from 'preact'

type ActionZoneComponentType = 'container' | 'button' | 'menuButton' | 'socialLinks'

// Maps ActionZone config node types to their corresponding components
// deno-lint-ignore no-explicit-any
export const componentMap: Record<ActionZoneComponentType, ComponentType<any>> = {
  container: ActionZoneContainer,
  button: ActionZoneButton,
  menuButton: ActionZoneMenuButton,
  socialLinks: SocialLinks,
}
