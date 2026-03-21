"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Info, UploadCloud, AlertTriangle, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react"
import { AuthModal } from "@/components/auth-modal"
import { useAuth } from "@/lib/auth/auth-context"
import { getSupabaseClient } from "@/lib/supabase/client"
import type { UploadDistributionResponse } from "@/types"

type UploadPhase = "idle" | "uploading" | "validating" | "processing" | "done" | "error"

export default function AddCoursesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uploadPhase, setUploadPhase] = useState<UploadPhase>("idle")
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadResult, setUploadResult] = useState<UploadDistributionResponse | null>(null)
  const [showSkipped, setShowSkipped] = useState(false)
  const [showDuplicates, setShowDuplicates] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

  const handleUpload = async (file: File) => {
    if (!user) {
      setIsModalOpen(true)
      return
    }

    // Client-side PDF check
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      setUploadPhase("error")
      setUploadError("Please upload a PDF file.")
      return
    }

    setUploadPhase("uploading")
    setUploadError(null)
    setUploadResult(null)

    try {
      const supabase = getSupabaseClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error("Not authenticated. Please sign in again.")
      }

      const formData = new FormData()
      formData.append("file", file)

      setUploadPhase("validating")

      const response = await fetch("/api/upload-distribution", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
      })

      const result: UploadDistributionResponse = await response.json()

      if (!response.ok) {
        throw new Error(result.errors?.[0] || "Upload failed.")
      }

      setUploadPhase("done")
      setUploadResult(result)
    } catch (error) {
      setUploadPhase("error")
      setUploadError(error instanceof Error ? error.message : "Upload failed. Please try again.")
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

  const handleReset = () => {
    setUploadPhase("idle")
    setUploadError(null)
    setUploadResult(null)
    setShowSkipped(false)
    setShowDuplicates(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const phaseText: Record<string, string> = {
    uploading: "Uploading...",
    validating: "Validating PDF format...",
    processing: "Processing courses...",
  }

  return (
    <div className="relative min-h-screen overflow-hidden mesh-gradient pt-20">
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
              Add Course <span className="coursify-gradient-text">Distributions</span>
            </h1>
            <div className="w-24 h-1 bg-[#d62839] mx-auto mb-4"></div>
            <p className="text-gray-600">Help improve the site and future course selections</p>
          </div>

          <div className="flex justify-center mb-8">
            <a
              href="https://www.queensu.ca/registrar/academic-info/grades/release-dates-and-viewing"
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-btn-red text-white px-6 py-2.5 rounded-xl inline-flex items-center justify-center font-medium w-full sm:w-auto text-center"
            >
              <Info className="mr-2 h-4 w-4" />
              <span className="text-sm">How To Find SOLUS Distribution</span>
            </a>
          </div>

          <Card className="overflow-hidden border-none glass-card-deep !p-0" style={{ background: 'rgba(255, 255, 255, 0.85)', boxShadow: '0 8px 32px rgba(0, 48, 95, 0.13), 0 2px 8px rgba(0, 48, 95, 0.07)' }}>
            <div className="bg-[#00305f] px-6 py-4">
              <h2 className="text-lg font-medium text-white">Upload SOLUS Grade Distribution</h2>
            </div>

            <div className="p-6">
              {uploadPhase === "done" && uploadResult ? (
                /* Results view */
                <div className="space-y-4">
                  {/* Term badge */}
                  {uploadResult.term && (
                    <div className="flex justify-center">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-[#00305f]/10 text-[#00305f]">
                        {uploadResult.term}
                      </span>
                    </div>
                  )}

                  {/* Inserted count */}
                  {uploadResult.inserted > 0 && (
                    <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                      <p className="text-sm text-green-800 font-medium">
                        {uploadResult.inserted} course{uploadResult.inserted !== 1 ? "s" : ""} added successfully{uploadResult.term ? ` for ${uploadResult.term}` : ""}
                      </p>
                    </div>
                  )}

                  {/* No courses inserted */}
                  {uploadResult.inserted === 0 && uploadResult.errors.length === 0 && (
                    <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0" />
                      <p className="text-sm text-yellow-800 font-medium">
                        {uploadResult.duplicates.length > 0 && uploadResult.skipped.length === 0
                          ? `All ${uploadResult.duplicates.length} course${uploadResult.duplicates.length !== 1 ? "s" : ""} already had distributions for ${uploadResult.term || "this term"} — nothing new to add.`
                          : uploadResult.skipped.length > 0 && uploadResult.duplicates.length === 0
                            ? `None of the ${uploadResult.skipped.length} course${uploadResult.skipped.length !== 1 ? "s" : ""} in this PDF are in our database yet.`
                            : "No new distributions were added — courses were either already uploaded or not in our database."}
                      </p>
                    </div>
                  )}

                  {/* Duplicates */}
                  {uploadResult.duplicates.length > 0 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <button
                        onClick={() => setShowDuplicates(!showDuplicates)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <div className="flex items-center">
                          <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0" />
                          <p className="text-sm text-yellow-800 font-medium">
                            {uploadResult.duplicates.length} course{uploadResult.duplicates.length !== 1 ? "s were" : " was"} already uploaded for {uploadResult.term || "this term"} — skipped
                          </p>
                        </div>
                        {showDuplicates ? <ChevronUp className="h-4 w-4 text-yellow-600" /> : <ChevronDown className="h-4 w-4 text-yellow-600" />}
                      </button>
                      {showDuplicates && (
                        <div className="mt-2 pl-8 text-sm text-yellow-700">
                          {uploadResult.duplicates.join(", ")}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Skipped */}
                  {uploadResult.skipped.length > 0 && (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <button
                        onClick={() => setShowSkipped(!showSkipped)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <div className="flex items-center">
                          <AlertTriangle className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                          <p className="text-sm text-orange-800 font-medium">
                            {uploadResult.skipped.length} course{uploadResult.skipped.length !== 1 ? "s aren't" : " isn't"} in our database yet
                          </p>
                        </div>
                        {showSkipped ? <ChevronUp className="h-4 w-4 text-orange-500" /> : <ChevronDown className="h-4 w-4 text-orange-500" />}
                      </button>
                      {showSkipped && (
                        <div className="mt-2 pl-8 text-sm text-orange-700">
                          {uploadResult.skipped.join(", ")}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Errors */}
                  {uploadResult.errors.length > 0 && (
                    <div className="flex items-start p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-red-700">
                        {uploadResult.errors.map((err, i) => (
                          <p key={i}>{err}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center pt-2">
                    <Button onClick={handleReset} className="liquid-btn-blue text-white rounded-xl px-6 py-2.5 font-medium">
                      Upload Another File
                    </Button>
                  </div>
                </div>
              ) : (
                /* Upload view */
                <div className="relative">
                  {/* Loading overlay */}
                  {(uploadPhase === "uploading" || uploadPhase === "validating" || uploadPhase === "processing") && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-lg">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 border-4 border-[#00305f]/20 border-t-[#00305f] rounded-full animate-spin mb-3"></div>
                        <p className="text-[#00305f] font-medium">{phaseText[uploadPhase]}</p>
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
                      onClick={handleSelectFileClick}
                      className="liquid-btn-blue text-white rounded-xl px-6 py-2.5 font-medium"
                    >
                      Select PDF File
                    </Button>

                    {uploadPhase === "error" && uploadError && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg w-full">
                        <div className="flex items-start">
                          <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{uploadError}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex items-start p-4 bg-[#efb215]/15 border border-[#efb215]/30 rounded-lg shadow-sm">
                    <AlertTriangle className="h-5 w-5 text-[#efb215] mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-gray-800">Important:</span> Currently, we only support on-campus courses.
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

      {/* mesh-gradient is page-specific, not in globals */}
      <style jsx global>{`
        .mesh-gradient {
          background-color: hsla(0, 0%, 100%, 1);
          background-image:
            radial-gradient(at 21% 33%, hsla(225, 100%, 19%, 0.05) 0px, transparent 50%),
            radial-gradient(at 79% 76%, hsla(352, 71%, 54%, 0.05) 0px, transparent 50%),
            radial-gradient(at 96% 10%, hsla(43, 83%, 51%, 0.05) 0px, transparent 50%);
        }
      `}</style>
    </div>
  )
}
