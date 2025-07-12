"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Star, Clock, Users, Search, Frown, ArrowRightLeft, Eye } from 'lucide-react'
import { SkillSwapRequestModal } from './skill-swap-request-modal'

interface Skill {
  id: string
  name: string
  proficiencyLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  category: string
  description?: string
}

interface UserProfile {
  id: string
  name: string
  avatar: string
  title: string
  skills: Skill[]
  rating: number
  reviewCount: number
  availability: string
  completedSwaps: number
  responseTime: string
  bio: string
}

interface SkillBrowserGridProps {
  profiles?: UserProfile[]
  currentUserSkills?: Skill[]
  isLoading?: boolean
  hasError?: boolean
  totalResults?: number
  onLoadMore?: () => void
  onSortChange?: (sortBy: string) => void
  onViewProfile?: (profileId: string) => void
  hasMoreResults?: boolean
  searchTerm?: string
  selectedSkills?: string[]
  onSwapRequest?: (data: any) => Promise<void>
}

const SkillBrowserGrid = ({
  profiles = [],
  currentUserSkills = [],
  isLoading = false,
  hasError = false,
  totalResults = 0,
  onLoadMore,
  onSortChange,
  onViewProfile,
  hasMoreResults = false,
  searchTerm = '',
  selectedSkills = [],
  onSwapRequest
}: SkillBrowserGridProps) => {
  const [sortBy, setSortBy] = useState('rating')
  const [displayedProfiles, setDisplayedProfiles] = useState<UserProfile[]>([])
  const [swapModalOpen, setSwapModalOpen] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    setDisplayedProfiles(profiles)
  }, [profiles])

  const handleSortChange = (value: string) => {
    setSortBy(value)
    onSortChange?.(value)
  }

  const handleSwapRequest = (profile: UserProfile) => {
    setSelectedProfile(profile)
    setSwapModalOpen(true)
  }

  const handleSubmitSwapRequest = async (data: any) => {
    if (onSwapRequest) {
      await onSwapRequest(data)
    }
    console.log('Skill swap request submitted:', data)
  }

  const SkeletonCard = () => (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-start gap-3 mb-3">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      
      <Skeleton className="h-8 w-full mb-3" />
      
      <div className="space-y-2 mb-4">
        <div className="flex flex-wrap gap-1">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-5 w-12 rounded" />
          ))}
        </div>
      </div>

      <Skeleton className="h-8 w-full" />
    </div>
  )

  const ProfileCard = ({ profile }: { profile: UserProfile }) => (
    <div
      className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => onViewProfile?.(profile.id)}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 flex-shrink-0">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-slate-900 truncate">
            {profile.name}
          </h3>
          <p className="text-xs text-slate-500 truncate mb-1">{profile.title}</p>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(profile.rating) 
                      ? 'text-amber-400 fill-amber-400' 
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-500">
              {profile.rating} ({profile.reviewCount})
            </span>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-slate-600 mb-3 line-clamp-2">
        {profile.bio || "Passionate about sharing knowledge and learning new skills together."}
      </p>
      
      <div className="space-y-2 mb-4">
        <div className="flex flex-wrap gap-1">
          {profile.skills.slice(0, 4).map((skill) => (
            <Badge key={skill.id || skill.name} variant="secondary" className="text-xs px-2 py-0.5">
              {skill.name}
            </Badge>
          ))}
          {profile.skills.length > 4 && (
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              +{profile.skills.length - 4}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{profile.responseTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{profile.completedSwaps} swaps</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs h-8 font-medium"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            handleSwapRequest(profile)
          }}
        >
          <ArrowRightLeft className="w-3 h-3 mr-1" />
          Request Swap
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-slate-200 text-slate-600 hover:bg-slate-50 h-8 px-3"
          onClick={(e) => {
            e.stopPropagation()
            onViewProfile?.(profile.id)
          }}
        >
          <Eye className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )

  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 mx-auto">
          <Users className="h-6 w-6 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          No profiles available
        </h3>
        <p className="text-slate-600 text-center max-w-md mb-6">
          Be the first to join our community of skilled professionals sharing knowledge together.
        </p>
        <Button className="bg-slate-900 hover:bg-slate-800 text-white">
          Create Profile
        </Button>
      </div>
    </div>
  )

  const ErrorState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4 mx-auto">
          <Frown className="h-6 w-6 text-red-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Something went wrong
        </h3>
        <p className="text-slate-600 text-center max-w-md mb-6">
          We couldn't load the profiles right now. Please try again in a moment.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    </div>
  )

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header with sort options and results count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="text-sm text-slate-600">
          {isLoading ? (
            <span>Finding amazing people...</span>
          ) : (
            <span>
              {totalResults > 0 ? (
                <>Showing {displayedProfiles.length} of {totalResults} talented people</>
              ) : (
                'No profiles found'
              )}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600 hidden sm:inline">Sort by:</span>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[140px] bg-white border-slate-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="availability">Availability</SelectItem>
              <SelectItem value="swaps">Most Swaps</SelectItem>
              <SelectItem value="response">Fastest Response</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {hasError ? (
          <ErrorState />
        ) : isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : displayedProfiles.length === 0 ? (
          <EmptyState />
        ) : (
          displayedProfiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))
        )}
      </div>

      {/* Load More Button */}
      {!isLoading && !hasError && hasMoreResults && displayedProfiles.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={onLoadMore}
            className="px-8 border-slate-200 hover:bg-slate-50"
          >
            Load More
          </Button>
        </div>
      )}

      {/* Skill Swap Request Modal */}
      {selectedProfile && (
        <SkillSwapRequestModal
          isOpen={swapModalOpen}
          onClose={() => {
            setSwapModalOpen(false)
            setSelectedProfile(null)
          }}
          targetUser={selectedProfile}
          currentUserSkills={currentUserSkills}
          onSubmitRequest={handleSubmitSwapRequest}
        />
      )}
    </div>
  )
}

export default SkillBrowserGrid