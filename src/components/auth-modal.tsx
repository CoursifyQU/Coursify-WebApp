"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function AuthModal({
  isOpen,
  onClose,
  title = "Authentication Required",
  description = "You need to sign in with your Queen's University account to access this feature."
}: AuthModalProps) {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/sign-in");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-0 relative border border-gray-200 overflow-hidden"
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-[#d62839] text-2xl font-bold z-10"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
            
            <div className="bg-[#00305f] text-white p-6">
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="mt-1 text-gray-200">{description}</p>
            </div>
            
            <div className="p-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-6">
                <p className="text-blue-700">
                  Only Queen's University students with a valid @queensu.ca email address can access this feature.
                </p>
              </div>
              
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleSignIn}
                  className="px-8 py-3 bg-[#d62839] text-white rounded-lg font-medium hover:bg-[#a31e36] transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Sign In
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 