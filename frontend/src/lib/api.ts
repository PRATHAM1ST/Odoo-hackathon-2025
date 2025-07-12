import {
  UserProfile,
  NotificationData,
  SwapRequest,
  Settings
} from './data'

// API Response interfaces
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
    hasMore?: boolean
  }
}

interface ApiError {
  success: false
  error: string
  message: string
  statusCode: number
}

// Import dummy data
import {
  dummyUsers,
  dummyNotifications,
  dummySwapRequests,
  dummySettings
} from './data'

// Create mutable copies for API simulation
let users = [...dummyUsers]
let notifications = [...dummyNotifications]
let swapRequests = [...dummySwapRequests]
let settings = { ...dummySettings }

// Utility functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const simulateNetworkDelay = () => delay(Math.random() * 500 + 200)

const shouldSimulateError = (errorRate: number = 0.05): boolean => {
  return Math.random() < errorRate
}

const createErrorResponse = (message: string, statusCode: number = 500): ApiError => ({
  success: false,
  error: 'API_ERROR',
  message,
  statusCode
})

// Users API
export const fetchUsers = async (params?: {
  search?: string
  limit?: number
  page?: number
}): Promise<ApiResponse<UserProfile[]> | ApiError> => {
  await simulateNetworkDelay()

  if (shouldSimulateError()) {
    return createErrorResponse('Failed to fetch users')
  }

  let filteredUsers = [...users]
  
  // Apply search filter
  if (params?.search) {
    const searchTerm = params.search.toLowerCase()
    filteredUsers = filteredUsers.filter(user => 
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm) ||
      user.bio.toLowerCase().includes(searchTerm) ||
      user.location.toLowerCase().includes(searchTerm) ||
      user.skillsOffered.some(skill => skill.name.toLowerCase().includes(searchTerm)) ||
      user.skillsWanted.some(skill => skill.name.toLowerCase().includes(searchTerm))
    )
  }

  // Apply pagination
  const page = params?.page || 1
  const limit = params?.limit || 10
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

  return {
    success: true,
    data: paginatedUsers,
    meta: {
      page,
      limit,
      total: filteredUsers.length,
      hasMore: endIndex < filteredUsers.length
    }
  }
}

export const fetchUserById = async (userId: string): Promise<ApiResponse<UserProfile> | ApiError> => {
  await simulateNetworkDelay()

  if (shouldSimulateError()) {
    return createErrorResponse('Failed to fetch user')
  }

  const user = users.find(u => u.id === userId)
  
  if (!user) {
    return createErrorResponse('User not found', 404)
  }

  return {
    success: true,
    data: user
  }
}

// Notifications API
export const fetchNotifications = async (params?: {
  read?: boolean
  type?: string
  limit?: number
  page?: number
}): Promise<ApiResponse<NotificationData[]> | ApiError> => {
  await simulateNetworkDelay()

  if (shouldSimulateError()) {
    return createErrorResponse('Failed to fetch notifications')
  }

  let filteredNotifications = [...notifications]

  // Apply filters
  if (params?.read !== undefined) {
    filteredNotifications = filteredNotifications.filter(n => n.read === params.read)
  }

  if (params?.type) {
    filteredNotifications = filteredNotifications.filter(n => n.type === params.type)
  }

  // Sort by timestamp (newest first)
  filteredNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  // Apply pagination
  const page = params?.page || 1
  const limit = params?.limit || 20
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex)

  return {
    success: true,
    data: paginatedNotifications,
    meta: {
      page,
      limit,
      total: filteredNotifications.length,
      hasMore: endIndex < filteredNotifications.length
    }
  }
}

export const markNotificationAsRead = async (notificationId: string): Promise<ApiResponse<NotificationData> | ApiError> => {
  await simulateNetworkDelay()

  if (shouldSimulateError()) {
    return createErrorResponse('Failed to update notification')
  }

  const notification = notifications.find(n => n.id === notificationId)
  
  if (!notification) {
    return createErrorResponse('Notification not found', 404)
  }

  notification.read = true

  return {
    success: true,
    data: notification,
    message: 'Notification marked as read'
  }
}

export const markNotificationAsUnread = async (notificationId: string): Promise<ApiResponse<NotificationData> | ApiError> => {
  await simulateNetworkDelay()

  if (shouldSimulateError()) {
    return createErrorResponse('Failed to update notification')
  }

  const notification = notifications.find(n => n.id === notificationId)
  
  if (!notification) {
    return createErrorResponse('Notification not found', 404)
  }

  notification.read = false

  return {
    success: true,
    data: notification,
    message: 'Notification marked as unread'
  }
}

export const deleteNotification = async (notificationId: string): Promise<ApiResponse<boolean> | ApiError> => {
  await simulateNetworkDelay()

  if (shouldSimulateError()) {
    return createErrorResponse('Failed to delete notification')
  }

  const index = notifications.findIndex(n => n.id === notificationId)
  
  if (index === -1) {
    return createErrorResponse('Notification not found', 404)
  }

  notifications.splice(index, 1)

  return {
    success: true,
    data: true,
    message: 'Notification deleted successfully'
  }
}

export const markAllNotificationsAsRead = async (): Promise<ApiResponse<boolean> | ApiError> => {
  await simulateNetworkDelay()

  if (shouldSimulateError()) {
    return createErrorResponse('Failed to update notifications')
  }

  notifications.forEach(notification => {
    notification.read = true
  })

  return {
    success: true,
    data: true,
    message: 'All notifications marked as read'
  }
}

// Swap Requests API
export const fetchSwapRequests = async (params?: {
  status?: SwapRequest['status']
  userId?: string
  limit?: number
  page?: number
}): Promise<ApiResponse<SwapRequest[]> | ApiError> => {
  await simulateNetworkDelay()

  if (shouldSimulateError()) {
    return createErrorResponse('Failed to fetch swap requests')
  }

  let filteredRequests = [...swapRequests]

  // Apply filters
  if (params?.status) {
    filteredRequests = filteredRequests.filter(sr => sr.status === params.status)
  }

  if (params?.userId) {
    filteredRequests = filteredRequests.filter(sr => 
      sr.requester.id === params.userId || sr.provider.id === params.userId
    )
  }

  // Sort by date (newest first)
  filteredRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Apply pagination
  const page = params?.page || 1
  const limit = params?.limit || 10
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedRequests = filteredRequests.slice(startIndex, endIndex)

  return {
    success: true,
    data: paginatedRequests,
    meta: {
      page,
      limit,
      total: filteredRequests.length,
      hasMore: endIndex < filteredRequests.length
    }
  }
}

export const fetchSwapRequestById = async (requestId: string): Promise<ApiResponse<SwapRequest> | ApiError> => {
  await simulateNetworkDelay()

  if (shouldSimulateError()) {
    return createErrorResponse('Failed to fetch swap request')
  }

  const swapRequest = swapRequests.find(sr => sr.id === requestId)
  
  if (!swapRequest) {
    return createErrorResponse('Swap request not found', 404)
  }

  return {
    success: true,
    data: swapRequest
  }
}

export const updateSwapRequestStatus = async (
  requestId: string, 
  status: SwapRequest['status']
): Promise<ApiResponse<SwapRequest> | ApiError> => {
  await simulateNetworkDelay()

  if (shouldSimulateError()) {
    return createErrorResponse('Failed to update swap request')
  }

  const swapRequest = swapRequests.find(sr => sr.id === requestId)
  
  if (!swapRequest) {
    return createErrorResponse('Swap request not found', 404)
  }

  swapRequest.status = status
  swapRequest.updatedAt = new Date().toISOString()

  return {
    success: true,
    data: swapRequest,
    message: `Swap request ${status}`
  }
}

// User Settings API
export const fetchUserSettings = async (userId: string): Promise<ApiResponse<Settings> | ApiError> => {
  await simulateNetworkDelay()

  if (shouldSimulateError()) {
    return createErrorResponse('Failed to fetch user settings')
  }

  return {
    success: true,
    data: settings
  }
}

export const updateUserSettings = async (
  userId: string,
  newSettings: Partial<Settings>
): Promise<ApiResponse<Settings> | ApiError> => {
  await simulateNetworkDelay()

  if (shouldSimulateError()) {
    return createErrorResponse('Failed to update user settings')
  }

  // Deep merge settings
  settings = { ...settings, ...newSettings }

  return {
    success: true,
    data: settings,
    message: 'Settings updated successfully'
  }
}

// Notification Stats API
export const fetchNotificationStats = async (): Promise<ApiResponse<{
  total: number
  unread: number
  byType: Record<string, number>
}> | ApiError> => {
  await simulateNetworkDelay()

  if (shouldSimulateError()) {
    return createErrorResponse('Failed to fetch notification stats')
  }

  const total = notifications.length
  const unread = notifications.filter(n => !n.read).length
  const byType = notifications.reduce((acc, notification) => {
    acc[notification.type] = (acc[notification.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return {
    success: true,
    data: {
      total,
      unread,
      byType
    }
  }
}