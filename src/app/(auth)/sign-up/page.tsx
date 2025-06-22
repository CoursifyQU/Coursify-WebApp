"use client";

import { useState } from "react";
import Link from "next/link";
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border border-gray-200 shadow-lg">
        <CardHeader className="space-y-2 bg-[#003B71] text-white rounded-t-xl px-6 py-5">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center text-gray-200">
            Enter your Queen's University email to create an account
          </CardDescription>
        </CardHeader>
        
        {showVerificationMessage ? (
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
                className="text-[#d62839] underline-offset-4 hover:underline font-medium"
              >
                Return to sign in
              </Link>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              {accountConflict && (
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
                          className="text-yellow-800 border-yellow-500 hover:bg-yellow-100"
                        >
                          {isResetting ? "Resetting..." : "Reset Account Data"}
                        </Button>
                        <Link href="/sign-in">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-blue-800 border-blue-500 hover:bg-blue-100"
                          >
                            Try to Sign In
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.name@queensu.ca"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-gray-300 focus:border-[#003B71] focus:ring-[#003B71]"
                />
                <p className="text-xs text-gray-500">
                  Must be a valid Queen's University email address (@queensu.ca)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="border-gray-300 focus:border-[#003B71] focus:ring-[#003B71]"
                />
                <p className="text-xs text-gray-500">
                  Must be at least 6 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-gray-700">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="border-gray-300 focus:border-[#003B71] focus:ring-[#003B71]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 px-6 pb-6">
              <Button
                type="submit"
                className="w-full bg-[#d62839] hover:bg-[#a31e36] text-white"
                disabled={isLoading || isResetting}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/sign-in" className="text-[#003B71] underline-offset-4 hover:underline font-medium">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
} 