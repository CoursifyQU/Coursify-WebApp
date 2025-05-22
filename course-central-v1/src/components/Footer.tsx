import Link from "next/link"

const Footer = () => {
  return (
    <footer className="w-full border-t bg-gradient-to-r from-[#00305f] via-[#d62839] to-[#efb215] text-white">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-bold">CourseCentral</h3>
            <p className="text-sm text-white/80">Helping Queen's University students make informed course decisions.</p>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-bold">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/schools/queens" className="hover:underline">
                  Queen's Courses
                </Link>
              </li>
              <li>
                <Link href="/queens-answers" className="hover:underline">
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-bold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:underline">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-bold">Contact</h3>
            <p className="text-sm text-white/80">Have questions or feedback? Reach out to us.</p>
            <Link href="mailto:info@coursecentral.ca" className="text-sm hover:underline">
              info@coursecentral.ca
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-white/20 text-center text-sm text-white/80">
          <p>© {new Date().getFullYear()} CourseCentral. All rights reserved.</p>
          <p className="mt-2">Not officially affiliated with Queen's University.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
