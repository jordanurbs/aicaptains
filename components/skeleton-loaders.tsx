"use client"

import React from 'react'
import { Terminal, Zap } from 'lucide-react'

// Base skeleton component with retro styling
interface SkeletonProps {
  className?: string
  width?: string
  height?: string
  variant?: 'text' | 'rectangular' | 'circular'
  animate?: boolean
}

function Skeleton({ 
  className = '', 
  width = '100%', 
  height = '1rem',
  variant = 'rectangular',
  animate = true 
}: SkeletonProps) {
  const baseClasses = `
    bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:400%_100%]
    ${animate ? 'animate-pulse' : ''}
  `
  
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full'
  }
  
  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
      role="presentation"
      aria-hidden="true"
    />
  )
}

// Skeleton for goal cards section
export function GoalCardsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Drop Zone Skeleton */}
      <div className="border-4 border-dashed border-gray-600 rounded-lg p-8 bg-gray-800/20">
        <div className="text-center space-y-4">
          <Skeleton variant="circular" width="3rem" height="3rem" className="mx-auto" />
          <Skeleton height="1.5rem" width="12rem" className="mx-auto" />
          <Skeleton height="1rem" width="20rem" className="mx-auto" />
        </div>
      </div>
      
      {/* Goal Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="border-4 border-gray-600 rounded-lg p-4 bg-gray-800/50 min-h-[160px] space-y-3"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex justify-between items-start">
              <Skeleton variant="circular" width="2.5rem" height="2.5rem" />
              <Skeleton width="4rem" height="1rem" />
            </div>
            <Skeleton height="1rem" width="100%" />
            <Skeleton height="1rem" width="80%" />
            <Skeleton height="0.875rem" width="60%" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Skeleton for excuse selector
export function ExcuseSelectorSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton height="2rem" width="20rem" />
        <Skeleton height="1rem" width="30rem" />
      </div>
      
      {/* Preset Excuses */}
      <div className="space-y-4">
        <Skeleton height="1.5rem" width="12rem" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="border-4 border-gray-600 rounded-lg p-4 bg-gray-800/50 min-h-[120px] space-y-3"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="flex justify-between items-start">
                <Skeleton variant="circular" width="2.5rem" height="2.5rem" />
                <Skeleton width="4rem" height="1rem" />
              </div>
              <div className="space-y-2">
                <Skeleton height="1rem" width="100%" />
                <Skeleton height="1rem" width="85%" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Custom Input */}
      <div className="space-y-4">
        <Skeleton height="1.5rem" width="16rem" />
        <div className="border-4 border-gray-600 rounded-lg p-4 bg-gray-800/50 space-y-3">
          <Skeleton height="1rem" width="20rem" />
          <Skeleton height="6rem" width="100%" />
          <div className="flex justify-between items-center">
            <Skeleton height="0.875rem" width="8rem" />
            <Skeleton height="0.875rem" width="6rem" />
          </div>
        </div>
      </div>
      
      {/* Button */}
      <div className="flex justify-center">
        <Skeleton height="3rem" width="16rem" className="rounded-lg" />
      </div>
    </div>
  )
}

// Skeleton for AI response display
export function AIResponseSkeleton() {
  return (
    <div className="border-4 border-cyan-400 rounded-lg bg-black/90 overflow-hidden min-h-[400px]">
      {/* Terminal Header */}
      <div className="bg-gradient-to-r from-cyan-900/80 to-blue-900/80 border-b-2 border-cyan-400 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-300 font-mono text-sm font-bold">
              AI CAPTAIN TRANSMISSION
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-6 space-y-6">
        {/* Loading Animation */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-mono">
            <Zap className="w-4 h-4 animate-spin" />
            <span className="animate-pulse">GENERATING AI RESPONSE...</span>
          </div>
          
          {/* Scanning Animation */}
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-2 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-pulse"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  width: `${Math.random() * 60 + 40}%`
                }}
              />
            ))}
          </div>

          {/* Processing Steps */}
          <div className="space-y-2">
            <div className="text-green-400 font-mono text-sm animate-pulse">
              &gt; Analyzing goal...
            </div>
            <div className="text-green-400 font-mono text-sm animate-pulse" style={{animationDelay: '0.5s'}}>
              &gt; Processing excuse...
            </div>
            <div className="text-green-400 font-mono text-sm animate-pulse" style={{animationDelay: '1s'}}>
              &gt; Consulting AI Captain...
            </div>
            <div className="text-green-400 font-mono text-sm animate-pulse" style={{animationDelay: '1.5s'}}>
              &gt; Generating response...
            </div>
          </div>
        </div>

        {/* Response Placeholder */}
        <div className="border-4 border-cyan-500/50 rounded-lg p-6 bg-gradient-to-br from-cyan-900/10 to-blue-900/10 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm mb-4">
            <Terminal className="w-4 h-4" />
            AI CAPTAIN RESPONSE
          </div>
          
          <div className="space-y-2">
            <Skeleton height="1rem" width="100%" className="bg-cyan-400/20" />
            <Skeleton height="1rem" width="95%" className="bg-cyan-400/20" />
            <Skeleton height="1rem" width="88%" className="bg-cyan-400/20" />
            <Skeleton height="1rem" width="92%" className="bg-cyan-400/20" />
          </div>
          
          {/* Cursor */}
          <div className="text-yellow-400 animate-pulse font-mono text-lg">|</div>
        </div>
      </div>

      {/* Terminal Footer */}
      <div className="border-t-2 border-cyan-400 bg-gradient-to-r from-cyan-900/80 to-blue-900/80 p-3">
        <div className="flex justify-between items-center text-xs font-mono">
          <div className="text-cyan-400">
            AI CAPTAIN SYSTEM v2.1.0
          </div>
          <div className="flex items-center gap-4">
            <div className="text-green-400 flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              ONLINE
            </div>
            <div className="text-yellow-500">
              STATUS: PROCESSING
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Comprehensive loading skeleton for the entire dilemma component
export function BuildersDilemmaSkeleton() {
  return (
    <div className="border-4 border-yellow-500 rounded-lg overflow-hidden bg-gray-900">
      {/* Header */}
      <div className="bg-yellow-500 text-black p-4 flex justify-between items-center">
        <Skeleton height="2rem" width="18rem" className="bg-black/20" />
        <div className="hidden md:block">
          <Skeleton variant="circular" width="2rem" height="2rem" className="bg-black/20" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-800 border-b-2 border-yellow-500 p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton height="1rem" width="6rem" />
            <Skeleton height="0.875rem" width="10rem" />
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2 border border-gray-600">
            <div className="bg-gradient-to-r from-cyan-400 to-yellow-400 h-full rounded-full w-1/3 animate-pulse" />
          </div>

          <div className="flex justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center gap-2 text-xs">
                <Skeleton variant="circular" width="1.5rem" height="1.5rem" />
                <Skeleton height="0.875rem" width="3rem" className="hidden sm:block" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 min-h-[600px]">
        <GoalCardsSkeleton />
        
        {/* Navigation Button Skeleton */}
        <div className="flex justify-center mt-8">
          <Skeleton height="3.5rem" width="14rem" className="rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// Error state skeleton for failed loads
export function ErrorStateSkeleton({ 
  title = "LOADING FAILED",
  description = "Unable to load component data"
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="min-h-[300px] flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-red-500 rounded-full flex items-center justify-center bg-red-900/20 mx-auto">
          <div className="w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full animate-spin" />
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-red-400 retro-text mb-2">
            {title}
          </h3>
          <p className="text-red-300 font-mono text-sm">
            {description}
          </p>
        </div>
        
        <div className="space-y-2">
          <Skeleton height="0.875rem" width="12rem" className="mx-auto bg-red-400/20" />
          <Skeleton height="0.875rem" width="8rem" className="mx-auto bg-red-400/20" />
        </div>
      </div>
    </div>
  )
}

export default Skeleton