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
      <div className="container mx-auto py-12 px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-brand-navy dark:text-white">
              Add Course <span className="coursify-gradient-text">Distributions</span>
            </h1>
            <div className="w-24 h-1 bg-brand-red mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Help improve the site and future course selections</p>
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

          <Card className="overflow-hidden border-none glass-card-deep !p-0 bg-white/85 dark:bg-gray-900/85 shadow-[0_8px_32px_rgba(0,48,95,0.13),0_2px_8px_rgba(0,48,95,0.07)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_2px_8px_rgba(0,0,0,0.15)]">
            <div className="bg-brand-navy px-6 py-4">
              <h2 className="text-lg font-medium text-white">Upload SOLUS Grade Distribution</h2>
            </div>

            <div className="p-6">
              {uploadPhase === "done" && uploadResult ? (
                /* Results view */
                <div className="space-y-4">
                  {/* Term badge */}
                  {uploadResult.term && (
                    <div className="flex justify-center">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-brand-navy/10 dark:bg-blue-400/10 text-brand-navy dark:text-white">
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
                    <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-10 rounded-lg">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 border-4 border-brand-navy/20 dark:border-blue-400/20 border-t-brand-navy dark:border-t-blue-400 rounded-full animate-spin mb-3"></div>
                        <p className="text-brand-navy dark:text-white font-medium">{phaseText[uploadPhase]}</p>
                      </div>
                    </div>
                  )}

                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center hover:border-brand-navy dark:hover:border-blue-400 transition-colors duration-300"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <div className="w-16 h-16 bg-brand-navy/10 dark:bg-blue-400/10 rounded-full flex items-center justify-center mb-4">
                      <UploadCloud className="h-8 w-8 text-brand-navy dark:text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-brand-navy dark:text-white mb-2">Drop your file here</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
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

                  <div className="mt-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm dark:border-amber-400/35 dark:bg-amber-950/55">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden />
                    <p className="text-sm leading-relaxed text-amber-950 dark:text-amber-50">
                      <span className="font-bold text-amber-900 dark:text-amber-100">Important:</span>{" "}
                      Currently, we only support on-campus courses. Online course distributions will be supported in future updates.
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
          background-image: none;
        }
        :is(.dark) .mesh-gradient {
          background-color: #171717;
          background-image: none;
        }
      `}</style>
    </div>
  )
}
