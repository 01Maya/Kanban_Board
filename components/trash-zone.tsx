"use client"

import type React from "react"

import { useState } from "react"

interface TrashZoneProps {
  onDrop: () => void
  isDragActive: boolean
}

export function TrashZone({ onDrop, isDragActive }: TrashZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    onDrop()
  }

  if (!isDragActive) return null

  return (
    <div
     className={`fixed bottom-6 left-1/2 w-16 h-16 rounded-full border-2 border-dashed border-red-400 bg-red-50 
     flex items-center justify-center transition-all duration-200 z-50 
     transform -translate-x-1/2 ${
     isDragOver ? "border-red-600 bg-red-100 scale-110" : ""
     }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <span className="text-2xl">🗑️</span>
    </div>
  )
}
