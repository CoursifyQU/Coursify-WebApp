"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const supabase = getSupabaseClient();

  // Email validation for queensu.ca domain
  const isQueensEmail = (email: string) => {
    return email.endsWith("@queensu.ca");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      toast({
        title: "Password reset email sent",
        description: "Check your email for a link to reset your password",
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
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
              <span className="block">Reset your</span>
              <span className="block text-5xl md:text-6xl">
                <span className="coursify-gradient-text">Password</span>
              </span>
            </h1>
            <p className="text-xl text-gray-600">
              Get back to exploring Queen's courses with our AI assistant
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
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 8v4l2 2"></path>
                  <path d="M5 3 2 6"></path>
                  <path d="m22 6-3-3"></path>
                  <path d="m6 19-2 2"></path>
                  <path d="m18 19 2 2"></path>
                </svg>
              </div>
              <p className="text-gray-600 text-lg">AI insights from Rate My Prof & Reddit</p>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="bg-[#00305f]/10 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00305f]">
                  <path d="M3 3v18h18"></path>
                  <path d="m19 9-5 5-4-4-3 3"></path>
                </svg>
              </div>
              <p className="text-gray-600 text-lg">View comprehensive grade distributions</p>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="bg-[#00305f]/10 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00305f]">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <p className="text-gray-600 text-lg">Get real student insights about any course</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Right side - Forgot Password Form */}
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
              <CardTitle className="text-2xl font-bold text-center text-gray-900">Reset Password</CardTitle>
              <CardDescription className="text-center text-gray-500">
                Enter your Queen's University email to receive a password reset link
              </CardDescription>
            </CardHeader>
            
            {isSuccess ? (
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
                          We've sent a password reset link to <strong>{email}</strong>. 
                          Please check your inbox and click the link to reset your password.
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
                </CardContent>
                
                <CardFooter className="flex flex-col space-y-4 px-6 pb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="w-full"
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#d62839] to-[#a31e36] hover:from-[#c61e29] hover:to-[#8a1a2e] text-white transition-all duration-300 transform hover:scale-[1.02]"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending reset link..." : "Send Reset Link"}
                    </Button>
                  </motion.div>
                  <motion.div 
                    className="text-center text-sm text-gray-600"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    Remember your password?{" "}
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