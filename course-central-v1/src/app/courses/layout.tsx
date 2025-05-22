import type React from "react"
export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">CourseCentral</h1>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
