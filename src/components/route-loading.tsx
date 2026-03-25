/** Full-viewport loading shell: flat page background; nav stays above (z-50). */
export function RouteLoading() {
  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-[var(--page-bg)]"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4 px-4 text-center">
        <div className="rounded-full border border-black/[0.08] bg-white px-4 py-2 shadow-sm dark:border-white/10 dark:bg-zinc-800">
          <span className="text-sm font-semibold text-brand-navy dark:text-white">Loading Coursify</span>
        </div>

        <div className="flex items-center gap-1">
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand-navy" />
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand-red [animation-delay:150ms]" />
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand-gold [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  )
}
