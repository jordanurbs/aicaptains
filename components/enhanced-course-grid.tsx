"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ChevronRight, Star, Clock, Zap, Search, Filter, Award, BookOpen, Code, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSound } from "@/components/sound-provider"

// Course data with metadata
interface Course {
  id: string
  title: string
  image: string
  url: string
  difficulty: number // 1-5 stars
  estimatedTime: string
  type: 'free' | 'paid'
  level: 'beginner' | 'intermediate' | 'advanced'
  description: string
  category: string
  isNew?: boolean
  progress?: number // 0-100 for progression indicator
}

const courses: Course[] = [
  // Existing courses
  {
    id: 'ccc',
    title: 'CONTENT COMMANDER CHALLENGE',
    image: '/images/courses/ccc-min.png',
    url: 'https://skool.com/aicaptains',
    difficulty: 3,
    estimatedTime: '2 weeks',
    type: 'free',
    level: 'beginner',
    description: 'Master content creation with AI-powered workflows',
    category: 'Content Creation',
    progress: 0
  },
  {
    id: 'conversation-driven-dev',
    title: 'CONVERSATION-DRIVEN DEVELOPMENT',
    image: '/images/courses/Conversation-Driven-Development-min-min.png',
    url: 'https://skool.com/aicaptains',
    difficulty: 4,
    estimatedTime: '3 weeks',
    type: 'paid',
    level: 'intermediate',
    description: 'Build applications through natural language programming',
    category: 'Development',
    isNew: true,
    progress: 0
  },
  {
    id: 'architectural-literacy',
    title: 'ARCHITECTURAL LITERACY CRASH COURSE',
    image: '/images/courses/architectural-literacy-min.png',
    url: 'https://skool.com/aicaptains',
    difficulty: 5,
    estimatedTime: '1 week',
    type: 'free',
    level: 'advanced',
    description: 'Essential software architecture patterns and principles',
    category: 'Architecture',
    isNew: true,
    progress: 0
  },
  {
    id: 'vibe-coding',
    title: 'VIBE CODING PRINCIPLES',
    image: '/images/courses/vibe-principles-min-min.png',
    url: 'https://skool.com/aicaptains',
    difficulty: 2,
    estimatedTime: '5 days',
    type: 'free',
    level: 'beginner',
    description: 'Intuitive coding practices for flow state development',
    category: 'Development',
    isNew: true,
    progress: 0
  },
  {
    id: 'python-scraping',
    title: 'PYTHON WEB SCRAPING COMMAND CENTER',
    image: '/images/courses/python-scraping-min.png',
    url: 'https://skool.com/aicaptains',
    difficulty: 4,
    estimatedTime: '2 weeks',
    type: 'paid',
    level: 'intermediate',
    description: 'Advanced web scraping and data extraction techniques',
    category: 'Data Mining',
    isNew: true,
    progress: 0
  },
  {
    id: 'ai-data-intelligence',
    title: 'AI-POWERED DATA INTELLIGENCE',
    image: '/images/courses/vibe-processing-ai-powered-data-intelligence.png',
    url: 'https://skool.com/aicaptains',
    difficulty: 5,
    estimatedTime: '4 weeks',
    type: 'paid',
    level: 'advanced',
    description: 'Transform raw data into actionable business insights',
    category: 'Data Science',
    isNew: true,
    progress: 0
  },
  {
    id: 'master-your-ide',
    title: 'MASTER YOUR IDE',
    image: '/images/courses/master-your-ide-min-min.png',
    url: 'https://skool.com/aicaptains',
    difficulty: 3,
    estimatedTime: '2 weeks',
    type: 'paid',
    level: 'intermediate',
    description: 'Maximize productivity with advanced IDE techniques and shortcuts',
    category: 'Development Tools',
    isNew: true,
    progress: 0
  },
  {
    id: 'prompt-directory-playbook',
    title: 'PROMPT YOUR DIRECTORY PLAYBOOK',
    image: '/images/courses/promptyourdirectoryplaybook-min-min.png',
    url: 'https://skool.com/aicaptains',
    difficulty: 3,
    estimatedTime: '1 week',
    type: 'free',
    level: 'intermediate',
    description: 'Strategic prompt engineering for directory and file management',
    category: 'AI Tools',
    isNew: true,
    progress: 0
  }
]

const filterOptions = [
  { id: 'all', label: 'ALL COURSES', icon: BookOpen },
  { id: 'free', label: 'FREE', icon: Zap },
  { id: 'paid', label: 'PAID', icon: Award },
  { id: 'beginner', label: 'BEGINNER', icon: Target },
  { id: 'advanced', label: 'ADVANCED', icon: Code }
]

export function EnhancedCourseGrid() {
  const [selectedItem, setSelectedItem] = useState(0)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredCourses, setFilteredCourses] = useState(courses)
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null)
  const { playSound } = useSound()

  // Filter courses based on active filter and search query
  useEffect(() => {
    let filtered = courses

    // Apply filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(course => {
        switch (activeFilter) {
          case 'free':
            return course.type === 'free'
          case 'paid':
            return course.type === 'paid'
          case 'beginner':
            return course.level === 'beginner'
          case 'advanced':
            return course.level === 'advanced'
          default:
            return true
        }
      })
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredCourses(filtered)
    setSelectedItem(0) // Reset selection when filters change
  }, [activeFilter, searchQuery])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const gridCols = window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 3 : window.innerWidth >= 640 ? 2 : 1
      const totalItems = filteredCourses.length
      
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault()
          playSound('scroll')
          setSelectedItem(prev => (prev + 1) % totalItems)
          break
        case 'ArrowLeft':
          e.preventDefault()
          playSound('scroll')
          setSelectedItem(prev => (prev - 1 + totalItems) % totalItems)
          break
        case 'ArrowDown':
          e.preventDefault()
          playSound('scroll')
          setSelectedItem(prev => Math.min(prev + gridCols, totalItems - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          playSound('scroll')
          setSelectedItem(prev => Math.max(prev - gridCols, 0))
          break
        case 'Enter':
          if (filteredCourses[selectedItem]?.url !== '#') {
            e.preventDefault()
            playSound('click')
            window.open(filteredCourses[selectedItem].url, '_blank')
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [filteredCourses, selectedItem, playSound])

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(filterId)
    playSound('select')
  }

  const handleCourseClick = (course: Course, index: number) => {
    setSelectedItem(index)
    playSound('click')
    if (course.url !== '#') {
      window.open(course.url, '_blank')
    }
  }

  const handleCourseHover = (courseId: string) => {
    setHoveredCourse(courseId)
    playSound('hover')
  }

  return (
    <section id="power-up-section" className="border-4 border-yellow-500 rounded-lg overflow-hidden bg-gray-900">
      {/* Header */}
      <div className="bg-yellow-500 text-black p-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold retro-text">SELECT YOUR POWER-UP</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm font-bold">
            {filteredCourses.length} / {courses.length} COURSES
          </div>
          <ChevronRight className="w-6 h-6" />
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="p-4 border-b-2 border-yellow-500">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="SEARCH COURSES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border-2 border-gray-700 text-white pl-10 pr-4 py-2 rounded focus:border-cyan-400 focus:outline-none retro-text"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((filter) => {
            const IconComponent = filter.icon
            return (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                size="sm"
                className={`retro-button ${
                  activeFilter === filter.id
                    ? 'bg-cyan-400 text-black border-cyan-400'
                    : 'bg-transparent text-cyan-400 border-cyan-400 hover:bg-cyan-400 hover:text-black'
                } font-bold`}
                onClick={() => handleFilterClick(filter.id)}
                onMouseEnter={() => playSound('hover')}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {filter.label}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Course Grid */}
      <div className="p-4">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto mb-2" />
              <p className="text-xl retro-text">NO COURSES FOUND</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
            <Button
              onClick={() => {
                setSearchQuery('')
                setActiveFilter('all')
                playSound('select')
              }}
              className="retro-button bg-yellow-500 text-black hover:bg-cyan-400"
            >
              RESET FILTERS
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCourses.map((course, index) => (
              <div
                key={course.id}
                className={`relative border-4 ${
                  selectedItem === index ? "border-cyan-400 blink" : "border-gray-700"
                } rounded-lg overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 ${
                  hoveredCourse === course.id ? 'shadow-lg shadow-cyan-400/50' : ''
                }`}
                onClick={() => handleCourseClick(course, index)}
                onMouseEnter={() => handleCourseHover(course.id)}
                onMouseLeave={() => setHoveredCourse(null)}
              >
                {/* New Course Badge */}
                {course.isNew && (
                  <div className="absolute top-2 right-2 z-10 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                    NEW!
                  </div>
                )}

                {/* Course Image */}
                <div className="relative h-48">
                  <Image
                    src={course.image}
                    alt={course.title}
                    width={400}
                    height={225}
                    className="w-full h-full object-contain bg-black"
                    priority={index < 4}
                  />

                  {/* Progress Bar */}
                  {course.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-1">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-center text-green-400 mt-1">
                        {course.progress}% COMPLETE
                      </p>
                    </div>
                  )}
                </div>

                {/* Course Info Section */}
                <div className="bg-black p-3">
                  <p className="text-yellow-500 text-sm font-bold mb-2 truncate">
                    {course.title}
                  </p>
                  
                  {/* Metadata */}
                  <div className="space-y-2">
                    {/* Difficulty Stars */}
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${
                              i < course.difficulty 
                                ? 'text-yellow-500 fill-yellow-500' 
                                : 'text-gray-600'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">
                        {course.level.toUpperCase()}
                      </span>
                    </div>

                    {/* Time and Type */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-cyan-400">
                        <Clock className="w-3 h-3" />
                        {course.estimatedTime}
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-bold ${
                        course.type === 'free' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-purple-600 text-white'
                      }`}>
                        {course.type.toUpperCase()}
                      </div>
                    </div>

                    {/* Category */}
                    <div className="text-xs text-gray-400 truncate">
                      {course.category}
                    </div>
                  </div>
                </div>

                {/* Hover Preview */}
                {hoveredCourse === course.id && (
                  <div className="absolute inset-0 bg-black bg-opacity-95 p-4 flex flex-col justify-center text-center opacity-0 animate-fadeIn">
                    <p className="text-cyan-400 text-sm mb-2 font-bold">
                      {course.title}
                    </p>
                    <p className="text-gray-300 text-xs leading-relaxed">
                      {course.description}
                    </p>
                    {course.url !== '#' && (
                      <p className="text-yellow-500 text-xs mt-2 animate-pulse">
                        CLICK TO ENTER
                      </p>
                    )}
                    {course.url === '#' && (
                      <p className="text-gray-500 text-xs mt-2">
                        COMING SOON
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Hint */}
      <div className="p-4 border-t-2 border-yellow-500 bg-gray-800">
        <p className="text-xs text-gray-400 text-center">
          Use ARROW KEYS to navigate • ENTER to select • Type to search
        </p>
      </div>
    </section>
  )
}