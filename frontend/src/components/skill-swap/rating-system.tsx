"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import { Star } from 'lucide-react'

interface RatingSystemProps {
  mode: 'input' | 'display'
  value?: number
  max?: number
  size?: 'small' | 'medium' | 'large'
  totalCount?: number
  hideCount?: boolean
  onRatingChange?: (rating: number) => void
  onReviewSubmit?: (rating: number, review: string) => void
  showReviewField?: boolean
  disabled?: boolean
  required?: boolean
  label?: string
  helperText?: string
  error?: string
  readOnly?: boolean
  precision?: number
}

export default function RatingSystem({
  mode = 'display',
  value = 0,
  max = 5,
  size = 'medium',
  totalCount,
  hideCount = false,
  onRatingChange,
  onReviewSubmit,
  showReviewField = false,
  disabled = false,
  required = false,
  label,
  helperText,
  error,
  readOnly = false,
  precision = 1
}: RatingSystemProps) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null)
  const [selectedRating, setSelectedRating] = useState<number>(value)
  const [review, setReview] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const reviewRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setSelectedRating(value)
  }, [value])

  const sizeClasses = {
    small: {
      star: 'w-4 h-4',
      container: 'gap-1',
      text: 'text-sm',
      textareaHeight: 'h-16'
    },
    medium: {
      star: 'w-6 h-6',
      container: 'gap-1.5',
      text: 'text-base',
      textareaHeight: 'h-20'
    },
    large: {
      star: 'w-8 h-8',
      container: 'gap-2',
      text: 'text-lg',
      textareaHeight: 'h-24'
    }
  }

  const currentSizeClasses = sizeClasses[size]

  const handleStarClick = (rating: number) => {
    if (disabled || readOnly || mode === 'display') return
    
    const newRating = precision === 0.5 ? Math.round(rating * 2) / 2 : Math.round(rating)
    setSelectedRating(newRating)
    onRatingChange?.(newRating)
  }

  const handleStarHover = (rating: number) => {
    if (disabled || readOnly || mode === 'display') return
    
    const newRating = precision === 0.5 ? Math.round(rating * 2) / 2 : Math.round(rating)
    setHoveredStar(newRating)
  }

  const handleMouseLeave = () => {
    if (disabled || readOnly || mode === 'display') return
    setHoveredStar(null)
  }

  const handleSubmit = async () => {
    if (!onReviewSubmit || selectedRating === 0) return
    
    setIsSubmitting(true)
    try {
      await onReviewSubmit(selectedRating, review)
      setReview('')
    } catch (error) {
      console.error('Failed to submit review:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStarFillLevel = (starIndex: number) => {
    const currentValue = mode === 'input' ? (hoveredStar ?? selectedRating) : value
    const starPosition = starIndex + 1
    
    if (currentValue >= starPosition) {
      return 1 // Fully filled
    } else if (currentValue > starIndex && currentValue < starPosition) {
      return currentValue - starIndex // Partially filled
    }
    return 0 // Empty
  }

  const renderStars = () => {
    return Array.from({ length: max }, (_, index) => {
      const fillLevel = getStarFillLevel(index)
      const isInteractive = mode === 'input' && !disabled && !readOnly
      
      return (
        <motion.button
          key={index}
          type="button"
          disabled={disabled || mode === 'display'}
          className={`
            relative ${currentSizeClasses.star} 
            ${isInteractive ? 'cursor-pointer' : 'cursor-default'}
            ${disabled ? 'opacity-50' : ''}
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 rounded-sm
          `}
          onClick={() => handleStarClick(index + 1)}
          onMouseEnter={() => handleStarHover(index + 1)}
          onMouseLeave={handleMouseLeave}
          whileHover={isInteractive ? { scale: 1.1 } : {}}
          whileTap={isInteractive ? { scale: 0.95 } : {}}
          transition={{ duration: 0.15 }}
          aria-label={`Rate ${index + 1} out of ${max} stars`}
        >
          {/* Background star (empty) */}
          <Star 
            className={`
              absolute inset-0 w-full h-full text-border stroke-2
              ${fillLevel === 0 ? 'text-border' : 'text-transparent'}
            `}
            strokeWidth={2}
          />
          
          {/* Filled star with gradient for partial fills */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            style={{ 
              clipPath: `inset(0 ${Math.max(0, (1 - fillLevel) * 100)}% 0 0)` 
            }}
            initial={false}
            animate={{
              width: `${fillLevel * 100}%`
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Star 
              className="w-full h-full text-warning fill-current"
              strokeWidth={2}
            />
          </motion.div>
          
          {/* Hover effect overlay */}
          {isInteractive && hoveredStar !== null && hoveredStar > index && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
            >
              <Star 
                className="w-full h-full text-warning fill-current"
                strokeWidth={2}
              />
            </motion.div>
          )}
        </motion.button>
      )
    })
  }

  return (
    <div className="bg-card w-full">
      {/* Label and Required Indicator */}
      {label && (
        <div className="mb-2">
          <label className={`font-medium text-text-primary ${currentSizeClasses.text}`}>
            {label}
            {required && mode === 'input' && (
              <span className="text-destructive ml-1" aria-label="required">*</span>
            )}
          </label>
        </div>
      )}
      
      {/* Stars Container */}
      <div className={`flex items-center ${currentSizeClasses.container}`}>
        <div 
          className={`flex items-center ${currentSizeClasses.container}`}
          role={mode === 'input' ? 'radiogroup' : 'img'}
          aria-label={mode === 'input' ? 'Rating selection' : `Rating: ${value} out of ${max} stars`}
          onMouseLeave={handleMouseLeave}
        >
          {renderStars()}
        </div>
        
        {/* Rating Value Display */}
        {mode === 'display' && (
          <div className="flex items-center gap-2 ml-3">
            <span className={`font-semibold text-text-primary ${currentSizeClasses.text}`}>
              {value.toFixed(1)}
            </span>
            {totalCount && !hideCount && (
              <span className={`text-text-secondary ${currentSizeClasses.text}`}>
                ({totalCount.toLocaleString()} review{totalCount !== 1 ? 's' : ''})
              </span>
            )}
          </div>
        )}
        
        {/* Selected Rating Display for Input Mode */}
        {mode === 'input' && selectedRating > 0 && (
          <span className={`ml-3 font-medium text-text-secondary ${currentSizeClasses.text}`}>
            {selectedRating} out of {max} stars
          </span>
        )}
      </div>
      
      {/* Helper Text */}
      {helperText && !error && (
        <p className={`mt-1 text-text-secondary ${currentSizeClasses.text === 'text-lg' ? 'text-base' : 'text-sm'}`}>
          {helperText}
        </p>
      )}
      
      {/* Error Message */}
      {error && (
        <p className={`mt-1 text-destructive ${currentSizeClasses.text === 'text-lg' ? 'text-base' : 'text-sm'}`}>
          {error}
        </p>
      )}
      
      {/* Review Field */}
      {showReviewField && mode === 'input' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="mt-4 space-y-4"
        >
          <div>
            <label className={`block font-medium text-text-primary mb-2 ${currentSizeClasses.text}`}>
              Write a review (optional)
            </label>
            <textarea
              ref={reviewRef}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience..."
              className={`
                w-full px-3 py-2 border border-border rounded-lg
                focus:ring-2 focus:ring-primary/50 focus:border-primary
                resize-none bg-card text-text-primary placeholder-text-secondary
                ${currentSizeClasses.textareaHeight} ${currentSizeClasses.text}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              disabled={disabled}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-text-secondary">
                {review.length}/500 characters
              </span>
            </div>
          </div>
          
          {onReviewSubmit && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={selectedRating === 0 || isSubmitting || disabled}
              className={`
                px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium
                hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200 ${currentSizeClasses.text}
              `}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                'Submit Review'
              )}
            </button>
          )}
        </motion.div>
      )}
    </div>
  )
}