"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface FloatingElement {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  color: string
  shape: "circle" | "square" | "triangle" | "star"
}

export const FloatingElements = () => {
  const [elements, setElements] = useState<FloatingElement[]>([])

  useEffect(() => {
    // Generate random floating elements
    const shapes = ["circle", "square", "triangle", "star"]
    const colors = ["#00305f", "#d62839", "#efb215"]

    const newElements: FloatingElement[] = []

    for (let i = 0; i < 15; i++) {
      newElements.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 5,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)] as "circle" | "square" | "triangle" | "star",
      })
    }

    setElements(newElements)
  }, [])

  const renderShape = (element: FloatingElement) => {
    switch (element.shape) {
      case "circle":
        return (
          <div
            className="rounded-full"
            style={{
              width: element.size,
              height: element.size,
              backgroundColor: `${element.color}10`,
              border: `1px solid ${element.color}30`,
            }}
          />
        )
      case "square":
        return (
          <div
            className="rounded-md"
            style={{
              width: element.size,
              height: element.size,
              backgroundColor: `${element.color}10`,
              border: `1px solid ${element.color}30`,
              transform: `rotate(${Math.random() * 45}deg)`,
            }}
          />
        )
      case "triangle":
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${element.size / 2}px solid transparent`,
              borderRight: `${element.size / 2}px solid transparent`,
              borderBottom: `${element.size}px solid ${element.color}20`,
            }}
          />
        )
      case "star":
        return (
          <div
            className="text-center"
            style={{
              color: `${element.color}30`,
              fontSize: element.size,
            }}
          >
            ★
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute"
          initial={{
            x: `${element.x}%`,
            y: `${element.y}%`,
            opacity: 0,
          }}
          animate={{
            x: [`${element.x}%`, `${element.x + (Math.random() * 20 - 10)}%`],
            y: [`${element.y}%`, `${element.y + (Math.random() * 20 - 10)}%`],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: element.duration,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: element.delay,
          }}
        >
          {renderShape(element)}
        </motion.div>
      ))}
    </div>
  )
}
