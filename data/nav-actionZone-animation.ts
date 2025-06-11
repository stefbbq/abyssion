import { animationStyleFunctions, easeInEasing } from '@lib/utils/actionZoneAnimationStyles.ts'
import type { ActionZoneAnimationConfig } from './types.ts'

const actionZoneAnimationConfig: ActionZoneAnimationConfig = {
  collapsedDefault: {
    default: {
      buttons: [
        {
          id: 'shows',
          key: 'shows',
          role: 'nav-item',
          content: { label: 'Shows' },
          position: 'left',
          action: { type: 'navigate', href: '/shows' },
        },
        {
          id: 'contact',
          key: 'contact',
          role: 'nav-item',
          content: { label: 'Contact' },
          position: 'center',
          action: { type: 'navigate', href: '/contact' },
        },
        {
          id: 'menu',
          key: 'menu',
          role: 'action-button',
          content: { label: 'Menu', icon: 'menu' },
          position: 'right',
          action: { type: 'menu' },
        },
      ],
      animation: { type: 'spring', duration: 0.4, easing: easeInEasing },
      layout: {
        height: animationStyleFunctions.getCollapsedHeight,
        borderRadius: animationStyleFunctions.getCollapsedBorderRadius,
      },
    },
    '/shows': {
      buttons: [
        {
          id: 'back-button',
          key: 'back',
          role: 'back-button',
          content: { label: 'Back', icon: 'back' },
          position: 'left',
          action: { type: 'back' },
        },
        {
          id: 'shows',
          key: 'page-title',
          role: 'page-title',
          content: { label: 'Shows' },
          position: 'center',
          action: { type: 'none' },
        },
        {
          id: 'menu',
          key: 'menu',
          role: 'action-button',
          content: { label: 'Menu', icon: 'menu' },
          position: 'right',
          action: { type: 'menu' },
        },
      ],
      animation: { type: 'spring', duration: 0.4, easing: easeInEasing },
      layout: {
        height: animationStyleFunctions.getCollapsedHeight,
        borderRadius: animationStyleFunctions.getCollapsedBorderRadius,
      },
    },
    '/contact': {
      buttons: [
        {
          id: 'back-button',
          key: 'back',
          role: 'back-button',
          content: { label: 'Back', icon: 'back' },
          position: 'left',
          action: { type: 'back' },
        },
        {
          id: 'contact',
          key: 'page-title',
          role: 'page-title',
          content: { label: 'Contact' },
          position: 'center',
          action: { type: 'none' },
        },
        {
          id: 'menu',
          key: 'menu',
          role: 'action-button',
          content: { label: 'Menu', icon: 'menu' },
          position: 'right',
          action: { type: 'menu' },
        },
      ],
      animation: { type: 'spring', duration: 0.4, easing: easeInEasing },
      layout: {
        height: animationStyleFunctions.getCollapsedHeight,
        borderRadius: animationStyleFunctions.getCollapsedBorderRadius,
      },
    },
  },
  collapsedBack: {
    default: {
      buttons: [
        {
          id: 'back-button',
          key: 'back',
          role: 'back-button',
          content: { label: 'Back', icon: 'back' },
          position: 'left',
          action: { type: 'back' },
        },
        {
          id: 'page-title',
          key: 'page-title',
          role: 'page-title',
          content: { label: '' },
          position: 'center',
          action: { type: 'none' },
        },
        {
          id: 'menu',
          key: 'menu',
          role: 'action-button',
          content: { label: 'Menu', icon: 'menu' },
          position: 'right',
          action: { type: 'menu' },
        },
      ],
      animation: { type: 'spring', duration: 0.4, easing: easeInEasing },
      layout: {
        height: animationStyleFunctions.getCollapsedHeight,
        borderRadius: animationStyleFunctions.getCollapsedBorderRadius,
      },
    },
  },
  expandedMenu: {
    default: {
      animation: { type: 'tween', duration: 0.5, easing: 'easeInOut' },
      layout: {
        height: animationStyleFunctions.getExpandedHeight,
        borderRadius: animationStyleFunctions.getExpandedBorderRadius,
      },
    },
  },
}

export default actionZoneAnimationConfig
