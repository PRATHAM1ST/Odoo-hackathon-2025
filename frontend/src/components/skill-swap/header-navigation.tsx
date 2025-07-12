"use client"

import React, { useState } from 'react'
import { Menu, X, ChevronDown, ArrowLeftRight, Search, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface HeaderNavigationProps {
  onBrowseSkills?: () => void
  onMySwaps?: () => void
  onMessages?: () => void
  onProfileClick?: () => void
  onSignOut?: () => void
  onSignIn?: () => void
  currentPage?: 'browse' | 'swaps' | null
  userAvatar?: string
  userName?: string
  isLoggedIn?: boolean
}

export default function HeaderNavigation({
  onBrowseSkills,
  onMySwaps,
  onProfileClick,
  onSignOut,
  onSignIn,
  currentPage,
  userAvatar,
  userName = "John Doe",
  isLoggedIn = true
}: HeaderNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    {
      label: 'Browse Skills',
      onClick: onBrowseSkills,
      isActive: currentPage === 'browse',
      icon: Search
    },
    {
      label: 'My Swaps',
      onClick: onMySwaps,
      isActive: currentPage === 'swaps',
      icon: ArrowLeftRight
    }
  ]

  const handleNavClick = (onClick?: () => void) => {
    onClick?.()
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <h1 className="text-xl font-bold text-foreground font-[var(--font-heading)]">
            Skill Swap Platform
          </h1>
        </div>

        {/* Desktop Navigation - only show if logged in */}
        {isLoggedIn && (
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const IconComponent = item.icon
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.onClick)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    item.isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        )}

        {/* Desktop User Menu or Login Button */}
        <div className="hidden md:flex items-center">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-2 py-1 h-auto">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {userName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white">
                <DropdownMenuItem 
                  onClick={onProfileClick}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={onSignOut}
                  className="cursor-pointer text-destructive flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              onClick={onSignIn}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-border shadow-lg">
          {isLoggedIn ? (
            <>
              {/* Mobile Navigation */}
              <nav className="px-4 py-4 space-y-2">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleNavClick(item.onClick)}
                      className={`w-full flex items-center space-x-3 px-3 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                        item.isActive
                          ? 'text-primary bg-primary/10'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </nav>

              {/* Mobile User Section */}
              <div className="px-4 py-4 border-t border-border">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {userName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">{userName}</span>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => handleNavClick(onProfileClick)}
                    className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors duration-200 flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => handleNavClick(onSignOut)}
                    className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors duration-200 flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Mobile Login Button */
            <div className="px-4 py-4">
              <Button 
                onClick={() => handleNavClick(onSignIn)}
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  )
}