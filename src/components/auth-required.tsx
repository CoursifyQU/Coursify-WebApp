"use client";

import { ReactNode, useEffect, useState } from "react";
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
import { useAuth } from "@/lib/auth/auth-context";
import { X } from "lucide-react";

type AuthRequiredProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

export default function AuthRequired({ 
  children, 
  fallback 
}: AuthRequiredProps) {
  const { user, isLoading } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Only show dialog if not loading and no user
    if (!isLoading && !user) {
      setShowAuthDialog(true);
    } else {
      setShowAuthDialog(false);
    }
  }, [user, isLoading]);

  if (isLoading) {
    // Loading state
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-brand-navy/20 dark:border-blue-400/20 border-t-brand-navy dark:border-t-blue-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    // If user is not authenticated, show auth dialog or fallback
    return (
      <>
        {fallback || (
          <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200 shadow-md">
            <div className="w-16 h-16 bg-brand-navy/10 dark:bg-blue-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-brand-navy dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8m10-6a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-brand-navy dark:text-white mb-2">Authentication Required</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You need to be signed in with your Queen's University account to access this feature.
            </p>
            <Button
              onClick={() => setShowAuthDialog(true)}
              className="bg-brand-red hover:bg-[#a31e36] text-white"
            >
              Sign in
            </Button>
          </div>
        )}

        <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
          <DialogContent className="sm:max-w-md p-0 overflow-hidden">
            <DialogClose className="glass-modal-close absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-brand-navy/55 dark:text-white/55 hover:text-brand-red focus:outline-none transition-colors">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
            <DialogHeader className="px-6 pt-6 pb-5">
              <div className="glass-modal-accent h-1.5 w-24 rounded-full mb-5 opacity-90" />
              <DialogTitle className="text-xl font-bold text-brand-navy dark:text-white">Authentication Required</DialogTitle>
              <DialogDescription className="mt-2 text-sm leading-6 text-brand-navy/70 dark:text-white/70">
                You need to sign in with your Queen's University account to access this feature.
              </DialogDescription>
            </DialogHeader>
            <div className="px-6 pb-2">
              <div className="glass-card rounded-2xl p-4">
                <p className="text-sm leading-6 text-brand-navy/78 dark:text-white/78">
                  Only Queen's University students with a valid @queensu.ca email address can access this feature.
                </p>
              </div>
            </div>
            <DialogFooter className="px-6 pb-6 sm:justify-between flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowAuthDialog(false)}
                className="glass-btn border-0 text-gray-700 dark:text-gray-300 rounded-2xl"
              >
                Cancel
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/sign-up")}
                  className="glass-btn border-0 rounded-2xl text-brand-navy dark:text-white"
                >
                  Sign Up
                </Button>
                <Button 
                  onClick={() => router.push("/sign-in")}
                  className="liquid-btn-red rounded-2xl text-white"
                >
                  Sign In
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // User is authenticated, render children
  return <>{children}</>;
} 