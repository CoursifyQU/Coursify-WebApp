import Link from "next/link"

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-white/60 py-4" style={{ background: 'rgba(255,255,255,0.45)', backdropFilter: 'blur(28px) saturate(180%)', WebkitBackdropFilter: 'blur(28px) saturate(180%)' }}>
      <style jsx global>{`
        .moving-gradient {
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
          color: transparent;
          animation: shine 8s linear infinite;
          display: inline-block;
        }

        @keyframes shine {
          to {
            background-position: 200% center;
          }
        }
      `}</style>

      {/* Subtle glass highlight at top edge */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="mb-1 md:mb-0">
            <div className="inline-block mb-1">
              <span className="font-bold text-[#00305f] text-sm tracking-tight">Cours</span>
              <span className="font-bold text-[#d62839] text-sm tracking-tight">ify</span>
            </div>
            <p className="text-xs text-gray-600">
              Platform for{" "}
              <span className="moving-gradient font-medium">
                Queen&apos;s Students
              </span>{" "}
              by{" "}
              <span className="moving-gradient font-medium">
                Queen&apos;s Students
              </span>
            </p>
            <p className="text-xs text-gray-400 mt-0.5 italic">
              Not affiliated with or endorsed by Queen&apos;s University
            </p>
          </div>

          <div className="text-xs text-gray-600 flex items-center gap-2">
            <span className="moving-gradient font-medium">
              © {new Date().getFullYear()} Coursify
            </span>
            <span className="text-gray-300">•</span>
            <Link
              href="/about"
              className="text-[#00305f] hover:text-[#d62839] transition-colors duration-200 font-medium"
            >
              About Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
