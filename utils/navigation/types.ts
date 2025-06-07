export type NavButtonState = {
  id: string
  key: string
  role: 'page-title' | 'nav-item' | 'action-button' | 'back-button'
  content: {
    label: string
    icon?: 'back' | 'menu'
  }
  position: 'left' | 'center' | 'right'
  action: {
    type: 'navigate' | 'menu' | 'back' | 'none'
    href?: string
  }
  isActive?: boolean
}

export type MenuItem = {
  key: string
  path: string
  label: string
  excludeFrom?: string[]
}

export type SocialLink = {
  key: string
  url: string
  label: string
}
