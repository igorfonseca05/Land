export function LoadingCards() {
  return (
     <div>
          <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <article
              key={i}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-pulse"
            >
              {/* Header */}
              <div className="flex items-center gap-3 p-4">
                <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                <div className="flex flex-col gap-2">
                  <div className="w-32 h-3 rounded bg-neutral-200 dark:bg-neutral-700" />
                  <div className="w-24 h-2 rounded bg-neutral-100 dark:bg-neutral-800" />
                </div>
              </div>

              {/* Text */}
              <div className="px-4 pb-3 space-y-2">
                <div className="w-full h-3 rounded bg-neutral-200 dark:bg-neutral-700" />
                <div className="w-5/6 h-3 rounded bg-neutral-200 dark:bg-neutral-700" />
                <div className="w-2/3 h-3 rounded bg-neutral-200 dark:bg-neutral-700" />
              </div>

              {/* Image */}
              <div className="w-full h-64 bg-neutral-200 dark:bg-neutral-800" />
            </article>
          ))}
        </div>
     </div>
  )
}