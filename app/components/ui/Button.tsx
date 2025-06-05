'use client'

import { forwardRef, ButtonHTMLAttributes } from 'react'
import { motion, MotionProps } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useResponsive'

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragOver' | 'onDrop' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  motionProps?: MotionProps
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    className = '',
    motionProps,
    ...props
  }, ref) => {
    const { prefersReducedMotion } = useReducedMotion()

    const baseClasses = [
      'inline-flex items-center justify-center gap-2',
      'font-medium rounded-lg transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'select-none'
    ]

    const variantClasses = {
      primary: [
        'bg-gradient-to-r from-blue-500 to-purple-600',
        'hover:from-blue-600 hover:to-purple-700',
        'text-white shadow-lg hover:shadow-xl',
        'focus:ring-blue-500'
      ],
      secondary: [
        'bg-gray-700 hover:bg-gray-600',
        'text-white border border-gray-600',
        'focus:ring-gray-500'
      ],
      ghost: [
        'bg-transparent hover:bg-white/10',
        'text-gray-300 hover:text-white',
        'focus:ring-gray-400'
      ],
      danger: [
        'bg-gradient-to-r from-red-500 to-red-600',
        'hover:from-red-600 hover:to-red-700',
        'text-white shadow-lg hover:shadow-xl',
        'focus:ring-red-500'
      ]
    }

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    }

    const classes = [
      ...baseClasses,
      ...variantClasses[variant],
      sizeClasses[size],
      fullWidth ? 'w-full' : '',
      className
    ].filter(Boolean).join(' ')

    const defaultMotionProps: MotionProps = prefersReducedMotion ? {} : {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
      transition: { duration: 0.1 }
    }

    const combinedMotionProps = { ...defaultMotionProps, ...motionProps }

    return (
      <motion.button
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        {...combinedMotionProps}
        {...props}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : leftIcon}
        
        {children}
        
        {!isLoading && rightIcon}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export { Button } 