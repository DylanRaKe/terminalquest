'use client'

import { useState, useEffect } from 'react'

export function useDebugMode(): boolean {
  const [isDebugMode, setIsDebugMode] = useState(false)

  useEffect(() => {
    // Vérifier si nous sommes côté client
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const debugParam = urlParams.get('debug')
      setIsDebugMode(debugParam === 'true')
    }
  }, [])

  return isDebugMode
} 