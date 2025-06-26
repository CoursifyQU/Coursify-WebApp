"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [accountConflict, setAccountConflict] = useState(false);
  const { signUp } = useAuth();
  const supabase = getSupabaseClient();

  // Email validation for queensu.ca domain
  const isQueensEmail = (email: string) => {
    return email.endsWith("@queensu.ca");
  };

  // Reset account function
  const resetAccount = async () => {
    if (!email) return;
    
    setIsResetting(true);
    
    try {
      // Call our reset API endpoint
      const response = await fetch('/api/auth/reset-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to reset account');
      }
      
      // Clear conflict status and try again
      setAccountConflict(false);
      toast({
        title: "Account reset",
        description: "You can now try to sign up again",
        variant: "success",
      });
      
    } catch (error: any) {
      toast({
        title: "Error resetting account",
        description: error.message || "Failed to reset account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  // Check if account already exists
  const checkExistingAccount = async (email: string) => {
    try {
      // Option 1: Try to find the user using the admin API (not available in client)
      // Instead, we'll use a more reliable approach for client-side

      // First, force clear any lingering session
      await supabase.auth.signOut();
      
      // Clear any lingering redirects to avoid confusion
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('supabase.auth.token');
      }
      
      // Try to sign in with magic link WITHOUT creating a new user
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        }
      });
      
      // If there's no error when trying to send a magic link, 
      // the user exists (you'll get an error if the user doesn't exist)
      if (!error) {
        return true; // Account exists
      }
      
      // Check for specific errors that indicate the user doesn't exist
      if (error && 
         (error.message.includes("Email not found") || 
          error.message.includes("user not found") ||
          error.message.includes("does not exist"))) {
        return false; // Account doesn't exist
      }
      
      // For any other errors, treat as if we couldn't determine (safer to assume might exist)
      console.error("Error checking account existence:", error);
      return false; // Let them proceed - the signup will fail if there's a real conflict
      
    } catch (err) {
      console.error("Error in account existence check:", err);
      return false; // Same safe approach - let signup attempt happen
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAccountConflict(false); // Reset any previous conflict

    // Check if email is from queensu.ca domain
    if (!isQueensEmail(email)) {
      toast({
        title: "Invalid email domain",
        description: "Please use your Queen's University email address (@queensu.ca)",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Check if account already exists
      const accountExists = await checkExistingAccount(email);
      
      if (accountExists) {
        setAccountConflict(true);
        toast({
          title: "Account may already exist",
          description: "An account with this email may already exist. You can try to reset it or sign in instead.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Proceed with signup - this will now use our enhanced signUp method
      const { error } = await signUp(email, password);
      
      if (error) {
        // If we get an error about user already registered, handle it specifically
        if (error.message && (
            error.message.includes("already registered") || 
            error.message.includes("already exists") || 
            error.message.includes("already taken")
        )) {
          setAccountConflict(true);
          toast({
            title: "Account already exists",
            description: "This email is already registered. You can reset it or sign in instead.",
            variant: "destructive",
          });
          return;
        }
        
        toast({
          title: "Error signing up",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Show verification message
      setShowVerificationMessage(true);
      toast({
        title: "Verification email sent",
        description: "Please check your Queen's email to verify your account",
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during sign up",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Left side - Branding */}
      <motion.div 
        className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.6, 0.05, 0.01, 0.9] }}
      >
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 z-0"></div>
        
        <div className="max-w-md mx-auto space-y-8 relative z-10">
          <motion.div 
            className="space-y-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.6, 0.05, 0.01, 0.9] }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
              <span className="block">Join</span>
              <span className="block text-5xl md:text-6xl">
                <span className="coursify-gradient-text">Coursify</span>
              </span>
            </h1>
            <p className="text-xl text-gray-600">
              Get AI-powered insights about Queen's courses, professors, and grade distributions
            </p>
          </motion.div>
          
          <div className="space-y-6 mt-12">
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="bg-[#00305f]/10 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00305f]">
                  <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"></path>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
              </div>
              <p className="text-gray-600 text-lg">Ask our AI about any course or professor</p>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="bg-[#00305f]/10 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00305f]">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <path d="M16 13H8"></path>
                  <path d="M16 17H8"></path>
                  <path d="M10 9H8"></path>
                </svg>
              </div>
              <p className="text-gray-600 text-lg">View course data scraped from Reddit & RMP</p>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="bg-[#00305f]/10 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00305f]">
                  <path d="M3 3v18h18"></path>
                  <path d="m19 9-5 5-4-4-3 3"></path>
                </svg>
              </div>
              <p className="text-gray-600 text-lg">Explore detailed grade distribution data</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Right side - Sign Up Form */}
      <motion.div 
        className="w-full lg:w-1/2 flex items-center justify-center p-8 border-l border-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.6, 0.05, 0.01, 0.9] }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.6, 0.05, 0.01, 0.9] }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-lg overflow-hidden transition-all duration-300">
            <CardHeader className="space-y-2 bg-white border-b px-6 py-6">
              <CardTitle className="text-2xl font-bold text-center text-gray-900">Create an account</CardTitle>
              <CardDescription className="text-center text-gray-500">
                Enter your Queen's University email to create an account
              </CardDescription>
            </CardHeader>
            
            {showVerificationMessage ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.6, 0.05, 0.01, 0.9] }}
              >
                <CardContent className="space-y-6 pt-6">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="font-semibold text-lg mb-2 text-blue-800">Check your email</h3>
                        <p className="text-blue-700">
                          We've sent you a verification link to <strong>{email}</strong>. 
                          Please check your inbox and click the link to verify your account.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <Link 
                      href="/sign-in" 
                      className="text-[#d62839] underline-offset-4 hover:underline font-medium transition-all duration-300 hover:opacity-80"
                    >
                      Return to sign in
                    </Link>
                  </div>
                </CardContent>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-5 pt-6">
                  {accountConflict && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: [0.6, 0.05, 0.01, 0.9] }}
                    >
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-4">
                        <div className="flex">
                          <div className="ml-3">
                            <h3 className="font-semibold text-md text-yellow-800">Account Conflict</h3>
                            <p className="text-yellow-700 text-sm mb-3">
                              An account with this email already exists or was previously created.
                            </p>
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={resetAccount}
                                disabled={isResetting}
                                className="text-yellow-700 border-yellow-400 hover:bg-yellow-50 transition-all duration-300"
                              >
                                {isResetting ? "Processing..." : "Reset Account"}
                              </Button>
                              <Link href="/sign-in">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="text-yellow-700 border-yellow-400 hover:bg-yellow-50 transition-all duration-300"
                                >
                                  Sign In Instead
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <Label htmlFor="email" className="text-gray-700">Email (@queensu.ca)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.name@queensu.ca"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-gray-300 focus:border-[#00305f] focus:ring-[#00305f] transition-all duration-300"
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <Label htmlFor="password" className="text-gray-700">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-gray-300 focus:border-[#00305f] focus:ring-[#00305f] transition-all duration-300"
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="border-gray-300 focus:border-[#00305f] focus:ring-[#00305f] transition-all duration-300"
                    />
                  </motion.div>
                </CardContent>
                
                <CardFooter className="flex flex-col space-y-4 px-6 pb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                    className="w-full"
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#d62839] to-[#a31e36] hover:from-[#c61e29] hover:to-[#8a1a2e] text-white transition-all duration-300 transform hover:scale-[1.02]"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Sign Up"}
                    </Button>
                  </motion.div>
                  <motion.div 
                    className="text-center text-sm text-gray-600"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                  >
                    Already have an account?{" "}
                    <Link href="/sign-in" className="text-[#00305f] underline-offset-4 hover:underline font-medium transition-all duration-300 hover:text-[#d62839]">
                      Sign in
                    </Link>
                  </motion.div>
                </CardFooter>
              </form>
            )}
          </Card>
        </motion.div>
      </motion.div>

      {/* Global styles */}
      <style jsx global>{`
        .coursify-gradient-text {
          background: linear-gradient(
            90deg, 
            #00305f 0%, 
            #d62839 30%, 
            #efb215 60%, 
            #00305f 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          animation: shine 8s linear infinite;
          display: inline-block;
        }
        
        @keyframes shine {
          to {
            background-position: 200% center;
          }
        }
      `}</style>
    </div>
  );
} 