"use client"

import React, { useState, useRef, KeyboardEvent, ChangeEvent } from 'react'
import { X, Upload, Camera, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface FormData {
  fullName: string
  bio: string
  location: string
  profilePhoto: File | null
  hourlyAvailability: boolean
  skills: string[]
}

interface FormErrors {
  fullName?: string
  bio?: string
  location?: string
  profilePhoto?: string
  skills?: string
}

interface ProfileEditFormProps {
  initialData?: Partial<FormData>
  onSave?: (data: FormData) => void
  onCancel?: () => void
  isLoading?: boolean
}

export default function ProfileEditForm({
  initialData = {},
  onSave,
  onCancel,
  isLoading = false
}: ProfileEditFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: initialData.fullName || '',
    bio: initialData.bio || '',
    location: initialData.location || '',
    profilePhoto: initialData.profilePhoto || null,
    hourlyAvailability: initialData.hourlyAvailability || false,
    skills: initialData.skills || []
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [skillInput, setSkillInput] = useState('')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters'
    }

    if (formData.bio.length > 500) {
      newErrors.bio = 'Bio must be 500 characters or less'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (formData.skills.length === 0) {
      newErrors.skills = 'Please add at least one skill'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear specific field error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSkill()
    }
  }

  const addSkill = () => {
    const trimmedSkill = skillInput.trim()
    if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, trimmedSkill]
      }))
      setSkillInput('')
      
      // Clear skills error when adding a skill
      if (errors.skills) {
        setErrors(prev => ({ ...prev, skills: undefined }))
      }
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, profilePhoto: 'Photo must be less than 5MB' }))
        return
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, profilePhoto: 'Please select a valid image file' }))
        return
      }

      setFormData(prev => ({ ...prev, profilePhoto: file }))
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      
      // Clear photo error
      setErrors(prev => ({ ...prev, profilePhoto: undefined }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave?.(formData)
    }
  }

  return (
    <div className="bg-card rounded-lg p-8 border border-border max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary mb-2">Edit Profile</h2>
        <p className="text-text-secondary">Update your profile information to showcase your skills and availability.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Photo Section */}
        <div className="space-y-3">
          <Label htmlFor="profile-photo" className="text-sm font-medium text-text-primary">
            Profile Photo
          </Label>
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-lg border-2 border-dashed border-border bg-muted flex items-center justify-center overflow-hidden">
                {photoPreview ? (
                  <img 
                    src={photoPreview} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="profile-photo"
                aria-describedby={errors.profilePhoto ? "photo-error" : "photo-help"}
              />
            </div>
            <div className="flex-1 space-y-3">
              <Button 
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
              <p className="text-xs text-text-secondary" id="photo-help">
                JPG, PNG, or GIF. Max size 5MB. Square images work best.
              </p>
              {errors.profilePhoto && (
                <p className="text-xs text-destructive" id="photo-error">
                  {errors.profilePhoto}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="fullName" className="text-sm font-medium text-text-primary">
              Full Name *
            </Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className={`rounded-lg border-2 transition-colors focus:border-primary focus:ring-primary ${
                errors.fullName ? 'border-destructive' : 'border-input'
              }`}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
              aria-invalid={!!errors.fullName}
            />
            {errors.fullName && (
              <p className="text-xs text-destructive" id="fullName-error">
                {errors.fullName}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="location" className="text-sm font-medium text-text-primary">
              Location *
            </Label>
            <Input
              id="location"
              type="text"
              placeholder="City, State/Country"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className={`rounded-lg border-2 transition-colors focus:border-primary focus:ring-primary ${
                errors.location ? 'border-destructive' : 'border-input'
              }`}
              aria-describedby={errors.location ? "location-error" : undefined}
              aria-invalid={!!errors.location}
            />
            {errors.location && (
              <p className="text-xs text-destructive" id="location-error">
                {errors.location}
              </p>
            )}
          </div>
        </div>

        {/* Bio Section */}
        <div className="space-y-3">
          <Label htmlFor="bio" className="text-sm font-medium text-text-primary">
            Bio
          </Label>
          <Textarea
            id="bio"
            placeholder="Tell others about yourself, your experience, and what you're passionate about..."
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            className={`rounded-lg border-2 transition-colors focus:border-primary focus:ring-primary min-h-[120px] resize-none ${
              errors.bio ? 'border-destructive' : 'border-input'
            }`}
            maxLength={500}
            aria-describedby={errors.bio ? "bio-error" : "bio-help"}
            aria-invalid={!!errors.bio}
          />
          <div className="flex justify-between items-start">
            <p className="text-xs text-text-secondary" id="bio-help">
              Share your background, interests, and what makes you unique.
            </p>
            <span className={`text-xs ${
              formData.bio.length > 450 ? 'text-warning' : 'text-text-secondary'
            }`}>
              {formData.bio.length}/500
            </span>
          </div>
          {errors.bio && (
            <p className="text-xs text-destructive" id="bio-error">
              {errors.bio}
            </p>
          )}
        </div>

        {/* Skills Section */}
        <div className="space-y-4">
          <Label htmlFor="skills-input" className="text-sm font-medium text-text-primary">
            Skills *
          </Label>
          
          {/* Skills Tags Display */}
          {formData.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-primary hover:text-primary/70 transition-colors"
                    aria-label={`Remove ${skill} skill`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Skills Input */}
          <div className="flex gap-3">
            <Input
              id="skills-input"
              type="text"
              placeholder="Type a skill and press Enter"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              className={`rounded-lg border-2 transition-colors focus:border-primary focus:ring-primary flex-1 ${
                errors.skills ? 'border-destructive' : 'border-input'
              }`}
              aria-describedby={errors.skills ? "skills-error" : "skills-help"}
              aria-invalid={!!errors.skills}
            />
            <Button
              type="button"
              variant="outline"
              onClick={addSkill}
              disabled={!skillInput.trim()}
              className="rounded-lg px-4"
              aria-label="Add skill"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-xs text-text-secondary" id="skills-help">
            Add skills you can teach or want to learn. Press Enter or comma to add each skill.
          </p>
          
          {errors.skills && (
            <p className="text-xs text-destructive" id="skills-error">
              {errors.skills}
            </p>
          )}
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="space-y-1">
            <Label htmlFor="hourly-availability" className="text-sm font-medium text-text-primary">
              Available for Hourly Sessions
            </Label>
            <p className="text-xs text-text-secondary">
              Enable this to show you're available for scheduled learning sessions.
            </p>
          </div>
          <Switch
            id="hourly-availability"
            checked={formData.hourlyAvailability}
            onCheckedChange={(checked) => handleInputChange('hourlyAvailability', checked)}
            className="ml-4"
          />
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
          <Button
            type="submit"
            disabled={isLoading}
            className="rounded-lg px-8 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg px-8 py-2.5"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}