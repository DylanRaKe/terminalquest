'use client'

import { forwardRef, HTMLAttributes } from 'react'
import { motion, MotionProps } from 'framer-motion'
import { useReducedMotion, useResponsive } from '../../hooks/useResponsive'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  interactive?: boolean
  motionProps?: MotionProps
  as?: 'div' | 'article' | 'section'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({
    children,
    variant = 'default',
    padding = 'md',
    interactive = false,
    className = '',
    motionProps,
    as: Component = 'div',
    ...props
  }, ref) => {
    const { prefersReducedMotion } = useReducedMotion()
    const { isMobile } = useResponsive()

    const baseClasses = [
      'rounded-2xl transition-all duration-200',
      'focus-within:outline-none',
      interactive ? 'cursor-pointer' : ''
    ]

    const variantClasses = {
      default: [
        'bg-black/50 backdrop-blur-lg',
        'border border-gray-700/50',
        interactive ? 'hover:border-gray-600/50 hover:bg-black/60' : ''
      ],
      elevated: [
        'bg-black/60 backdrop-blur-lg',
        'border border-gray-600/30',
        'shadow-xl shadow-black/20',
        interactive ? 'hover:shadow-2xl hover:shadow-black/30 hover:border-gray-500/40' : ''
      ],
      outlined: [
        'bg-transparent',
        'border-2 border-gray-600',
        interactive ? 'hover:border-gray-500 hover:bg-white/5' : ''
      ],
      ghost: [
        'bg-transparent',
        'border-0',
        interactive ? 'hover:bg-white/5' : ''
      ]
    }

    const paddingClasses = {
      none: '',
      sm: isMobile ? 'p-3' : 'p-4',
      md: isMobile ? 'p-4' : 'p-6',
      lg: isMobile ? 'p-6' : 'p-8',
      xl: isMobile ? 'p-8' : 'p-12'
    }

    const classes = [
      ...baseClasses,
      ...variantClasses[variant],
      paddingClasses[padding],
      className
    ].filter(Boolean).join(' ')

    const defaultMotionProps: MotionProps = prefersReducedMotion ? {} : {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
      ...(interactive && {
        whileHover: { scale: 1.02, y: -4 },
        whileTap: { scale: 0.98 }
      })
    }

    const combinedMotionProps = { ...defaultMotionProps, ...motionProps }

    const MotionComponent = motion(Component)

    return (
      <MotionComponent
        ref={ref}
        className={classes}
        {...combinedMotionProps}
        {...props}
      >
        {children}
      </MotionComponent>
    )
  }
)

Card.displayName = 'Card'

export { Card } 