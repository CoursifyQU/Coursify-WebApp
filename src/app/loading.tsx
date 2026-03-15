export default function Loading() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="liquid-blob w-[380px] h-[320px] bg-[#00305f] top-12 left-[-5rem] opacity-[0.05]" />
        <div className="liquid-blob-alt w-[320px] h-[360px] bg-[#d62839] top-16 right-[-4rem] opacity-[0.05]" />
        <div className="liquid-blob w-[260px] h-[260px] bg-[#efb215] bottom-12 left-1/2 -translate-x-1/2 opacity-[0.04]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <div className="glass-pill rounded-full px-4 py-2 shadow-sm">
          <span className="text-sm font-semibold text-[#00305f]">Loading Coursify</span>
        </div>

        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#00305f]" />
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#d62839] [animation-delay:150ms]" />
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#efb215] [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
}
