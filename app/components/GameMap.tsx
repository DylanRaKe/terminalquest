'use client'

import { motion } from 'framer-motion'
import { useGameStore } from '../stores/gameStore'
import { MapPin, Crown, TreePine, Home, Castle } from 'lucide-react'

export function GameMap() {
  const { currentLocation, locations } = useGameStore()

  const getLocationIcon = (locationId: string) => {
    switch (locationId) {
      case 'village':
        return <Home className="w-6 h-6" />
      case 'foret':
        return <TreePine className="w-6 h-6" />
      case 'donjon':
        return <Castle className="w-6 h-6" />
      case 'chateau':
        return <Crown className="w-6 h-6" />
      default:
        return <MapPin className="w-6 h-6" />
    }
  }

  const getLocationColor = (locationId: string, isCurrent: boolean) => {
    if (isCurrent) return 'bg-yellow-500 text-black'
    
    switch (locationId) {
      case 'village':
        return 'bg-green-600 text-white'
      case 'foret':
        return 'bg-emerald-700 text-white'
      case 'donjon':
        return 'bg-red-700 text-white'
      case 'chateau':
        return 'bg-purple-700 text-white'
      default:
        return 'bg-gray-600 text-white'
    }
  }

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30">
      <h3 className="text-lg font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        🗺️ Carte du Monde
      </h3>
      
      <div className="relative w-full h-64 bg-gradient-to-br from-green-900/30 to-blue-900/30 rounded-lg border border-green-500/20 overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-4 grid-rows-3 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border border-gray-600/30" />
            ))}
          </div>
        </div>

        {/* Locations */}
        {locations.map((location) => {
          const isCurrent = location.id === currentLocation
          const x = (location.x / 3) * 100
          const y = (location.y / 2) * 100

          return (
            <motion.div
              key={location.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${getLocationColor(
                location.id,
                isCurrent
              )} rounded-full p-3 shadow-lg cursor-pointer transition-all duration-200`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
              title={location.name}
            >
              {getLocationIcon(location.id)}
              
              {isCurrent && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-yellow-400 rounded-full opacity-30"
                />
              )}
            </motion.div>
          )
        })}

        {/* Paths between locations */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          
          {/* Village to Forest */}
          <line
            x1="66.67%" y1="100%"
            x2="33.33%" y2="50%"
            stroke="url(#pathGradient)"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          
          {/* Village to Dungeon */}
          <line
            x1="66.67%" y1="100%"
            x2="100%" y2="50%"
            stroke="url(#pathGradient)"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          
          {/* Forest to Castle */}
          <line
            x1="33.33%" y1="50%"
            x2="66.67%" y2="0%"
            stroke="url(#pathGradient)"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          
          {/* Dungeon to Castle */}
          <line
            x1="100%" y1="50%"
            x2="66.67%" y2="0%"
            stroke="url(#pathGradient)"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        </svg>
      </div>

      {/* Current location info */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-300">Position actuelle :</p>
        <p className="font-bold text-yellow-400">
          {locations.find(loc => loc.id === currentLocation)?.name}
        </p>
      </div>
    </div>
  )
} 