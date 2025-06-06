"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  Share2,
  MessageCircle,
  Bookmark,
  ChevronUp,
  ChevronDown,
  Search,
  Filter,
  X,
  ArrowUp,
  Info,
  Globe,
  Calendar,
  DollarSign,
  Clock,
  Activity,
  Award,
  MapPin,
  Compass,
  Mountain,
  Utensils,
  Star,
  Wallet,
  Building,
  Umbrella,
  Landmark,
  TreesIcon as Tree,
} from "lucide-react"
import {
  travelVideos,
  videoCategories,
  formatNumber,
  formatDuration,
  formatTimeAgo,
  getVideoById,
  getAuthorById,
  getCategoryById,
  searchVideos,
  type TravelVideo,
} from "./mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Get category icon
const getCategoryIcon = (categoryId: string) => {
  switch (categoryId) {
    case "adventure":
      return <Mountain className="h-4 w-4" />
    case "cultural":
      return <Landmark className="h-4 w-4" />
    case "luxury":
      return <Star className="h-4 w-4" />
    case "budget":
      return <Wallet className="h-4 w-4" />
    case "food":
      return <Utensils className="h-4 w-4" />
    case "nature":
      return <Tree className="h-4 w-4" />
    case "city":
      return <Building className="h-4 w-4" />
    case "beach":
      return <Umbrella className="h-4 w-4" />
    default:
      return <Compass className="h-4 w-4" />
  }
}

// Video Card Component
function VideoCard({
  video,
  isPlaying,
  isMuted,
  isExpanded,
  onPlay,
  onToggleExpand,
  onSelect,
  videoRef,
}: {
  video: TravelVideo
  isPlaying: boolean
  isMuted: boolean
  isExpanded: boolean
  onPlay: () => void
  onToggleExpand: () => void
  onSelect: () => void
  videoRef: (el: HTMLVideoElement | null) => void
}) {
  const author = getAuthorById(video.authorId)
  const category = getCategoryById(video.categoryId)

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full border border-amber-100 hover:shadow-lg transition-all duration-300"
      whileHover={{ y: -5 }}
      layout
    >
      {/* Video container */}
      <div className="relative aspect-video cursor-pointer" onClick={onPlay}>
        <video
          id={video.id}
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnailUrl}
          loop
          playsInline
          muted={isMuted}
          className="w-full h-full object-cover"
        />

        {/* Video overlay */}
        <div
          className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity ${isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"}`}
        >
          <button
            className="bg-amber-500/90 hover:bg-amber-600/90 text-white rounded-full p-3 transform transition-transform hover:scale-110"
            onClick={(e) => {
              e.stopPropagation()
              onPlay()
            }}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </button>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {formatDuration(video.duration)}
        </div>

        {/* Category badge */}
        <div className="absolute top-2 left-2 bg-amber-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          {getCategoryIcon(video.categoryId)}
          <span>{category?.name || video.categoryId}</span>
        </div>

        {/* Featured badge */}
        {video.featured && (
          <div className="absolute top-2 right-2 bg-orange-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Award className="h-3 w-3" />
            <span>Featured</span>
          </div>
        )}
      </div>

      {/* Video info */}
      <div className="p-4 flex-grow flex flex-col">
        <h3
          className="font-bold text-gray-800 mb-1 line-clamp-2 hover:text-amber-700 cursor-pointer"
          onClick={onSelect}
        >
          {video.title}
        </h3>

        {/* Author info */}
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-amber-100 mr-2">
            <img
              src={author?.avatar || "/placeholder.svg?height=32&width=32"}
              alt={author?.name || "Creator"}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">{author?.name || "Unknown creator"}</p>
            <div className="flex items-center text-xs text-gray-500">
              <span>{formatNumber(video.views)} views</span>
              <span className="mx-1">•</span>
              <span>{formatTimeAgo(video.publishedAt)}</span>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="h-4 w-4 text-amber-500 mr-1" />
          <span>
            {video.location.name}, {video.location.country}
          </span>
        </div>

        {/* Description */}
        <p className={`text-sm text-gray-600 mb-3 ${isExpanded ? "" : "line-clamp-2"}`}>{video.description}</p>

        {/* Expand/collapse button */}
        <button className="text-xs text-amber-600 hover:text-amber-800 flex items-center mb-3" onClick={onToggleExpand}>
          {isExpanded ? (
            <>
              <ChevronUp className="h-3 w-3 mr-1" />
              <span>Show less</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 mr-1" />
              <span>Show more</span>
            </>
          )}
        </button>

        {/* Tags */}
        {isExpanded && (
          <div className="flex flex-wrap gap-1 mb-3">
            {video.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Travel info */}
        {isExpanded && video.travelInfo && (
          <div className="bg-amber-50 rounded-lg p-3 mb-3 text-xs">
            <h4 className="font-medium text-amber-800 mb-1">Travel Information</h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 text-amber-600 mr-1" />
                <span className="text-gray-700">Best time: {video.travelInfo.bestTimeToVisit.join(", ")}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-3 w-3 text-amber-600 mr-1" />
                <span className="text-gray-700">
                  Budget: {video.travelInfo.budget.currency} {video.travelInfo.budget.min}-{video.travelInfo.budget.max}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 text-amber-600 mr-1" />
                <span className="text-gray-700">Duration: {video.travelInfo.duration}</span>
              </div>
              <div className="flex items-center">
                <Activity className="h-3 w-3 text-amber-600 mr-1" />
                <span className="text-gray-700">Difficulty: {video.travelInfo.difficulty}</span>
              </div>
            </div>
          </div>
        )}

        {/* Engagement stats */}
        <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <button className="flex items-center text-gray-600 hover:text-amber-600">
              <Heart className="h-4 w-4 mr-1" />
              <span className="text-xs">{formatNumber(video.likes)}</span>
            </button>
            <button className="flex items-center text-gray-600 hover:text-amber-600">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">{formatNumber(video.comments.length)}</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-gray-600 hover:text-amber-600">
              <Share2 className="h-4 w-4" />
            </button>
            <button className="text-gray-600 hover:text-amber-600">
              <Bookmark className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Video Detail View Component
function VideoDetailView({ videoId, onClose }: { videoId: string; onClose: () => void }) {
  const video = getVideoById(videoId)
  const author = video ? getAuthorById(video.authorId) : undefined
  const category = video ? getCategoryById(video.categoryId) : undefined

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Handle play/pause
  const togglePlay = () => {
    if (!videoRef.current) return

    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  // Handle mute/unmute
  const toggleMute = () => {
    if (!videoRef.current) return

    const newMutedState = !isMuted
    videoRef.current.muted = newMutedState
    setIsMuted(newMutedState)
  }

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return

    const newVolume = value[0]
    videoRef.current.volume = newVolume
    setVolume(newVolume)

    if (newVolume === 0) {
      setIsMuted(true)
      videoRef.current.muted = true
    } else if (isMuted) {
      setIsMuted(false)
      videoRef.current.muted = false
    }
  }

  // Update progress bar
  const handleTimeUpdate = () => {
    if (!videoRef.current) return

    const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
    setProgress(progress)
  }

  // Seek in video
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return

    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width

    videoRef.current.currentTime = pos * videoRef.current.duration
  }

  // Auto-play video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Auto-play was prevented, show play button
        setIsPlaying(false)
      })
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.pause()
      }
    }
  }, [videoId])

  if (!video) return null

  return (
    <div className="bg-white overflow-hidden">
      {/* Video player */}
      <div className="relative bg-black">
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnailUrl}
          className="w-full aspect-video object-contain"
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onClick={togglePlay}
        />

        {/* Video controls overlay */}
        <div
          className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity ${isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"}`}
        >
          <button
            className="bg-amber-500/90 hover:bg-amber-600/90 text-white rounded-full p-4 transform transition-transform hover:scale-110"
            onClick={(e) => {
              e.stopPropagation()
              togglePlay()
            }}
          >
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
          </button>
        </div>

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          {/* Progress bar */}
          <div className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer" onClick={handleSeek}>
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button className="text-white hover:text-amber-300" onClick={togglePlay}>
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </button>

              <button className="text-white hover:text-amber-300" onClick={toggleMute}>
                {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
              </button>

              <div className="w-24 hidden sm:block">
                <Slider
                  value={[volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="cursor-pointer"
                />
              </div>

              <span className="text-white text-sm">{formatDuration(video.duration)}</span>
            </div>

            <div className="flex items-center gap-3">
              <button className="text-white hover:text-amber-300">
                <Heart className="h-6 w-6" />
              </button>
              <button className="text-white hover:text-amber-300">
                <Share2 className="h-6 w-6" />
              </button>
              <button className="text-white hover:text-amber-300">
                <Bookmark className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video info */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{video.title}</h1>

        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-amber-100 mr-3">
              <img
                src={author?.avatar || "/placeholder.svg?height=48&width=48"}
                alt={author?.name || "Creator"}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium text-gray-800">{author?.name || "Unknown creator"}</p>
              <p className="text-sm text-gray-500">{formatNumber(author?.followers || 0)} followers</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
              Follow
            </Button>
            <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
              Visit Website
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">{category?.name || video.categoryId}</Badge>

          <Badge variant="outline" className="border-amber-200 text-amber-700">
            {video.location.name}, {video.location.country}
          </Badge>

          <Badge variant="outline" className="border-amber-200 text-amber-700">
            {formatNumber(video.views)} views
          </Badge>

          <Badge variant="outline" className="border-amber-200 text-amber-700">
            {formatTimeAgo(video.publishedAt)}
          </Badge>
        </div>

        <div className="mb-6">
          <h2 className="font-medium text-gray-800 mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{video.description}</p>
        </div>

        {/* Travel information */}
        {video.travelInfo && (
          <div className="bg-amber-50 rounded-lg p-4 mb-6">
            <h2 className="font-medium text-amber-800 mb-3 flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Travel Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800">Best Time to Visit</h3>
                  <p className="text-gray-700">{video.travelInfo.bestTimeToVisit.join(", ")}</p>
                </div>
              </div>

              <div className="flex items-start">
                <DollarSign className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800">Budget Range</h3>
                  <p className="text-gray-700">
                    {video.travelInfo.budget.currency} {video.travelInfo.budget.min.toLocaleString()} -{" "}
                    {video.travelInfo.budget.max.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800">Recommended Duration</h3>
                  <p className="text-gray-700">{video.travelInfo.duration}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Activity className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800">Difficulty Level</h3>
                  <p className="text-gray-700">{video.travelInfo.difficulty}</p>
                </div>
              </div>

              <div className="flex items-start md:col-span-2">
                <Globe className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-gray-800">Activities</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {video.travelInfo.activities.map((activity, index) => (
                      <Badge key={index} className="bg-amber-100 text-amber-800 border-amber-200">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="mb-6">
          <h2 className="font-medium text-gray-800 mb-2">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {video.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-amber-700 border-amber-200 hover:bg-amber-50 cursor-pointer"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div>
          <h2 className="font-medium text-gray-800 mb-4">Comments ({video.comments.length})</h2>

          <div className="space-y-4">
            {video.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-amber-100 flex-shrink-0">
                  <img
                    src={comment.author.avatar || "/placeholder.svg"}
                    alt={comment.author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-800">{comment.author.name}</p>
                    <span className="text-xs text-gray-500">{formatTimeAgo(comment.timestamp)}</span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button className="text-xs text-gray-500 hover:text-amber-600 flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span>{comment.likes}</span>
                    </button>
                    <button className="text-xs text-gray-500 hover:text-amber-600">Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comment input */}
          <div className="mt-6 flex gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-amber-100 flex-shrink-0">
              <img
                src="/placeholder.svg?height=40&width=40&text=You"
                alt="Your avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow">
              <Input
                placeholder="Add a comment..."
                className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
              />
              <div className="flex justify-end mt-2">
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TravellingMediaPage() {
  // State for videos and filtering
  const [videos, setVideos] = useState<TravelVideo[]>(travelVideos)
  const [filteredVideos, setFilteredVideos] = useState<TravelVideo[]>(travelVideos)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortOption, setSortOption] = useState<"popular" | "recent" | "trending">("popular")

  // State for video playback
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [expandedVideoId, setExpandedVideoId] = useState<string | null>(null)
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)

  // State for infinite scroll
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const videosPerPage = 8
  const observerTarget = useRef<HTMLDivElement>(null)

  // Refs for video elements
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({})

  // Filter videos based on active category and search query
  useEffect(() => {
    let results = [...travelVideos]

    // Filter by category
    if (activeCategory !== "all") {
      results = results.filter((video) => video.categoryId === activeCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      results = searchVideos(searchQuery)
    }

    // Sort videos
    if (sortOption === "recent") {
      results.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    } else if (sortOption === "popular") {
      results.sort((a, b) => b.views - a.views)
    } else if (sortOption === "trending") {
      results = results.filter((video) => video.trending).concat(results.filter((video) => !video.trending))
    }

    setFilteredVideos(results)
    setPage(1) // Reset pagination when filters change
    setVideos(results.slice(0, videosPerPage))
    setHasMore(results.length > videosPerPage)
  }, [activeCategory, searchQuery, sortOption])

  // Handle infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreVideos()
        }
      },
      { threshold: 0.1 },
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [hasMore, isLoading, filteredVideos])

  // Load more videos for infinite scrolling
  const loadMoreVideos = useCallback(() => {
    if (isLoading) return

    setIsLoading(true)

    // Simulate loading delay
    setTimeout(() => {
      const nextPage = page + 1
      const startIndex = page * videosPerPage
      const endIndex = nextPage * videosPerPage
      const nextVideos = filteredVideos.slice(startIndex, endIndex)

      if (nextVideos.length > 0) {
        setVideos((prevVideos) => [...prevVideos, ...nextVideos])
        setPage(nextPage)
        setHasMore(endIndex < filteredVideos.length)
      } else {
        setHasMore(false)
      }

      setIsLoading(false)
    }, 800)
  }, [page, filteredVideos, isLoading])

  // Handle scroll events for showing scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 500)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Handle video playback
  const handleVideoPlay = (videoId: string) => {
    // Pause currently playing video if different
    if (playingVideoId && playingVideoId !== videoId && videoRefs.current[playingVideoId]) {
      videoRefs.current[playingVideoId].pause()
    }

    // Play the new video
    if (videoRefs.current[videoId]) {
      const videoElement = videoRefs.current[videoId]

      if (videoElement.paused) {
        videoElement.play()
        setPlayingVideoId(videoId)
      } else {
        videoElement.pause()
        setPlayingVideoId(null)
      }
    }
  }

  // Toggle mute for all videos
  const toggleMute = () => {
    const newMutedState = !isMuted
    setIsMuted(newMutedState)

    // Apply to all video elements
    Object.values(videoRefs.current).forEach((video) => {
      video.muted = newMutedState
    })
  }

  // Toggle video info expansion
  const toggleVideoExpansion = (videoId: string) => {
    setExpandedVideoId(expandedVideoId === videoId ? null : videoId)
  }

  // Handle video selection for detailed view
  const handleVideoSelect = (videoId: string) => {
    setSelectedVideoId(videoId)

    // Pause the playing video if it exists
    if (playingVideoId && videoRefs.current[playingVideoId]) {
      videoRefs.current[playingVideoId].pause()
      setPlayingVideoId(null)
    }
  }

  // Close detailed view
  const handleCloseDetailView = () => {
    setSelectedVideoId(null)
  }

  // Set up video observers for autoplay when in viewport
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.7,
    }

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const videoId = entry.target.id

        if (entry.isIntersecting) {
          // Only autoplay if no other video is currently playing
          if (!playingVideoId && videoRefs.current[videoId]) {
            videoRefs.current[videoId].play()
            setPlayingVideoId(videoId)
          }
        } else {
          // Pause when out of view
          if (videoRefs.current[videoId] && !videoRefs.current[videoId].paused) {
            videoRefs.current[videoId].pause()
            if (playingVideoId === videoId) {
              setPlayingVideoId(null)
            }
          }
        }
      })
    }, options)

    // Observe all video elements
    Object.keys(videoRefs.current).forEach((videoId) => {
      if (videoRefs.current[videoId]) {
        videoObserver.observe(videoRefs.current[videoId])
      }
    })

    return () => {
      // Cleanup
      Object.keys(videoRefs.current).forEach((videoId) => {
        if (videoRefs.current[videoId]) {
          videoObserver.unobserve(videoRefs.current[videoId])
        }
      })
    }
  }, [videos, playingVideoId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-amber-500/10 to-orange-500/10 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-l from-amber-500/10 to-orange-500/10 -z-10"></div>

      <div className="container mx-auto px-4 py-8 max-w-[1920px] relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-transparent bg-clip-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Travel Video Showcase
          </motion.h1>

          <motion.p
            className="text-xl text-amber-800 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover amazing destinations and travel experiences through immersive videos
          </motion.p>
        </div>

        {/* Search and filter bar */}
        <div className="mb-8 bg-white bg-opacity-80 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-amber-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
              <Input
                type="text"
                placeholder="Search for destinations, experiences, or activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="pl-10 pr-10 py-6 rounded-lg border-2 border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400 bg-white text-gray-800 placeholder-gray-400 text-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </Button>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as "popular" | "recent" | "trending")}
                className="px-4 py-2 rounded-lg border-2 border-amber-300 bg-white text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="popular">Most Popular</option>
                <option value="recent">Most Recent</option>
                <option value="trending">Trending</option>
              </select>
            </div>
          </div>

          {/* Filter panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mt-4 pt-4 border-t border-amber-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Duration filter */}
                  <div>
                    <h3 className="font-medium text-amber-800 mb-2">Video Duration</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-amber-600 focus:ring-amber-500" />
                        <span className="ml-2 text-gray-700">Short (&lt; 5 min)</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-amber-600 focus:ring-amber-500" />
                        <span className="ml-2 text-gray-700">Medium (5-15 min)</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-amber-600 focus:ring-amber-500" />
                        <span className="ml-2 text-gray-700">Long (&gt; 15 min)</span>
                      </label>
                    </div>
                  </div>

                  {/* Upload date filter */}
                  <div>
                    <h3 className="font-medium text-amber-800 mb-2">Upload Date</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-amber-600 focus:ring-amber-500" />
                        <span className="ml-2 text-gray-700">Last week</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-amber-600 focus:ring-amber-500" />
                        <span className="ml-2 text-gray-700">Last month</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-amber-600 focus:ring-amber-500" />
                        <span className="ml-2 text-gray-700">Last 3 months</span>
                      </label>
                    </div>
                  </div>

                  {/* Features filter */}
                  <div>
                    <h3 className="font-medium text-amber-800 mb-2">Features</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-amber-600 focus:ring-amber-500" />
                        <span className="ml-2 text-gray-700">With travel guides</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-amber-600 focus:ring-amber-500" />
                        <span className="ml-2 text-gray-700">Budget friendly</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded text-amber-600 focus:ring-amber-500" />
                        <span className="ml-2 text-gray-700">Family friendly</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    className="mr-2 border-amber-300 text-amber-700 hover:bg-amber-100"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category tabs */}
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="bg-white/70 p-1 rounded-xl mb-4 flex flex-nowrap overflow-x-auto hide-scrollbar">
            <TabsTrigger
              value="all"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === "all" ? "bg-amber-500 text-white shadow-sm" : "text-amber-800 hover:bg-amber-100"
              }`}
            >
              <Compass className="h-4 w-4" />
              <span>All Videos</span>
            </TabsTrigger>

            {videoCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? "bg-amber-500 text-white shadow-sm"
                    : "text-amber-800 hover:bg-amber-100"
                }`}
              >
                {getCategoryIcon(category.id)}
                <span>{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Video grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              isPlaying={playingVideoId === video.id}
              isMuted={isMuted}
              isExpanded={expandedVideoId === video.id}
              onPlay={() => handleVideoPlay(video.id)}
              onToggleExpand={() => toggleVideoExpansion(video.id)}
              onSelect={() => handleVideoSelect(video.id)}
              videoRef={(el) => {
                if (el) {
                  videoRefs.current[video.id] = el
                  el.muted = isMuted
                }
              }}
            />
          ))}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-amber-800 font-medium">Loading more videos...</p>
            </div>
          </div>
        )}

        {/* Observer target for infinite scroll */}
        <div ref={observerTarget} className="h-4 mt-8"></div>

        {/* No results message */}
        {filteredVideos.length === 0 && (
          <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-lg p-8 text-center shadow-md">
            <p className="text-gray-600 text-lg">No videos found matching your criteria.</p>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search term.</p>
            <Button
              className="mt-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              onClick={() => {
                setSearchQuery("")
                setActiveCategory("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Floating controls */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-30">
        {/* Mute/unmute button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>{isMuted ? "Unmute videos" : "Mute videos"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Scroll to top button */}
        <AnimatePresence>
          {showScrollToTop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      className="rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg"
                      onClick={scrollToTop}
                    >
                      <ArrowUp className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Scroll to top</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Video detail modal */}
      <Dialog open={!!selectedVideoId} onOpenChange={(open) => !open && handleCloseDetailView()}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
          {selectedVideoId && <VideoDetailView videoId={selectedVideoId} onClose={handleCloseDetailView} />}
        </DialogContent>
      </Dialog>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        .animate-pulse-slow {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
