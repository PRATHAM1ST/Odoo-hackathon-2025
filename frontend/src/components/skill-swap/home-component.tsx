"use client"

import React, { useState, useEffect } from 'react'
import { User, UserProfile } from '@/types'
import { userApi, searchApi } from '@/api'
import UserProfileCard from '@/components/skill-swap/user-profile-card'
import SwapRequestModal from '@/components/skill-swap/swap-request-modal'
import { UserProfileView } from '@/components/skill-swap/user-profile-detail'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Search } from 'lucide-react'

export default function HomeComponent() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedUserDetail, setSelectedUserDetail] = useState<UserProfile | null>(null)
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false)
  const [isProfileDetailOpen, setIsProfileDetailOpen] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const response = await userApi.getUsers()
      if (response.success) {
        setUsers(response.data)
      }
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setLoading(true)
      try {
        const response = await searchApi.searchUsers(query)
        if (response.success) {
          setUsers(response.data)
        }
      } catch (error) {
        console.error('Error searching users:', error)
      } finally {
        setLoading(false)
      }
    } else {
      loadUsers()
    }
  }

  const handleConnect = (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (user) {
      setSelectedUser(user)
      setIsSwapModalOpen(true)
    }
  }

  const handleViewProfile = async (userId: string) => {
    try {
      const response = await userApi.getUserById(userId)
      if (response.success) {
        setSelectedUserDetail(response.data)
        setIsProfileDetailOpen(true)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  const handleSwapRequestSubmit = async (requestData: any) => {
    try {
      console.log('Swap request submitted:', requestData)
      setIsSwapModalOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Error submitting swap request:', error)
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="flex-1 p-4 pb-24 md:pb-4">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search for skills, people, or expertise..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
      </div>

      {/* Results Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          {searchQuery ? `Search results for "${searchQuery}"` : 'Discover Skills'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {filteredUsers.length} {filteredUsers.length === 1 ? 'person' : 'people'} found
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading users...</span>
        </div>
      )}

      {/* Users Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <UserProfileCard
              key={user.id}
              id={user.id}
              name={user.name}
              avatar={user.avatar}
              bio={user.bio}
              rating={user.rating}
              reviewCount={user.reviewCount}
              offeringSkills={user.skills.slice(0, 3).map(skill => ({ name: skill }))}
              seekingSkills={[
                { name: 'Machine Learning' },
                { name: 'Data Science' }
              ]}
              onConnect={handleConnect}
              onViewProfile={handleViewProfile}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredUsers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-medium text-foreground mb-2">
              No users found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or browse all available skills.
            </p>
            <Button onClick={() => handleSearch('')} variant="outline">
              Show All Users
            </Button>
          </div>
        </div>
      )}

      {/* Swap Request Modal */}
      {selectedUser && (
        <SwapRequestModal
          isOpen={isSwapModalOpen}
          onClose={() => {
            setIsSwapModalOpen(false)
            setSelectedUser(null)
          }}
          recipient={selectedUser}
          onSubmit={handleSwapRequestSubmit}
        />
      )}

      {/* User Profile Detail Modal */}
      {selectedUserDetail && (
        <UserProfileView
          user={selectedUserDetail}
          isOpen={isProfileDetailOpen}
          onClose={() => {
            setIsProfileDetailOpen(false)
            setSelectedUserDetail(null)
          }}
          onConnect={handleConnect}
        />
      )}
    </div>
  )
}
