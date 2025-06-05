'use client'

import { useState, useEffect, useMemo } from 'react'

export type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface Breakpoints {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  '2xl': number
}

const defaultBreakpoints: Breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
}

export function useResponsive(customBreakpoints?: Partial<Breakpoints>) {
  const breakpoints = useMemo(() => ({ ...defaultBreakpoints, ...customBreakpoints }), [customBreakpoints])
  
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768
  })

  const [currentBreakpoint, setCurrentBreakpoint] = useState<BreakpointKey>('lg')

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setWindowSize({ width, height })

      // Déterminer le breakpoint actuel
      if (width >= breakpoints['2xl']) {
        setCurrentBreakpoint('2xl')
      } else if (width >= breakpoints.xl) {
        setCurrentBreakpoint('xl')
      } else if (width >= breakpoints.lg) {
        setCurrentBreakpoint('lg')
      } else if (width >= breakpoints.md) {
        setCurrentBreakpoint('md')
      } else if (width >= breakpoints.sm) {
        setCurrentBreakpoint('sm')
      } else {
        setCurrentBreakpoint('xs')
      }
    }

    handleResize() // Appel initial
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoints])

  // Fonctions utilitaires
  const isMobile = currentBreakpoint === 'xs' || currentBreakpoint === 'sm'
  const isTablet = currentBreakpoint === 'md'
  const isDesktop = currentBreakpoint === 'lg' || currentBreakpoint === 'xl' || currentBreakpoint === '2xl'
  const isSmallScreen = isMobile || isTablet

  const isBreakpoint = (bp: BreakpointKey) => currentBreakpoint === bp
  const isBreakpointUp = (bp: BreakpointKey) => windowSize.width >= breakpoints[bp]
  const isBreakpointDown = (bp: BreakpointKey) => windowSize.width < breakpoints[bp]

  return {
    windowSize,
    currentBreakpoint,
    breakpoints,
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
    isBreakpoint,
    isBreakpointUp,
    isBreakpointDown
  }
}

// Hook pour la détection d'orientation
export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape')

  useEffect(() => {
    function handleOrientationChange() {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
    }

    handleOrientationChange() // Appel initial
    window.addEventListener('resize', handleOrientationChange)
    
    return () => window.removeEventListener('resize', handleOrientationChange)
  }, [])

  return {
    orientation,
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape'
  }
}

// Hook pour la détection de touch/mobile
export function useTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-expect-error - msMaxTouchPoints is IE specific
        navigator.msMaxTouchPoints > 0
      )
    }

    checkTouchDevice()
  }, [])

  return { isTouchDevice }
}

// Hook pour la préférence de mouvement réduit
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return { prefersReducedMotion }
}

// Hook pour le thème sombre/clair
export function useColorScheme() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setColorScheme(mediaQuery.matches ? 'dark' : 'light')

    const handleChange = (e: MediaQueryListEvent) => {
      setColorScheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return { 
    colorScheme,
    isDark: colorScheme === 'dark',
    isLight: colorScheme === 'light'
  }
} 