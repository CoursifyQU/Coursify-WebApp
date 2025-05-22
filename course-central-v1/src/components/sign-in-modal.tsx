"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: () => void
  onSignUp: () => void
}

export function SignInModal({ isOpen, onClose, onLogin, onSignUp }: SignInModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 z-50"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#00305f]/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-[#00305f]" />
          </div>

          <h2 className="text-2xl font-bold text-[#00305f] mb-2">Sign in required</h2>

          <p className="text-gray-600 mb-6">
            Please log in to upload course distributions. Your contributions help other students make informed
            decisions!
          </p>

          <div className="flex flex-col sm:flex-row w-full gap-3 mb-4">
            <Button onClick={onLogin} className="w-full bg-[#00305f] hover:bg-[#00305f]/90">
              Log in
            </Button>
            <Button onClick={onSignUp} className="w-full bg-[#d62839] hover:bg-[#d62839]/90">
              Sign up
            </Button>
          </div>

          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-sm font-medium">
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  )
}
