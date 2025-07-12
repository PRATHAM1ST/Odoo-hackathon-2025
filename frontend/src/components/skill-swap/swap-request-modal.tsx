"use client"

import { useState } from "react"
import { X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Recipient {
  id: string
  name: string
  email: string
  avatar?: string
  skills: string[]
  location?: string
  rating?: number
}

interface SwapRequestModalProps {
  isOpen: boolean
  onClose: () => void
  recipient: Recipient
  onSubmit: (requestData: SwapRequestData) => Promise<void>
}

interface SwapRequestData {
  skillWanted: string
  skillOffered: string
  schedule: string
  message?: string
}

export default function SwapRequestModal({
  isOpen,
  onClose,
  recipient,
  onSubmit,
}: SwapRequestModalProps) {
  const [formData, setFormData] = useState<SwapRequestData>({
    skillWanted: "",
    skillOffered: "",
    schedule: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const maxMessageLength = 500
  const maxScheduleLength = 200

  const handleInputChange = (field: keyof SwapRequestData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.skillWanted.trim()) {
      newErrors.skillWanted = "Please specify what skill you want to learn"
    }
    if (!formData.skillOffered.trim()) {
      newErrors.skillOffered = "Please specify what skill you're offering"
    }
    if (!formData.schedule.trim()) {
      newErrors.schedule = "Please provide your proposed schedule"
    }
    if (formData.schedule.length > maxScheduleLength) {
      newErrors.schedule = `Schedule must be ${maxScheduleLength} characters or less`
    }
    if (formData.message && formData.message.length > maxMessageLength) {
      newErrors.message = `Message must be ${maxMessageLength} characters or less`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      setFormData({
        skillWanted: "",
        skillOffered: "",
        schedule: "",
        message: "",
      })
      onClose()
    } catch (error) {
      console.error("Failed to send swap request:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  if (!isOpen) return null

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={recipient.avatar} alt={recipient.name} />
              <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                {getInitials(recipient.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Send Swap Request
              </h2>
              <p className="text-sm text-muted-foreground">
                to {recipient.name}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={isSubmitting}
            className="h-8 w-8 rounded-full hover:bg-muted"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Recipient Profile Summary */}
        <div className="p-6 bg-muted/30 border-b border-border">
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={recipient.avatar} alt={recipient.name} />
              <AvatarFallback className="bg-muted text-muted-foreground font-medium text-lg">
                {getInitials(recipient.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">
                {recipient.name}
              </h3>
              {recipient.location && (
                <p className="text-sm text-muted-foreground mb-2">
                  {recipient.location}
                </p>
              )}
              {recipient.skills.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">
                    Available Skills:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recipient.skills.slice(0, 5).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {recipient.skills.length > 5 && (
                      <span className="text-xs text-muted-foreground">
                        +{recipient.skills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Skill Wanted */}
          <div className="space-y-2">
            <Label htmlFor="skillWanted" className="text-sm font-medium text-foreground">
              What skill do you want to learn?
            </Label>
            <Input
              id="skillWanted"
              value={formData.skillWanted}
              onChange={(e) => handleInputChange("skillWanted", e.target.value)}
              placeholder="e.g., Web Design, Photography, Cooking"
              className={`rounded-xl ${errors.skillWanted ? "border-destructive" : ""}`}
              disabled={isSubmitting}
            />
            {errors.skillWanted && (
              <p className="text-sm text-destructive">{errors.skillWanted}</p>
            )}
          </div>

          {/* Skill Offered */}
          <div className="space-y-2">
            <Label htmlFor="skillOffered" className="text-sm font-medium text-foreground">
              What skill are you offering in exchange?
            </Label>
            <Input
              id="skillOffered"
              value={formData.skillOffered}
              onChange={(e) => handleInputChange("skillOffered", e.target.value)}
              placeholder="e.g., Programming, Guitar Lessons, Language Tutoring"
              className={`rounded-xl ${errors.skillOffered ? "border-destructive" : ""}`}
              disabled={isSubmitting}
            />
            {errors.skillOffered && (
              <p className="text-sm text-destructive">{errors.skillOffered}</p>
            )}
          </div>

          {/* Schedule */}
          <div className="space-y-2">
            <Label htmlFor="schedule" className="text-sm font-medium text-foreground">
              Proposed Schedule/Timing
            </Label>
            <Input
              id="schedule"
              value={formData.schedule}
              onChange={(e) => handleInputChange("schedule", e.target.value)}
              placeholder="e.g., Weekends, 2 hours per week, Flexible evenings"
              className={`rounded-xl ${errors.schedule ? "border-destructive" : ""}`}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              {formData.schedule.length}/{maxScheduleLength} characters
            </p>
            {errors.schedule && (
              <p className="text-sm text-destructive">{errors.schedule}</p>
            )}
          </div>

          {/* Optional Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium text-foreground">
              Additional Message (Optional)
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Tell them more about yourself, your goals, or any specific details about the skill swap..."
              className={`rounded-xl min-h-[100px] resize-none ${errors.message ? "border-destructive" : ""}`}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              {formData.message?.length || 0}/{maxMessageLength} characters
            </p>
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message}</p>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-border bg-muted/30">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-full px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Request"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}