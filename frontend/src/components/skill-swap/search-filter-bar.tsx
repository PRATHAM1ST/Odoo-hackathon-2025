"use client"

import React, { useState } from 'react'
import { Search, Filter, X, MapPin, Clock, Star, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { motion, AnimatePresence } from 'motion/react'

interface FilterOption {
  id: string
  label: string
  value: string
  type: 'skills' | 'location' | 'availability' | 'rating'
}

interface SearchFilterBarProps {
  onSearchChange?: (query: string) => void
  onFiltersChange?: (filters: FilterOption[]) => void
  placeholder?: string
}

const skillsCategories = [
  { id: 'tech', label: 'Technology' },
  { id: 'design', label: 'Design' },
  { id: 'business', label: 'Business' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'creative', label: 'Creative Arts' },
  { id: 'education', label: 'Education' },
]

const locations = [
  { id: 'remote', label: 'Remote' },
  { id: 'local', label: 'Local' },
  { id: 'hybrid', label: 'Hybrid' },
]

const availabilityOptions = [
  { id: 'immediate', label: 'Available Now' },
  { id: 'week', label: 'Within a Week' },
  { id: 'month', label: 'Within a Month' },
]

const ratingOptions = [
  { id: '5', label: '5 Stars' },
  { id: '4+', label: '4+ Stars' },
  { id: '3+', label: '3+ Stars' },
]

export default function SearchFilterBar({
  onSearchChange,
  onFiltersChange,
  placeholder = "Search for skills, people, or locations"
}: SearchFilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([])
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearchChange?.(value)
  }

  const addFilter = (option: FilterOption) => {
    const newFilters = [...activeFilters.filter(f => f.id !== option.id), option]
    setActiveFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const removeFilter = (filterId: string) => {
    const newFilters = activeFilters.filter(f => f.id !== filterId)
    setActiveFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const clearAllFilters = () => {
    setActiveFilters([])
    onFiltersChange?.([])
  }

  const filterCount = activeFilters.length

  const FilterButton = ({ 
    icon: Icon, 
    label, 
    options, 
    type 
  }: { 
    icon: React.ComponentType<any>
    label: string
    options: { id: string; label: string }[]
    type: FilterOption['type']
  }) => {
    const hasActiveFilter = activeFilters.some(f => f.type === type)
    
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`rounded-full border-border bg-card hover:bg-accent transition-all duration-200 ${
              hasActiveFilter ? 'border-primary bg-primary/5 text-primary' : ''
            }`}
          >
            <Icon size={16} className="mr-2" />
            {label}
            {hasActiveFilter && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 bg-primary text-primary-foreground text-xs p-0 flex items-center justify-center">
                {activeFilters.filter(f => f.type === type).length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-3 bg-card border-border shadow-lg">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-foreground mb-3">{label}</h4>
            {options.map((option) => {
              const isSelected = activeFilters.some(f => f.id === option.id)
              return (
                <Button
                  key={option.id}
                  variant={isSelected ? "default" : "ghost"}
                  size="sm"
                  className={`w-full justify-start text-sm ${
                    isSelected 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                      : 'text-foreground hover:bg-accent'
                  }`}
                  onClick={() => {
                    if (isSelected) {
                      removeFilter(option.id)
                    } else {
                      addFilter({
                        id: option.id,
                        label: option.label,
                        value: option.id,
                        type
                      })
                    }
                  }}
                >
                  {option.label}
                </Button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  const MobileFilters = () => (
    <div className="space-y-6 p-4 bg-card">
      <div>
        <h3 className="font-medium text-foreground mb-3 flex items-center">
          <Tag size={16} className="mr-2" />
          Skills Category
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {skillsCategories.map((option) => {
            const isSelected = activeFilters.some(f => f.id === option.id)
            return (
              <Button
                key={option.id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={`text-sm ${
                  isSelected 
                    ? 'bg-primary text-primary-foreground' 
                    : 'border-border bg-card'
                }`}
                onClick={() => {
                  if (isSelected) {
                    removeFilter(option.id)
                  } else {
                    addFilter({
                      id: option.id,
                      label: option.label,
                      value: option.id,
                      type: 'skills'
                    })
                  }
                }}
              >
                {option.label}
              </Button>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground mb-3 flex items-center">
          <MapPin size={16} className="mr-2" />
          Location
        </h3>
        <div className="space-y-2">
          {locations.map((option) => {
            const isSelected = activeFilters.some(f => f.id === option.id)
            return (
              <Button
                key={option.id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={`w-full justify-start text-sm ${
                  isSelected 
                    ? 'bg-primary text-primary-foreground' 
                    : 'border-border bg-card'
                }`}
                onClick={() => {
                  if (isSelected) {
                    removeFilter(option.id)
                  } else {
                    addFilter({
                      id: option.id,
                      label: option.label,
                      value: option.id,
                      type: 'location'
                    })
                  }
                }}
              >
                {option.label}
              </Button>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground mb-3 flex items-center">
          <Clock size={16} className="mr-2" />
          Availability
        </h3>
        <div className="space-y-2">
          {availabilityOptions.map((option) => {
            const isSelected = activeFilters.some(f => f.id === option.id)
            return (
              <Button
                key={option.id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={`w-full justify-start text-sm ${
                  isSelected 
                    ? 'bg-primary text-primary-foreground' 
                    : 'border-border bg-card'
                }`}
                onClick={() => {
                  if (isSelected) {
                    removeFilter(option.id)
                  } else {
                    addFilter({
                      id: option.id,
                      label: option.label,
                      value: option.id,
                      type: 'availability'
                    })
                  }
                }}
              >
                {option.label}
              </Button>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="font-medium text-foreground mb-3 flex items-center">
          <Star size={16} className="mr-2" />
          Rating
        </h3>
        <div className="space-y-2">
          {ratingOptions.map((option) => {
            const isSelected = activeFilters.some(f => f.id === option.id)
            return (
              <Button
                key={option.id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={`w-full justify-start text-sm ${
                  isSelected 
                    ? 'bg-primary text-primary-foreground' 
                    : 'border-border bg-card'
                }`}
                onClick={() => {
                  if (isSelected) {
                    removeFilter(option.id)
                  } else {
                    addFilter({
                      id: option.id,
                      label: option.label,
                      value: option.id,
                      type: 'rating'
                    })
                  }
                }}
              >
                {option.label}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full max-w-4xl mx-auto bg-card p-6 rounded-xl shadow-lg border border-border space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
        />
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <FilterButton
            icon={Tag}
            label="Skills Category"
            options={skillsCategories}
            type="skills"
          />
          <FilterButton
            icon={MapPin}
            label="Location"
            options={locations}
            type="location"
          />
          <FilterButton
            icon={Clock}
            label="Availability"
            options={availabilityOptions}
            type="availability"
          />
          <FilterButton
            icon={Star}
            label="Rating"
            options={ratingOptions}
            type="rating"
          />
        </div>

        {filterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground ml-auto"
          >
            Clear all filters
          </Button>
        )}
      </div>

      {/* Mobile Filter Button */}
      <div className="md:hidden flex items-center justify-between">
        <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 bg-card border-border">
              <Filter size={16} />
              Filters
              {filterCount > 0 && (
                <Badge variant="default" className="h-5 w-5 bg-primary text-primary-foreground text-xs p-0 flex items-center justify-center">
                  {filterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] bg-card">
            <SheetHeader className="text-left mb-6">
              <SheetTitle className="text-foreground">Filters</SheetTitle>
            </SheetHeader>
            <MobileFilters />
            <div className="absolute bottom-6 left-6 right-6 flex gap-3">
              {filterCount > 0 && (
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="flex-1 border-border"
                >
                  Clear all
                </Button>
              )}
              <Button 
                onClick={() => setIsMobileFiltersOpen(false)}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Apply Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {filterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters */}
      <AnimatePresence>
        {activeFilters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap gap-2"
          >
            {activeFilters.map((filter) => (
              <motion.div
                key={filter.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                <Badge 
                  variant="secondary" 
                  className="bg-primary/10 text-primary border-primary/20 px-3 py-1 flex items-center gap-2"
                >
                  {filter.label}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-primary/20"
                    onClick={() => removeFilter(filter.id)}
                  >
                    <X size={12} />
                  </Button>
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}