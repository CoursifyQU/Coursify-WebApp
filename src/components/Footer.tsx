import Link from "next/link"

const Footer = () => {
  return (
    <footer className="bg-white border-t py-3 relative overflow-hidden">
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
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-3 md:mb-0">
            <div className="inline-block mb-1">
              <span className="font-bold text-[#00305f] text-sm">Cours</span>
              <span className="font-bold text-[#d62839] text-sm">ify</span>
            </div>
            <p className="text-xs text-gray-600">
              Platform for{" "}
              <span className="moving-gradient font-medium">
                Queen's Students
              </span>{" "}
              by{" "}
              <span className="moving-gradient font-medium">
                Queen's Students
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-1 italic">
              Not affiliated with or endorsed by Queen's University
            </p>
          </div>

          <div className="text-xs text-gray-600">
            <span className="moving-gradient font-medium">
              © {new Date().getFullYear()} Coursify
            </span>
            <span className="mx-2">•</span>
            <Link
              href="/about"
              className="text-[#00305f] hover:text-[#d62839] transition-colors duration-200"
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
