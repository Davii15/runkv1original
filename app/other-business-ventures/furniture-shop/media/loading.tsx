"use client"

import { motion } from "framer-motion"
import {
  Sofa,
  Bed,
  Armchair,
  Coffee,
  UtensilsCrossed,
  Briefcase,
  Play,
  Heart,
  MessageCircle,
  Share2,
  Loader2,
} from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-700 flex flex-col">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 border-b border-purple-700 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <div className="h-8 w-64 bg-purple-800/50 rounded-md mb-2 animate-pulse"></div>
              <div className="h-4 w-80 bg-purple-800/50 rounded-md animate-pulse"></div>
            </div>

            {/* Category filters skeleton */}
            <div className="flex flex-wrap justify-center md:justify-end gap-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-24 bg-purple-800/50 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative bg-gradient-to-b from-purple-900/90 to-indigo-900/90 rounded-xl overflow-hidden shadow-xl border border-purple-700/30 backdrop-blur-sm"
            >
              {/* Video container skeleton */}
              <div className="relative aspect-[9/16] bg-purple-800/50 animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/40 rounded-full p-3">
                    <Play className="h-8 w-8 text-purple-600/50" />
                  </div>
                </div>

                {/* Category badge skeleton */}
                <div className="absolute top-3 right-3">
                  <div className="h-6 w-24 bg-purple-700/50 rounded-full"></div>
                </div>

                {/* Featured badge skeleton */}
                <div className="absolute top-3 left-3">
                  <div className="h-6 w-20 bg-purple-700/50 rounded-full"></div>
                </div>
              </div>

              {/* Video info skeleton */}
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-purple-700/50 animate-pulse"></div>

                  <div className="flex-1">
                    <div className="h-5 w-32 bg-purple-700/50 rounded-md mb-2 animate-pulse"></div>
                    <div className="h-3 w-24 bg-purple-700/50 rounded-md animate-pulse"></div>
                  </div>
                </div>

                <div className="h-6 w-full bg-purple-700/50 rounded-md mb-2 animate-pulse"></div>
                <div className="h-4 w-full bg-purple-700/50 rounded-md mb-2 animate-pulse"></div>
                <div className="h-4 w-3/4 bg-purple-700/50 rounded-md mb-4 animate-pulse"></div>

                {/* Video stats skeleton */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-purple-800">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4 text-purple-700/50" />
                      <div className="h-4 w-8 bg-purple-700/50 rounded-md animate-pulse"></div>
                    </div>

                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4 text-purple-700/50" />
                      <div className="h-4 w-8 bg-purple-700/50 rounded-md animate-pulse"></div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Share2 className="h-4 w-4 text-purple-700/50" />
                      <div className="h-4 w-8 bg-purple-700/50 rounded-md animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Loading indicator */}
        <div className="flex justify-center items-center py-12">
          <div className="bg-purple-900/80 p-4 rounded-full backdrop-blur-sm flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-purple-300" />
            <span className="text-purple-200 font-medium">Loading furniture videos...</span>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-1/4 left-1/4 opacity-10">
          <Sofa className="h-32 w-32 text-purple-500" />
        </div>
        <div className="absolute top-1/3 right-1/4 opacity-10">
          <Bed className="h-24 w-24 text-indigo-500" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 opacity-10">
          <Armchair className="h-28 w-28 text-purple-500" />
        </div>
        <div className="absolute bottom-1/3 right-1/3 opacity-10">
          <Coffee className="h-20 w-20 text-indigo-500" />
        </div>
        <div className="absolute top-2/3 left-1/2 opacity-10">
          <UtensilsCrossed className="h-36 w-36 text-purple-500" />
        </div>
        <div className="absolute top-1/2 right-1/5 opacity-10">
          <Briefcase className="h-16 w-16 text-indigo-500" />
        </div>
      </div>
    </div>
  )
}
