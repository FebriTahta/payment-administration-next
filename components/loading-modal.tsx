'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Loader2 } from 'lucide-react'
import { DialogTitle } from '@radix-ui/react-dialog'

interface LoadingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoadingModal({ isOpen, onClose }: LoadingModalProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(timer)
            onClose()
            return 100
          }
          return prevProgress + 10
        })
      }, 500)

      return () => {
        clearInterval(timer)
      }
    }
  }, [isOpen, onClose])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle></DialogTitle>
        <div className="flex flex-col items-center justify-center p-4">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p className="text-lg font-semibold mb-2">Loading...</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="mt-2">{progress}%</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

