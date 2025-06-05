'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '../hooks/useResponsive'

interface ProgressBarProps {
  progress: number // 0-100
  color?: string
  backgroundColor?: string
  height?: number
  showPercentage?: boolean
  animated?: boolean
  className?: string
  label?: string
}

export function ProgressBar({
  progress,
  color = '#3B82F6',
  backgroundColor = '#374151',
  height = 8,
  showPercentage = false,
  animated = true,
  className = '',
  label
}: ProgressBarProps) {
  const { prefersReducedMotion } = useReducedMotion()
  const shouldAnimate = animated && !prefersReducedMotion

  const clampedProgress = Math.min(100, Math.max(0, progress))

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-300">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-400">{Math.round(clampedProgress)}%</span>
          )}
        </div>
      )}
      
      <div
        className="relative overflow-hidden rounded-full"
        style={{ 
          height: `${height}px`,
          backgroundColor 
        }}
      >
        <motion.div
          className="h-full rounded-full relative"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={shouldAnimate ? {
            duration: 0.8,
            ease: "easeOut"
          } : { duration: 0 }}
        >
          {/* Effet de brillance */}
          {shouldAnimate && clampedProgress > 0 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 2
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  )
} 