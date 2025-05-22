"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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

  const handleSignUp = () => {
    router.push("/sign-up");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border border-gray-200 shadow-lg">
        <DialogClose className="absolute right-4 top-4 rounded-full w-6 h-6 flex items-center justify-center z-10 bg-[#d62839] text-white hover:bg-[#a31e36] focus:outline-none transition-colors">
          <X className="h-4 w-4 text-white" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <DialogHeader className="bg-[#003B71] text-white px-6 py-4 -mx-6 -mt-6 rounded-t-lg">
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-gray-200 mt-1">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-3 py-4">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
            <p className="text-sm text-blue-700">
              Only Queen's University students with a valid @queensu.ca email address can access this feature.
            </p>
          </div>
        </div>
        <DialogFooter className="sm:justify-between flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-gray-300 text-gray-700"
          >
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleSignUp}
              className="border-[#003B71] text-[#003B71]"
            >
              Sign Up
            </Button>
            <Button 
              onClick={handleSignIn}
              className="bg-[#d62839] hover:bg-[#a31e36] text-white"
            >
              Sign In
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 