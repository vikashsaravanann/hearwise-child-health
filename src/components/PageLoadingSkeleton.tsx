import React from 'react'

const PageLoadingSkeleton = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="text-6xl animate-pulse">👂</div>
      <div className="text-2xl font-bold text-teal-400">HearWise</div>
      <div className="text-slate-500 text-sm">Loading…</div>
      <div className="flex gap-1 justify-center mt-2">
        <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:0ms]"></span>
        <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:150ms]"></span>
        <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:300ms]"></span>
      </div>
      <div className="mt-6 w-48 mx-auto space-y-2">
        <div className="h-2 bg-white/10 rounded animate-pulse"></div>
        <div className="h-2 bg-white/10 rounded animate-pulse w-3/4 mx-auto"></div>
        <div className="h-2 bg-white/10 rounded animate-pulse w-1/2 mx-auto"></div>
      </div>
    </div>
  </div>
)

export default PageLoadingSkeleton
