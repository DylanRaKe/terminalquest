interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  animated?: boolean
}

export function Logo({ size = 'md', className = '', animated = true }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  }

  const sizeValue = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg 
        width={sizeValue[size]} 
        height={sizeValue[size]} 
        viewBox="0 0 64 64" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id={`terminalGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:'#1e293b', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#0f172a', stopOpacity:1}} />
          </linearGradient>
          
          <linearGradient id={`swordGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor:'#fbbf24', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor:'#f59e0b', stopOpacity:1}} />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle cx="32" cy="32" r="30" fill={`url(#terminalGradient-${size})`} stroke="#374151" strokeWidth="2"/>
        
        {/* Terminal window */}
        <rect x="8" y="12" width="48" height="32" rx="4" fill="#000000" stroke="#374151" strokeWidth="1"/>
        
        {/* Terminal header */}
        <rect x="8" y="12" width="48" height="8" rx="4" fill="#374151"/>
        
        {/* Terminal dots */}
        <circle cx="14" cy="16" r="1.5" fill="#ef4444"/>
        <circle cx="20" cy="16" r="1.5" fill="#fbbf24"/>
        <circle cx="26" cy="16" r="1.5" fill="#22c55e"/>
        
        {/* Terminal content */}
        <text x="12" y="28" fontFamily="monospace" fontSize="6" fill="#22c55e">$</text>
        <text x="16" y="28" fontFamily="monospace" fontSize="6" fill="#ffffff">quest</text>
        
        {/* Cursor */}
        <rect x="16" y="32" width="4" height="6" fill="#22c55e" opacity="0.8">
          {animated && (
            <animate attributeName="opacity" values="0.8;0;0.8" dur="1s" repeatCount="indefinite"/>
          )}
        </rect>
        
        {/* Épée simplifiée */}
        <g transform="translate(45, 20) rotate(45)">
          <rect x="-1" y="-8" width="2" height="12" fill={`url(#swordGradient-${size})`}/>
          <rect x="-3" y="3" width="6" height="1.5" fill="#92400e"/>
          <circle cx="0" cy="6" r="1.5" fill="#92400e"/>
        </g>
        
        {/* Symbole CLI */}
        <text x="32" y="54" fontFamily="monospace" fontSize="8" fill="#fbbf24" textAnchor="middle">{'>'}</text>
      </svg>
    </div>
  )
} 