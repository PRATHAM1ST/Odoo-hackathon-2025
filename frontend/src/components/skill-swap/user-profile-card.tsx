"use client"

import React, { useState } from 'react'
import { Star, User, ArrowRightLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SkillSwapRequestModal } from './skill-swap-request-modal'

interface Skill {
  id: string
  name: string
  proficiencyLevel?: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  level?: number
  category?: string
  description?: string
}

interface UserProfileCardProps {
  id: string
  name: string
  avatar?: string
  title?: string
  bio: string
  rating: number
  reviewCount: number
  offeringSkills: Skill[]
  seekingSkills: Skill[]
  currentUserSkills?: Skill[]
  onConnect: (userId: string) => void
  onViewProfile?: (userId: string) => void
  onSwapRequest?: (data: any) => Promise<void>
}

export default function UserProfileCard({
  id,
  name,
  avatar,
  title,
  bio,
  rating,
  reviewCount,
  offeringSkills,
  seekingSkills,
  currentUserSkills = [],
  onConnect,
  onViewProfile,
  onSwapRequest
}: UserProfileCardProps) {
  const [swapModalOpen, setSwapModalOpen] = useState(false)

  const handleConnect = () => {
    setSwapModalOpen(true)
  }

  const handleViewProfile = () => {
    onViewProfile?.(id)
  }

  const handleSubmitSwapRequest = async (data: any) => {
    if (onSwapRequest) {
      await onSwapRequest(data)
    }
    onConnect(id)
    console.log('Skill swap request submitted:', data)
  }

  // Convert skills to ensure they have the required format for the modal
  const formattedOfferingSkills = offeringSkills.map(skill => ({
    id: skill.id,
    name: skill.name,
    proficiencyLevel: skill.proficiencyLevel || (skill.level && skill.level >= 80 ? "Expert" : skill.level && skill.level >= 60 ? "Advanced" : skill.level && skill.level >= 40 ? "Intermediate" : "Beginner") as "Beginner" | "Intermediate" | "Advanced" | "Expert",
    category: skill.category || "General",
    description: skill.description
  }))

  const userProfile = {
    id,
    name,
    avatar: avatar || '',
    title: title || '',
    skills: formattedOfferingSkills
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
        )
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative h-3 w-3">
            <Star className="h-3 w-3 text-slate-300 absolute" />
            <div className="overflow-hidden w-1/2 absolute">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            </div>
          </div>
        )
      } else {
        stars.push(
          <Star key={i} className="h-3 w-3 text-slate-300" />
        )
      }
    }

    return stars
  }

  return (
    <>
      <div
        className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
        onClick={handleViewProfile}
      >
        {/* Profile Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden flex-shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-500">
                <User className="h-5 w-5" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-slate-900 truncate">
              {name}
            </h3>
            
            {/* Rating */}
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center gap-0.5">
                {renderStars(rating)}
              </div>
              <span className="text-xs text-slate-500">
                {rating.toFixed(1)} ({reviewCount})
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-600 mb-3 line-clamp-2 leading-relaxed">
          {bio}
        </p>

        {/* Skills Section */}
        <div className="space-y-2 mb-4">
          {/* Offering Skills */}
          {offeringSkills.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-slate-700 mb-1">
                Teaching
              </h4>
              <div className="flex flex-wrap gap-1">
                {offeringSkills.slice(0, 3).map((skill, index) => (
                  <Badge
                    key={skill.id || index}
                    className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 text-xs px-2 py-0.5"
                  >
                    {skill.name}
                  </Badge>
                ))}
                {offeringSkills.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    +{offeringSkills.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Seeking Skills */}
          {seekingSkills.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-slate-700 mb-1">
                Learning
              </h4>
              <div className="flex flex-wrap gap-1">
                {seekingSkills.slice(0, 3).map((skill, index) => (
                  <Badge
                    key={skill.id || index}
                    className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 text-xs px-2 py-0.5"
                  >
                    {skill.name}
                  </Badge>
                ))}
                {seekingSkills.length > 3 && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    +{seekingSkills.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Button - Only Skill Swap */}
        <div className="flex gap-2">
          <Button
            onClick={(e) => {
              e.stopPropagation()
              handleConnect()
            }}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs h-8 font-medium"
            size="sm"
          >
            <ArrowRightLeft className="h-3 w-3 mr-1" />
            Request Skill Swap
          </Button>
        </div>
      </div>

      {/* Skill Swap Request Modal */}
      <SkillSwapRequestModal
        isOpen={swapModalOpen}
        onClose={() => setSwapModalOpen(false)}
        targetUser={userProfile}
        currentUserSkills={currentUserSkills}
        onSubmitRequest={handleSubmitSwapRequest}
      />
    </>
  )
}