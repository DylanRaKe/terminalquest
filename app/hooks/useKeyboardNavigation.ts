'use client'

import { useEffect, useCallback, useRef, useState } from 'react'

interface KeyboardNavigationOptions {
  enableArrowKeys?: boolean
  enableTabNavigation?: boolean
  enableEscapeKey?: boolean
  enableEnterKey?: boolean
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onEscape?: () => void
  onEnter?: () => void
  onTab?: (shift: boolean) => void
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions = {}) {
  const {
    enableArrowKeys = true,
    enableTabNavigation = true,
    enableEscapeKey = true,
    enableEnterKey = true,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onEscape,
    onEnter,
    onTab
  } = options

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignorer si l'utilisateur tape dans un input/textarea
    const target = event.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      return
    }

    switch (event.key) {
      case 'ArrowUp':
        if (enableArrowKeys && onArrowUp) {
          event.preventDefault()
          onArrowUp()
        }
        break
      case 'ArrowDown':
        if (enableArrowKeys && onArrowDown) {
          event.preventDefault()
          onArrowDown()
        }
        break
      case 'ArrowLeft':
        if (enableArrowKeys && onArrowLeft) {
          event.preventDefault()
          onArrowLeft()
        }
        break
      case 'ArrowRight':
        if (enableArrowKeys && onArrowRight) {
          event.preventDefault()
          onArrowRight()
        }
        break
      case 'Escape':
        if (enableEscapeKey && onEscape) {
          event.preventDefault()
          onEscape()
        }
        break
      case 'Enter':
        if (enableEnterKey && onEnter) {
          event.preventDefault()
          onEnter()
        }
        break
      case 'Tab':
        if (enableTabNavigation && onTab) {
          event.preventDefault()
          onTab(event.shiftKey)
        }
        break
    }
  }, [enableArrowKeys, enableTabNavigation, enableEscapeKey, enableEnterKey, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onEscape, onEnter, onTab])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

// Hook pour la navigation dans une liste d'éléments
export function useListNavigation<T>(
  items: T[],
  onSelect?: (item: T, index: number) => void,
  initialIndex: number = -1
) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const itemsRef = useRef(items)
  const onSelectRef = useRef(onSelect)
  
  // Mettre à jour les refs sans causer de re-render
  useEffect(() => {
    itemsRef.current = items
    onSelectRef.current = onSelect
  }, [items, onSelect])

  const navigateUp = useCallback(() => {
    if (itemsRef.current.length === 0) return
    setCurrentIndex((prev: number) => {
      const newIndex = prev <= 0 ? itemsRef.current.length - 1 : prev - 1
      return newIndex
    })
  }, [])

  const navigateDown = useCallback(() => {
    if (itemsRef.current.length === 0) return
    setCurrentIndex((prev: number) => {
      const newIndex = prev >= itemsRef.current.length - 1 ? 0 : prev + 1
      return newIndex
    })
  }, [])

  const selectCurrent = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < itemsRef.current.length && onSelectRef.current) {
      onSelectRef.current(itemsRef.current[currentIndex], currentIndex)
    }
  }, [currentIndex])

  useKeyboardNavigation({
    onArrowUp: navigateUp,
    onArrowDown: navigateDown,
    onEnter: selectCurrent
  })

  return {
    currentIndex,
    setCurrentIndex,
    navigateUp,
    navigateDown,
    selectCurrent
  }
}

// Hook pour la gestion du focus
export function useFocusManagement() {
  const focusableElementsSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  
  const getFocusableElements = useCallback((container?: HTMLElement) => {
    const root = container || document
    return Array.from(root.querySelectorAll(focusableElementsSelector)) as HTMLElement[]
  }, [])

  const focusFirst = useCallback((container?: HTMLElement) => {
    const elements = getFocusableElements(container)
    if (elements.length > 0) {
      elements[0].focus()
    }
  }, [getFocusableElements])

  const focusLast = useCallback((container?: HTMLElement) => {
    const elements = getFocusableElements(container)
    if (elements.length > 0) {
      elements[elements.length - 1].focus()
    }
  }, [getFocusableElements])

  const trapFocus = useCallback((container: HTMLElement) => {
    const elements = getFocusableElements(container)
    if (elements.length === 0) return

    const firstElement = elements[0]
    const lastElement = elements[elements.length - 1]

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [getFocusableElements])

  return {
    getFocusableElements,
    focusFirst,
    focusLast,
    trapFocus
  }
} 