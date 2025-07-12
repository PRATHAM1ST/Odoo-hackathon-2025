import { 
  User, 
  UserProfile, 
  Skill, 
  SwapRequest, 
  NotificationData, 
  SkillCategoryType, 
  AvailabilityStatus,
  SwapStatus,
  NotificationType
} from '@/types'

// Mock skill categories
export const skillCategories: SkillCategoryType[] = [
  'technology',
  'design',
  'language',
  'business',
  'creative',
  'health',
  'education',
  'other'
]

// Mock skills data
export const skills: Skill[] = [
  {
    id: 'skill-1',
    name: 'React',
    category: 'technology',
    level: 'expert',
    verified: true,
    proficiency: 95
  },
  {
    id: 'skill-2',
    name: 'JavaScript',
    category: 'technology',
    level: 'expert',
    verified: true,
    proficiency: 90
  },
  {
    id: 'skill-3',
    name: 'UI/UX Design',
    category: 'design',
    level: 'advanced',
    verified: true,
    proficiency: 85
  },
  {
    id: 'skill-4',
    name: 'Spanish',
    category: 'language',
    level: 'intermediate',
    verified: false,
    proficiency: 70
  },
  {
    id: 'skill-5',
    name: 'Photography',
    category: 'creative',
    level: 'advanced',
    verified: true,
    proficiency: 80
  },
  {
    id: 'skill-6',
    name: 'Digital Marketing',
    category: 'business',
    level: 'intermediate',
    verified: false,
    proficiency: 65
  },
  {
    id: 'skill-7',
    name: 'Guitar',
    category: 'creative',
    level: 'beginner',
    verified: false,
    proficiency: 40
  },
  {
    id: 'skill-8',
    name: 'Cooking',
    category: 'other',
    level: 'intermediate',
    verified: false,
    proficiency: 60
  },
  {
    id: 'skill-9',
    name: 'Python',
    category: 'technology',
    level: 'advanced',
    verified: true,
    proficiency: 85
  },
  {
    id: 'skill-10',
    name: 'Yoga',
    category: 'health',
    level: 'intermediate',
    verified: true,
    proficiency: 70
  }
]

// Mock users data
export const users: User[] = [
  {
    id: 'user-1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    avatar: '/api/placeholder/150/150',
    bio: 'Full-stack developer passionate about creating beautiful and functional web applications.',
    title: 'Senior Frontend Developer',
    rating: 4.8,
    reviewCount: 23,
    joinedDate: '2023-01-15',
    completedSwaps: 18,
    responseTime: '< 2 hours',
    availability: 'available',
    lastSeen: '2024-01-20T10:30:00Z',
    skills: ['React', 'JavaScript', 'Node.js', 'TypeScript'],
    location: 'San Francisco, CA',
    verified: true
  },
  {
    id: 'user-2',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    avatar: '/api/placeholder/150/150',
    bio: 'UX/UI designer with 5+ years of experience in creating user-centered digital experiences.',
    title: 'UX Designer',
    rating: 4.9,
    reviewCount: 31,
    joinedDate: '2022-08-22',
    completedSwaps: 25,
    responseTime: '< 1 hour',
    availability: 'available',
    lastSeen: '2024-01-20T09:15:00Z',
    skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'Prototyping'],
    location: 'New York, NY',
    verified: true
  },
  {
    id: 'user-3',
    name: 'Emma Rodriguez',
    email: 'emma.rodriguez@example.com',
    avatar: '/api/placeholder/150/150',
    bio: 'Professional photographer specializing in portraits and event photography.',
    title: 'Professional Photographer',
    rating: 4.7,
    reviewCount: 19,
    joinedDate: '2023-03-10',
    completedSwaps: 12,
    responseTime: '< 3 hours',
    availability: 'weekends',
    lastSeen: '2024-01-19T16:45:00Z',
    skills: ['Photography', 'Photo Editing', 'Lightroom', 'Composition'],
    location: 'Los Angeles, CA',
    verified: true
  },
  {
    id: 'user-4',
    name: 'David Kim',
    email: 'david.kim@example.com',
    avatar: '/api/placeholder/150/150',
    bio: 'Marketing professional with expertise in digital marketing and social media strategies.',
    title: 'Digital Marketing Specialist',
    rating: 4.6,
    reviewCount: 15,
    joinedDate: '2023-06-05',
    completedSwaps: 8,
    responseTime: '< 4 hours',
    availability: 'evenings',
    lastSeen: '2024-01-20T08:30:00Z',
    skills: ['Digital Marketing', 'SEO', 'Social Media', 'Analytics'],
    location: 'Chicago, IL',
    verified: false
  },
  {
    id: 'user-5',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@example.com',
    avatar: '/api/placeholder/150/150',
    bio: 'Language teacher fluent in Spanish and French, passionate about cultural exchange.',
    title: 'Language Teacher',
    rating: 4.9,
    reviewCount: 27,
    joinedDate: '2022-11-18',
    completedSwaps: 22,
    responseTime: '< 2 hours',
    availability: 'flexible',
    lastSeen: '2024-01-20T11:00:00Z',
    skills: ['Spanish', 'French', 'Teaching', 'Cultural Exchange'],
    location: 'Miami, FL',
    verified: true
  }
]

// Mock swap requests
export const swapRequests: SwapRequest[] = [
  {
    id: 'swap-1',
    fromUser: users[0],
    toUser: users[1],
    skillOffered: 'React Development',
    skillWanted: 'UI/UX Design',
    message: 'Hi! I\'d love to learn more about UI/UX principles. I can help you with React development in return.',
    schedule: 'weekends',
    status: 'pending',
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z'
  },
  {
    id: 'swap-2',
    fromUser: users[2],
    toUser: users[0],
    skillOffered: 'Photography',
    skillWanted: 'Web Development',
    message: 'I can teach you photography basics and help you build a portfolio. Looking to learn web development!',
    schedule: 'evenings',
    status: 'accepted',
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-01-16T09:15:00Z'
  },
  {
    id: 'swap-3',
    fromUser: users[3],
    toUser: users[4],
    skillOffered: 'Digital Marketing',
    skillWanted: 'Spanish',
    message: 'I can help you with your marketing strategy. Would love to learn Spanish for travel!',
    schedule: 'flexible',
    status: 'completed',
    createdAt: '2024-01-10T16:20:00Z',
    updatedAt: '2024-01-17T10:45:00Z'
  }
]

// Mock notifications
export const notifications: NotificationData[] = [
  {
    id: 'notif-1',
    type: 'skill_request_incoming',
    title: 'New Swap Request',
    description: 'Michael Chen wants to swap UI/UX Design for React Development',
    timestamp: new Date('2024-01-20T09:30:00Z'),
    isRead: false,
    actionData: {
      userId: 'user-2',
      skillOffered: 'UI/UX Design'
    }
  },
  {
    id: 'notif-2',
    type: 'skill_request_outgoing',
    title: 'Swap Request Accepted',
    description: 'Emma Rodriguez accepted your photography swap request',
    timestamp: new Date('2024-01-19T15:20:00Z'),
    isRead: false,
    actionData: {
      userId: 'user-3',
      skillOffered: 'Photography'
    }
  },
  {
    id: 'notif-3',
    type: 'achievement',
    title: 'Swap Completed',
    description: 'Your Spanish lessons with Lisa Thompson have been completed',
    timestamp: new Date('2024-01-18T11:45:00Z'),
    isRead: true,
    actionData: {
      userId: 'user-5',
      skillOffered: 'Spanish'
    }
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'Profile Update',
    description: 'Don\'t forget to update your skills and availability',
    timestamp: new Date('2024-01-17T08:00:00Z'),
    isRead: true
  }
]

// Current user profile
export const currentUser: UserProfile = {
  id: 'current-user',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: '/api/placeholder/150/150',
  bio: 'Passionate about learning and sharing knowledge through skill exchanges.',
  title: 'Full Stack Developer',
  rating: 4.7,
  reviewCount: 12,
  joinedDate: '2023-09-01',
  completedSwaps: 8,
  responseTime: '< 2 hours',
  lastSeen: '2024-01-20T12:00:00Z',
  skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
  location: 'Seattle, WA',
  verified: true,
  coverImage: '/api/placeholder/800/200',
  skillsOffered: [
    {
      id: 'offered-1',
      name: 'React',
      category: 'technology',
      level: 'expert',
      verified: true,
      proficiency: 90
    },
    {
      id: 'offered-2',
      name: 'JavaScript',
      category: 'technology',
      level: 'expert',
      verified: true,
      proficiency: 95
    }
  ],
  skillsSeeking: [
    {
      id: 'seeking-1',
      name: 'UI/UX Design',
      category: 'design',
      level: 'beginner',
      verified: false,
      proficiency: 30
    },
    {
      id: 'seeking-2',
      name: 'Photography',
      category: 'creative',
      level: 'beginner',
      verified: false,
      proficiency: 25
    }
  ],
  portfolio: [
    {
      id: 'portfolio-1',
      title: 'E-commerce Platform',
      description: 'Full-stack web application built with React and Node.js',
      image: '/api/placeholder/300/200',
      category: 'Web Development',
      tags: ['React', 'Node.js', 'MongoDB', 'Express'],
      url: 'https://github.com/alexjohnson/ecommerce-platform',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    }
  ],
  reviews: [
    {
      id: 'review-1',
      reviewer: {
        id: 'user-2',
        name: 'Michael Chen',
        avatar: '/api/placeholder/150/150',
        title: 'UX Designer'
      },
      rating: 5,
      comment: 'Excellent teacher! Very patient and knowledgeable.',
      date: '2024-01-15T10:30:00Z',
      skillExchanged: 'React Development',
      helpful: 3
    }
  ],
  totalSwaps: 8,
  availability: {
    '1': true, // Monday
    '2': true, // Tuesday
    '3': true, // Wednesday
    '4': true, // Thursday
    '5': true, // Friday
    '6': false, // Saturday
    '0': false  // Sunday
  },
  availabilityStatus: 'available',
  socialLinks: {
    linkedin: 'https://linkedin.com/in/alexjohnson',
    github: 'https://github.com/alexjohnson',
    twitter: 'https://twitter.com/alexjohnson'
  },
  preferences: {
    language: 'en',
    timezone: 'America/Los_Angeles',
    emailNotifications: true,
    pushNotifications: true,
    darkMode: false,
    publicProfile: true
  }
}

// Export all mock data as a single object
export const mockData = {
  users,
  skills,
  skillCategories,
  swapRequests,
  notifications,
  currentUser
}

// Individual exports for backward compatibility
export const mockUsers = users
export const mockSkills = skills
export const mockSwapRequests = swapRequests
export const mockNotifications = notifications
export const mockCurrentUser = currentUser
export const mockSkillCategories = skillCategories
