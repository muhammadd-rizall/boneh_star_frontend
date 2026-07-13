import React from 'react';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-slate-250 ${className}`} />
  );
}

export function SkeletonHero() {
  return (
    <div className="relative pt-32 pb-20 bg-white overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Column Text */}
          <div className="flex flex-col gap-6 text-left">
            <div>
              {/* Badge */}
              <div className="h-4 w-32 bg-slate-200 rounded-full animate-pulse mb-4" />
              {/* Main Heading */}
              <div className="h-10 sm:h-12 w-3/4 bg-slate-250 rounded-2xl animate-pulse mb-3" />
              <div className="h-10 sm:h-12 w-1/2 bg-slate-250 rounded-2xl animate-pulse mb-6" />
              {/* Subtitle */}
              <div className="h-4 w-full bg-slate-200 rounded-md animate-pulse mb-2.5" />
              <div className="h-4 w-5/6 bg-slate-200 rounded-md animate-pulse mb-2.5" />
              <div className="h-4 w-2/3 bg-slate-200 rounded-md animate-pulse" />
            </div>

            {/* Quick stats / Features skeleton */}
            <div className="grid gap-4 sm:grid-cols-3 mt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-3 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="h-6 w-6 bg-slate-200 rounded-lg animate-pulse" />
                  <div className="h-3.5 w-20 bg-slate-250 rounded-md animate-pulse" />
                  <div className="h-3 w-full bg-slate-150 rounded-sm animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column Image */}
          <div className="relative">
            <div className="rounded-[32px] overflow-hidden border border-slate-100 aspect-[16/10] bg-slate-100 flex items-center justify-center">
              <div className="w-full h-full bg-slate-200 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonCardGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm flex flex-col h-full">
          {/* Card Image */}
          <div className="aspect-[16/10] w-full bg-slate-200 animate-pulse relative" />
          
          {/* Card Details */}
          <div className="p-6 flex flex-col gap-5 flex-grow">
            <div>
              {/* Category & Rating Row */}
              <div className="flex justify-between items-center mb-3">
                <div className="h-5 w-20 bg-slate-200 rounded-full animate-pulse" />
                <div className="h-4 w-12 bg-slate-150 rounded-full animate-pulse" />
              </div>
              
              {/* Title */}
              <div className="h-6 w-2/3 bg-slate-250 rounded-lg animate-pulse" />
            </div>

            {/* Spec lines */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-slate-200 rounded-full animate-pulse" />
                <div className="h-3 w-16 bg-slate-150 rounded-md animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-slate-200 rounded-full animate-pulse" />
                <div className="h-3 w-20 bg-slate-150 rounded-md animate-pulse" />
              </div>
            </div>

            {/* Footer / CTA row */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
              <div className="h-5 w-24 bg-slate-250 rounded-md animate-pulse" />
              <div className="h-10 w-24 bg-slate-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonHome() {
  return (
    <div className="flex flex-col gap-0 overflow-hidden bg-white w-full">
      {/* 1. Hero Skeleton */}
      <SkeletonHero />

      {/* 2. Activities section */}
      <div className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center gap-3">
            <div className="h-4 w-32 bg-slate-200 rounded-full animate-pulse" />
            <div className="h-8 sm:h-10 w-2/3 bg-slate-250 rounded-2xl animate-pulse" />
            <div className="h-4 w-full bg-slate-150 rounded-md animate-pulse" />
          </div>
          <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-36 bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-between animate-pulse">
                <div className="h-10 w-10 bg-slate-200 rounded-2xl" />
                <div className="h-4 w-2/3 bg-slate-250 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Featured Fleet section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center gap-3">
            <div className="h-4 w-32 bg-slate-200 rounded-full animate-pulse" />
            <div className="h-8 sm:h-10 w-2/3 bg-slate-250 rounded-2xl animate-pulse" />
          </div>
          <SkeletonCardGrid count={3} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonFleet() {
  return (
    <div className="bg-white min-h-screen w-full">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="flex flex-col gap-6 text-left">
              <div>
                <div className="h-4 w-24 bg-slate-200 rounded-full animate-pulse mb-4" />
                <div className="h-10 sm:h-12 w-3/4 bg-slate-250 rounded-2xl animate-pulse mb-3" />
                <div className="h-10 sm:h-12 w-1/2 bg-slate-250 rounded-2xl animate-pulse mb-6" />
                <div className="h-4 w-full bg-slate-200 rounded-md animate-pulse mb-2.5" />
                <div className="h-4 w-2/3 bg-slate-200 rounded-md animate-pulse" />
              </div>
            </div>
            <div className="relative">
              <div className="rounded-[32px] overflow-hidden border border-slate-100 aspect-[16/10] bg-slate-200 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Content section */}
      <div className="bg-slate-50/50 py-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Bar skeleton */}
          <div className="bg-white rounded-3xl border border-slate-100 p-4 mb-10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-28 bg-slate-200 rounded-2xl animate-pulse" />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-10 w-[200px] bg-slate-200 rounded-2xl animate-pulse" />
              <div className="h-10 w-[150px] bg-slate-200 rounded-2xl animate-pulse" />
            </div>
          </div>

          <SkeletonCardGrid count={6} />
        </div>
      </div>
    </div>
  );
}
