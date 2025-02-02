'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Star {
  id: number
  x: number
  size: number
  duration: number
  color: string
}

const COLORS = ['#18CCFC', '#6344F5', '#AE48FF']

export const Starfall: React.FC<{ className?: string }> = ({ className }) => {
  const [stars, setStars] = useState<Star[]>([])

  // Generate stars on mount
  useEffect(() => {
    const generateStars = () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 6 + 1,
        duration: Math.random() * 4 + 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }))
    setStars(generateStars())
  }, [])

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            width: star.size, // tebal bintang jatauh
            height: 15, // panjang bintang jatuh
            background: `radial-gradient(circle at center, ${star.color}, transparent)`,
          }}
          initial={{ y: -10, opacity: 1 }}
          animate={{ y: '100vh', opacity: 0 }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}
