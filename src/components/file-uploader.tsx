"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { UploadCloud, AlertTriangle } from "lucide-react"

interface FileUploaderProps {
  onUpload: (file: File) => void
}

export function FileUploader({ onUpload }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      handleFile(file)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      handleFile(file)
    }
  }

  const handleFile = (file: File) => {
    if (file.type === "application/pdf") {
      setSelectedFile(file)
      onUpload(file)
    } else {
      alert("Please upload a PDF file")
    }
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 ${
          dragActive ? "border-[#00305f]" : "border-gray-300"
        } transition-colors duration-300`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input ref={inputRef} type="file" className="hidden" accept=".pdf" onChange={handleChange} />

        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-20 h-20 bg-[#00305f]/10 rounded-full flex items-center justify-center">
            <UploadCloud className="h-10 w-10 text-[#00305f]" />
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold text-[#00305f]">Drop your file here</h3>
            <p className="text-gray-500 mt-1">
              Drag and drop your SOLUS grade distribution PDF,
              <br />
              or click to browse
            </p>
          </div>

          <Button
            onClick={handleButtonClick}
            variant="outline"
            className="mt-2 border-[#00305f] text-[#00305f] hover:bg-[#00305f]/10"
          >
            Select PDF File
          </Button>
        </div>
      </div>

      <div className="mt-6 flex items-start p-4 bg-[#efb215]/10 rounded-lg">
        <AlertTriangle className="h-5 w-5 text-[#efb215] mr-3 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-gray-700">
          <span className="font-medium">Important:</span> Currently, we only support on-campus courses. Online course
          distributions will be supported in future updates.
        </p>
      </div>
    </div>
  )
}
