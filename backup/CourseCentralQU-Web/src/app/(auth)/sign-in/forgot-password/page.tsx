"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { resetPassword } = useAuth();

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
      const { error } = await resetPassword(email);
      
      if (error) {
        toast({
          title: "Error sending reset email",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      setIsEmailSent(true);
      toast({
        title: "Reset email sent",
        description: "Please check your email for password reset instructions",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md border border-gray-200 shadow-lg">
          <CardHeader className="space-y-2 bg-[#003B71] text-white rounded-t-xl px-6 py-5">
            <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
            <CardDescription className="text-center text-gray-200">
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          
          {isEmailSent ? (
            <CardContent className="space-y-6 pt-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="font-semibold text-lg mb-2 text-blue-800">Check your email</h3>
                    <p className="text-blue-700">
                      We've sent password reset instructions to <strong>{email}</strong>. 
                      Please check your inbox and follow the instructions to reset your password.
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
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 px-6 pb-6">
                <Button
                  type="submit"
                  className="w-full bg-[#d62839] hover:bg-[#a31e36] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending reset link..." : "Send reset link"}
                </Button>
                <div className="text-center text-sm text-gray-600">
                  Remember your password?{" "}
                  <Link href="/sign-in" className="text-[#003B71] underline-offset-4 hover:underline font-medium">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </form>
          )}
        </Card>
      </main>
    </div>
  );
} 