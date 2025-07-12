"use client"

import React, { useState, useEffect } from 'react'
import HeaderNavigation from '@/components/skill-swap/header-navigation'
import MobileBottomNavigation from '@/components/skill-swap/mobile-bottom-navigation'
import SearchFilterBar from '@/components/skill-swap/search-filter-bar'
import UserProfileCard from '@/components/skill-swap/user-profile-card'
import SkillBrowserGrid from '@/components/skill-swap/skill-browser-grid'
import SwapRequestModal from '@/components/skill-swap/swap-request-modal'
import RequestDashboard from '@/components/skill-swap/request-dashboard'
import RatingSystem from '@/components/skill-swap/rating-system'
import { UserProfileView } from '@/components/skill-swap/user-profile-detail'
import { NotificationSystem } from '@/components/skill-swap/notification-system'
import { AuthModal } from '@/components/skill-swap/auth-modal'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { UserProfile } from '@/lib/data'
import { fetchUsers } from '@/lib/api'

// Mock current user skills for the skill swap modal
const currentUserSkills = [
  {
    id: '1',
    name: 'React',
    proficiencyLevel: 'Expert' as const,
    category: 'Frontend',
    description: 'Modern React development with hooks and state management'
  },
  {
    id: '2',
    name: 'Node.js',
    proficiencyLevel: 'Advanced' as const,
    category: 'Backend',
    description: 'Server-side JavaScript and API development'
  },
  {
    id: '3',
    name: 'TypeScript',
    proficiencyLevel: 'Advanced' as const,
    category: 'Programming',
    description: 'Type-safe JavaScript development'
  },
  {
    id: '4',
    name: 'Python',
    proficiencyLevel: 'Intermediate' as const,
    category: 'Programming',
    description: 'Data science and web development with Python'
  },
  {
    id: '5',
    name: 'AWS',
    proficiencyLevel: 'Intermediate' as const,
    category: 'Cloud',
    description: 'Cloud infrastructure and deployment'
  }
]

export default function SkillSwapPlatform() {
  const [isLoggedIn, setIsLoggedIn] = useState(true) // Set to false for login flow
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [authLoading, setAuthLoading] = useState(false)
  
  const [currentView, setCurrentView] = useState<'browse' | 'swaps' | 'profile'>('browse')
  const [mobileTab, setMobileTab] = useState<'browse' | 'swaps' | 'profile' | 'logout'>('browse')
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedUserDetail, setSelectedUserDetail] = useState(null)
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false)
  const [isProfileDetailOpen, setIsProfileDetailOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Load users on mount (only if logged in)
  useEffect(() => {
    if (isLoggedIn) {
      loadUsers()
    }
  }, [isLoggedIn])

  const loadUsers = async () => {
    setIsLoadingProfiles(true)
    try {
      const response = await fetchUsers({ limit: 20 })
      if (response.success) {
        setProfiles(response.data)
      } else {
        console.error('Failed to fetch users:', response.message)
      }
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setIsLoadingProfiles(false)
    }
  }

  // Search users when query changes (only if logged in)
  useEffect(() => {
    if (isLoggedIn) {
      if (searchQuery.trim()) {
        searchUsers(searchQuery)
      } else {
        loadUsers()
      }
    }
  }, [searchQuery, isLoggedIn])

  const searchUsers = async (query: string) => {
    setIsLoadingProfiles(true)
    try {
      const response = await fetchUsers({ search: query, limit: 20 })
      if (response.success) {
        setProfiles(response.data)
      } else {
        console.error('Failed to search users:', response.message)
      }
    } catch (error) {
      console.error('Error searching users:', error)
    } finally {
      setIsLoadingProfiles(false)
    }
  }

  // Convert profile data to format expected by skill browser grid
  const convertToGridProfiles = (profiles: UserProfile[]) => {
    return profiles.map(profile => ({
      id: profile.id,
      name: profile.name,
      avatar: profile.avatar,
      title: profile.skillsOffered[0]?.name || 'Skill Swapper',
      skills: profile.skillsOffered.map(skill => ({
        id: skill.id || skill.name,
        name: skill.name,
        proficiencyLevel: 'Advanced' as const,
        category: skill.category || 'General',
        description: skill.description
      })),
      rating: profile.rating,
      reviewCount: profile.totalCompletedSwaps,
      availability: 'Available',
      completedSwaps: profile.totalCompletedSwaps,
      responseTime: `${profile.stats?.responseTime || 2}h`,
      bio: profile.bio || 'Passionate about sharing knowledge and learning new skills.'
    }))
  }

  const handleConnect = (userId: string) => {
    const user = profiles.find(p => p.id === userId)
    if (user) {
      setSelectedUser({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        skills: user.skillsOffered.map(s => s.name),
        rating: user.rating
      })
      setIsSwapModalOpen(true)
    }
  }

  const handleViewProfile = (userId: string) => {
    const user = profiles.find(p => p.id === userId)
    if (user) {
      setSelectedUserDetail(user)
      setIsProfileDetailOpen(true)
    }
  }

  const handleSwapRequest = async (requestData: any) => {
    console.log('Skill swap request submitted:', requestData)
    // Here you would typically send the request to your backend API
    // Show a success notification
    return Promise.resolve()
  }

  const handleMobileTabChange = (tab: 'browse' | 'swaps' | 'profile' | 'logout') => {
    if (tab === 'logout') {
      handleSignOut()
    } else {
      setMobileTab(tab)
      setCurrentView(tab)
    }
  }

  // Authentication handlers
  const handleSignIn = () => {
    setAuthMode('login')
    setAuthModalOpen(true)
  }

  const handleLogin = async (data: {email: string, password: string, rememberMe: boolean}) => {
    setAuthLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Login data:', data)
      
      setIsLoggedIn(true)
      setAuthModalOpen(false)
      setCurrentView('browse')
      setMobileTab('browse')
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSignup = async (data: {name: string, email: string, password: string, confirmPassword: string, acceptTerms: boolean}) => {
    setAuthLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Signup data:', data)
      
      setIsLoggedIn(true)
      setAuthModalOpen(false)
      setCurrentView('browse')
      setMobileTab('browse')
    } catch (error) {
      console.error('Signup failed:', error)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSocialAuth = async (provider: 'google' | 'linkedin' | 'github') => {
    setAuthLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Social auth with:', provider)
      
      setIsLoggedIn(true)
      setAuthModalOpen(false)
      setCurrentView('browse')
      setMobileTab('browse')
    } catch (error) {
      console.error('Social auth failed:', error)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleSignOut = () => {
    setIsLoggedIn(false)
    setCurrentView('browse')
    setMobileTab('browse')
    setProfiles([])
    setSearchQuery('')
    console.log('User signed out')
  }

  // If not logged in, show landing page
  if (!isLoggedIn) {
    return (
      <>
        <div className="min-h-screen bg-slate-50">
          <HeaderNavigation 
            isLoggedIn={false}
            onSignIn={handleSignIn}
          />

          {/* Landing Page Content */}
          <main className="pb-20 md:pb-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                  Learn by <span className="text-primary">Teaching</span>,<br />
                  Teach by <span className="text-primary">Learning</span>
                </h1>
                <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                  Join our skill-swapping community where knowledge flows both ways. 
                  Share your expertise and learn something new from talented people around the world.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={handleSignIn}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
                  >
                    Get Started
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="px-8 py-3 border-primary text-primary hover:bg-primary/5"
                  >
                    Learn More
                  </Button>
                </div>
              </motion.div>
            </div>
          </main>

          <MobileBottomNavigation 
            activeTab="browse"
            onTabChange={() => {}}
            isLoggedIn={false}
            onSignIn={handleSignIn}
          />
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          mode={authMode}
          onModeChange={setAuthMode}
          onLogin={handleLogin}
          onSignup={handleSignup}
          onSocialAuth={handleSocialAuth}
          isLoading={authLoading}
        />
      </>
    )
  }

  const renderMainContent = () => {
    return (
      <AnimatePresence mode="wait">
        {currentView === 'browse' && (
          <motion.div
            key="browse"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
          >
            <SearchFilterBar 
              placeholder="Search for skills, people, or expertise..."
              onSearchChange={setSearchQuery}
              onFiltersChange={(filters) => console.log('Filters:', filters)}
            />
            
            {/* Use the new SkillBrowserGrid component */}
            <SkillBrowserGrid 
              profiles={convertToGridProfiles(profiles)}
              currentUserSkills={currentUserSkills}
              isLoading={isLoadingProfiles}
              hasError={false}
              totalResults={profiles.length}
              onViewProfile={handleViewProfile}
              onSwapRequest={handleSwapRequest}
              searchTerm={searchQuery}
            />
          </motion.div>
        )}

        {currentView === 'swaps' && (
          <motion.div
            key="swaps"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <RequestDashboard />
          </motion.div>
        )}

        {currentView === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          >
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">My Profile</h2>
                  <p className="text-slate-600">View and manage your profile information</p>
                </div>
                <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                  Edit Profile
                </Button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center text-white text-2xl font-medium">
                    JD
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">John Doe</h3>
                    <p className="text-slate-600">Software Engineer</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Rating</h4>
                  <RatingSystem mode="display" value={4.7} totalCount={45} />
                </div>

                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Bio</h4>
                  <p className="text-slate-600">
                    Passionate software engineer with 8 years of experience in full-stack development.
                    I love sharing knowledge and learning new technologies.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentUserSkills.map((skill) => (
                      <span key={skill.id} className="px-3 py-1 bg-slate-100 text-slate-900 rounded-full text-sm">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Navigation */}
      <HeaderNavigation 
        currentPage={currentView === 'browse' ? 'browse' : currentView === 'swaps' ? 'swaps' : null}
        onBrowseSkills={() => setCurrentView('browse')}
        onMySwaps={() => setCurrentView('swaps')}
        onProfileClick={() => setCurrentView('profile')}
        onSignOut={handleSignOut}
        onSignIn={handleSignIn}
        isLoggedIn={isLoggedIn}
      />

      {/* Notification System - positioned to appear above header */}
      <div className="fixed top-4 right-4 z-[90]">
        <NotificationSystem />
      </div>

      {/* Main Content */}
      <main className="pb-20 md:pb-8">
        {renderMainContent()}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNavigation 
        activeTab={mobileTab}
        onTabChange={handleMobileTabChange}
        isLoggedIn={isLoggedIn}
        onSignIn={handleSignIn}
      />

      {/* Modals */}
      <AnimatePresence>
        {selectedUser && (
          <SwapRequestModal 
            isOpen={isSwapModalOpen}
            onClose={() => {
              setIsSwapModalOpen(false)
              setSelectedUser(null)
            }}
            recipient={selectedUser}
            onSubmit={handleSwapRequest}
          />
        )}

        {selectedUserDetail && (
          <UserProfileView
            user={{
              ...selectedUserDetail,
              coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
              skillsOffered: selectedUserDetail.skillsOffered,
              skillsSeeking: selectedUserDetail.skillsWanted,
              portfolio: [],
              reviews: [],
              joinedDate: selectedUserDetail.joinDate,
              totalSwaps: selectedUserDetail.totalCompletedSwaps,
              lastSeen: selectedUserDetail.lastActive,
              availability: {
                '0': true, '1': true, '2': false, '3': true, '4': true, '5': true, '6': false
              }
            }}
            currentUserSkills={currentUserSkills.map(skill => ({
              id: skill.id,
              name: skill.name,
              proficiency: skill.proficiencyLevel === 'Expert' ? 90 : skill.proficiencyLevel === 'Advanced' ? 75 : skill.proficiencyLevel === 'Intermediate' ? 60 : 40,
              category: skill.category,
              verified: true
            }))}
            isOpen={isProfileDetailOpen}
            onClose={() => {
              setIsProfileDetailOpen(false)
              setSelectedUserDetail(null)
            }}
            onMessage={(userId) => console.log('Message user:', userId)}
            onRequestSwap={(userId, message) => console.log('Request swap:', userId, message)}
            onFollow={(userId) => console.log('Follow user:', userId)}
          />
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
        onLogin={handleLogin}
        onSignup={handleSignup}
        onSocialAuth={handleSocialAuth}
        isLoading={authLoading}
      />
    </div>
  )
}