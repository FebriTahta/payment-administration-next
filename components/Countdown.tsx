'use client'

import { useState, useEffect } from 'react'

interface CountdownProps {
  expiryTime: string // ISO 8601 format
}

const Countdown: React.FC<CountdownProps> = ({ expiryTime }) => {
  const [timeLeft, setTimeLeft] = useState<string>('')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const expiry = new Date(expiryTime).getTime()
      const difference = expiry - now

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
      } else {
        setTimeLeft('Expired')
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [expiryTime])

  return (
    <div className="text-center">
      <p className="text-2xl font-bold">{timeLeft}</p>
      <p className="text-[9px]">Lakukan pembayaran sebelum waktu selesai</p>
    </div>
  )
}

export default Countdown

