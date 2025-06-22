"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Info, UploadCloud, AlertTriangle } from "lucide-react"
import { AuthModal } from "@/components/auth-modal"
import { useAuth } from "@/lib/auth/auth-context"
import { getSupabaseClient } from "@/lib/supabase/client"

export default function AddCoursesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

  const handleUpload = async (file: File) => {
    if (!user) {
      setIsModalOpen(true)
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const supabase = getSupabaseClient()
      const timestamp = new Date().getTime()
      // Create a filename with user ID and timestamp to ensure uniqueness
      const fileName = `${user.id}_${timestamp}_${file.name}`
      
      // Upload file to the course-distributions bucket
      // Add publicUpload: true to bypass RLS policies
      const { data, error } = await supabase.storage
        .from('course-distributions')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (error) {
        if (error.message.includes('row-level security')) {
          console.error("RLS error:", error);
          // Try again but create the path with the user's ID to match potential RLS policies
          const userSpecificPath = `${user.id}/${fileName}`;
          const secondAttempt = await supabase.storage
            .from('course-distributions')
            .upload(userSpecificPath, file, {
              cacheControl: '3600',
              upsert: false
            });
            
          if (secondAttempt.error) {
            console.error("Second attempt error:", secondAttempt.error);
            
            // If still getting RLS errors, try one more approach
            if (secondAttempt.error.message.includes('row-level security')) {
              // Try to get a public upload URL
              try {
                const { data: uploadData } = await supabase.storage.from('course-distributions').createSignedUploadUrl(
                  userSpecificPath
                );
                
                if (uploadData && uploadData.signedUrl) {
                  // Use the signed URL to upload
                  const uploadResponse = await fetch(uploadData.signedUrl, {
                    method: 'PUT',
                    body: file,
                    headers: {
                      'Content-Type': file.type,
                    },
                  });
                  
                  if (uploadResponse.ok) {
                    console.log("File uploaded successfully with signed URL");
                    setUploadSuccess(true);
                    return;
                  } else {
                    throw new Error(`Upload failed: ${uploadResponse.statusText}`);
                  }
                }
              } catch (signedUrlError) {
                console.error("Signed URL upload error:", signedUrlError);
              }
            }
            
            throw secondAttempt.error;
          }
          
          console.log("File uploaded successfully with user-specific path:", secondAttempt.data);
          setUploadSuccess(true);
          return;
        }
        throw error;
      }
      
      console.log("File uploaded successfully:", data)
      setUploadSuccess(true)
    } catch (error) {
      console.error("Error uploading file:", error)
      setUploadError(typeof error === 'object' && error !== null && 'message' in error
        ? String(error.message)
        : "There was an error uploading your file. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0])
    }
  }

  const handleSelectFileClick = () => {
    if (!user) {
      setIsModalOpen(true)
      return
    }
    
    fileInputRef.current?.click()
  }

  return (
    <div className="relative min-h-screen overflow-hidden mesh-gradient">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d62839]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00305f]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#efb215]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#d62839]/5 rounded-full blur-3xl -top-10 -right-20"></div>
        <div className="absolute w-80 h-80 bg-[#00305f]/5 rounded-full blur-3xl -bottom-10 -left-20"></div>
        <div className="dot-pattern absolute inset-0 opacity-[0.08]"></div>
      </div>

      <div className="container mx-auto py-12 px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[#00305f]">
              Add Course <span className="gradient-text">Distributions</span>
            </h1>
            <div className="w-24 h-1 bg-[#d62839] mx-auto mb-4"></div>
            <p className="text-gray-600">Help improve the site and future course selections</p>
          </div>

          <div className="flex justify-center mb-8">
            <a
              href="https://www.queensu.ca/registrar/academic-info/grades/release-dates-and-viewing"
              target="_blank"
              rel="noopener noreferrer" 
              className="relative group bg-gradient-to-r from-[#d62839] to-[#a31e36] hover:from-[#c61e29] hover:to-[#8a1a2e] text-white px-6 py-3 rounded-xl inline-flex items-center justify-center font-medium transition-all duration-500 ease-in-out w-full sm:w-auto text-center shadow-md hover:shadow-lg overflow-hidden hover:scale-105 cursor-pointer"
            >
              <Info className="mr-2 h-4 w-4" />
              <span className="text-sm">How To Find SOLUS Distribution</span>
            </a>
          </div>

          <Card className="overflow-hidden border-none shadow-md">
            <div className="bg-[#00305f] px-6 py-4">
              <h2 className="text-lg font-medium text-white">Upload SOLUS Grade Distribution</h2>
            </div>

            <div className="p-6">
              {uploadSuccess ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#00305f] mb-2">Upload Successful!</h3>
                  <p className="text-gray-600 mb-4">
                    Thank you for contributing to CourseCentral. Your data will help other students make better course
                    decisions.
                  </p>
                  <Button onClick={() => setUploadSuccess(false)} className="bg-[#00305f] hover:bg-[#00305f]/90">
                    Upload Another File
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 border-4 border-[#00305f]/20 border-t-[#00305f] rounded-full animate-spin mb-3"></div>
                        <p className="text-[#00305f] font-medium">Uploading...</p>
                      </div>
                    </div>
                  )}

                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center hover:border-[#00305f] transition-colors duration-300"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <div className="w-16 h-16 bg-[#00305f]/10 rounded-full flex items-center justify-center mb-4">
                      <UploadCloud className="h-8 w-8 text-[#00305f]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#00305f] mb-2">Drop your file here</h3>
                    <p className="text-gray-500 text-center mb-6">
                      Drag and drop your SOLUS grade distribution PDF,
                      <br />
                      or click to browse
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={handleSelectFileClick}
                      className="border-[#00305f] text-[#00305f] hover:bg-[#00305f]/10"
                    >
                      Select PDF File
                    </Button>

                    {uploadError && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{uploadError}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 flex items-start p-4 bg-[#efb215]/10 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-[#efb215] mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Important:</span> Currently, we only support on-campus courses.
                      Online course distributions will be supported in future updates.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Sign in to upload distributions"
        description="You need to sign in with your Queen's University email to upload course distributions."
      />

      {/* Add the CSS for the gradient text and dot pattern */}
      <style jsx global>{`
        .mesh-gradient {
          background-color: hsla(0, 0%, 100%, 1);
          background-image:
            radial-gradient(at 21% 33%, hsla(225, 100%, 19%, 0.05) 0px, transparent 50%),
            radial-gradient(at 79% 76%, hsla(352, 71%, 54%, 0.05) 0px, transparent 50%),
            radial-gradient(at 96% 10%, hsla(43, 83%, 51%, 0.05) 0px, transparent 50%);
        }
        
        .dot-pattern {
          background-image: radial-gradient(circle, #00305f 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .gradient-text {
          background: linear-gradient(-45deg, #00305f, #d62839, #efb215, #00305f);
          background-size: 300% 300%;
          animation: gradient-shift 6s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  )
}
