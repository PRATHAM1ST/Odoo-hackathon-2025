export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  joinDate: string;
  lastActive: string;
  rating: number;
  totalCompletedSwaps: number;
  badges: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
    earnedDate: string;
  }>;
  skillsOffered: Array<{
    id: string;
    name: string;
    category: string;
    level: 'beginner' | 'intermediate' | 'expert';
    rating: number;
    reviewCount: number;
    description: string;
  }>;
  skillsWanted: Array<{
    id: string;
    name: string;
    category: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  preferences: {
    sessionFormat: Array<'in-person' | 'virtual' | 'hybrid'>;
    timeSlots: Array<{
      day: string;
      startTime: string;
      endTime: string;
    }>;
    maxDistance: number;
    communicationStyle: 'casual' | 'formal' | 'structured';
    sessionLength: number;
  };
  stats: {
    responseTime: number;
    completionRate: number;
    noShowRate: number;
    streak: number;
  };
  socialLinks: {
    linkedin?: string;
    github?: string;
    website?: string;
    twitter?: string;
  };
}

export interface NotificationData {
  id: string;
  type: 'skill_request' | 'swap_accepted' | 'swap_completed' | 'achievement_earned' | 'reminder' | 'system' | 'profile_view' | 'new_match';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  metadata?: {
    userId?: string;
    userName?: string;
    userAvatar?: string;
    skillName?: string;
    swapId?: string;
    badgeId?: string;
    achievementType?: string;
  };
}

export interface SwapRequest {
  id: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'declined';
  requester: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
  provider: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
  requestedSkill: {
    id: string;
    name: string;
    category: string;
  };
  offeredSkill: {
    id: string;
    name: string;
    category: string;
  };
  sessionDetails: {
    format: 'in-person' | 'virtual' | 'hybrid';
    duration: number;
    proposedDate: string;
    proposedTime: string;
    location?: string;
    meetingLink?: string;
  };
  message: string;
  createdAt: string;
  updatedAt: string;
  scheduledDate?: string;
  completedDate?: string;
  rating?: {
    given: number;
    received: number;
  };
  feedback?: {
    givenFeedback: string;
    receivedFeedback: string;
  };
}

export interface Settings {
  profile: {
    visibility: 'public' | 'private' | 'friends_only';
    showEmail: boolean;
    showLocation: boolean;
    showSocialLinks: boolean;
  };
  notifications: {
    email: {
      skillRequests: boolean;
      swapUpdates: boolean;
      achievements: boolean;
      reminders: boolean;
      marketing: boolean;
    };
    push: {
      skillRequests: boolean;
      swapUpdates: boolean;
      achievements: boolean;
      reminders: boolean;
    };
    inApp: {
      skillRequests: boolean;
      swapUpdates: boolean;
      achievements: boolean;
      reminders: boolean;
      profileViews: boolean;
    };
  };
  privacy: {
    profileSearchable: boolean;
    showOnlineStatus: boolean;
    allowDirectMessages: boolean;
    requireApprovalForRequests: boolean;
    showCompletedSwaps: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    currency: string;
    distanceUnit: 'km' | 'miles';
    autoAcceptSimilarSkills: boolean;
    reminderFrequency: 'immediate' | 'daily' | 'weekly' | 'disabled';
  };
  account: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    linkedAccounts: Array<{
      provider: string;
      connected: boolean;
      email?: string;
    }>;
  };
}

// Dummy Data
export const dummyUsers: UserProfile[] = [
  {
    id: 'user1',
    name: 'Alex Chen',
    email: 'alex.chen@email.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Passionate web developer with 5+ years of experience in React and Node.js. Love teaching and learning new technologies. Always excited to share knowledge about modern web development.',
    location: 'San Francisco, CA',
    joinDate: '2023-01-15',
    lastActive: '2024-01-15T10:30:00Z',
    rating: 4.8,
    totalCompletedSwaps: 47,
    badges: [
      {
        id: 'badge1',
        name: 'Expert Teacher',
        icon: 'GraduationCap',
        color: '#3B82F6',
        earnedDate: '2023-06-20'
      },
      {
        id: 'badge2',
        name: 'Quick Responder',
        icon: 'Zap',
        color: '#10B981',
        earnedDate: '2023-08-15'
      }
    ],
    skillsOffered: [
      {
        id: 'skill1',
        name: 'React Development',
        category: 'Web Development',
        level: 'expert',
        rating: 4.9,
        reviewCount: 23,
        description: 'Modern React development including hooks, context, and state management'
      },
      {
        id: 'skill2',
        name: 'JavaScript',
        category: 'Programming',
        level: 'expert',
        rating: 4.7,
        reviewCount: 18,
        description: 'ES6+ features, async programming, and best practices'
      }
    ],
    skillsWanted: [
      {
        id: 'skill3',
        name: 'UI/UX Design',
        category: 'Design',
        priority: 'high'
      },
      {
        id: 'skill4',
        name: 'Python',
        category: 'Programming',
        priority: 'medium'
      }
    ],
    preferences: {
      sessionFormat: ['virtual', 'hybrid'],
      timeSlots: [
        { day: 'Monday', startTime: '18:00', endTime: '21:00' },
        { day: 'Wednesday', startTime: '18:00', endTime: '21:00' },
        { day: 'Saturday', startTime: '10:00', endTime: '16:00' }
      ],
      maxDistance: 25,
      communicationStyle: 'casual',
      sessionLength: 90
    },
    stats: {
      responseTime: 2.4,
      completionRate: 96,
      noShowRate: 2,
      streak: 15
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/in/alexchen',
      github: 'https://github.com/alexchen',
      website: 'https://alexchen.dev'
    }
  },
  {
    id: 'user2',
    name: 'Sarah Williams',
    email: 'sarah.williams@email.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=150&h=150&fit=crop&crop=face',
    bio: 'Graphic designer and illustrator with a passion for creating beautiful user experiences. 8+ years in the industry, specializing in brand identity and digital design.',
    location: 'New York, NY',
    joinDate: '2023-02-20',
    lastActive: '2024-01-15T14:22:00Z',
    rating: 4.9,
    totalCompletedSwaps: 62,
    badges: [
      {
        id: 'badge3',
        name: 'Design Master',
        icon: 'Palette',
        color: '#8B5CF6',
        earnedDate: '2023-07-10'
      },
      {
        id: 'badge4',
        name: 'Helpful Mentor',
        icon: 'Users',
        color: '#F59E0B',
        earnedDate: '2023-09-05'
      }
    ],
    skillsOffered: [
      {
        id: 'skill5',
        name: 'UI/UX Design',
        category: 'Design',
        level: 'expert',
        rating: 4.9,
        reviewCount: 31,
        description: 'User-centered design, prototyping, and design systems'
      },
      {
        id: 'skill6',
        name: 'Adobe Creative Suite',
        category: 'Design',
        level: 'expert',
        rating: 4.8,
        reviewCount: 25,
        description: 'Photoshop, Illustrator, InDesign, and After Effects'
      }
    ],
    skillsWanted: [
      {
        id: 'skill7',
        name: 'Frontend Development',
        category: 'Web Development',
        priority: 'high'
      },
      {
        id: 'skill8',
        name: 'Video Editing',
        category: 'Media',
        priority: 'medium'
      }
    ],
    preferences: {
      sessionFormat: ['virtual', 'in-person'],
      timeSlots: [
        { day: 'Tuesday', startTime: '19:00', endTime: '22:00' },
        { day: 'Thursday', startTime: '19:00', endTime: '22:00' },
        { day: 'Sunday', startTime: '13:00', endTime: '17:00' }
      ],
      maxDistance: 30,
      communicationStyle: 'structured',
      sessionLength: 120
    },
    stats: {
      responseTime: 1.8,
      completionRate: 98,
      noShowRate: 1,
      streak: 22
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarahwilliams',
      website: 'https://sarahwilliams.design'
    }
  },
  {
    id: 'user3',
    name: 'Mike Rodriguez',
    email: 'mike.rodriguez@email.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Full-stack developer and DevOps enthusiast. Love working with cloud technologies and helping others learn about system architecture and deployment strategies.',
    location: 'Austin, TX',
    joinDate: '2023-03-10',
    lastActive: '2024-01-15T09:15:00Z',
    rating: 4.7,
    totalCompletedSwaps: 38,
    badges: [
      {
        id: 'badge5',
        name: 'Cloud Expert',
        icon: 'Cloud',
        color: '#06B6D4',
        earnedDate: '2023-08-20'
      }
    ],
    skillsOffered: [
      {
        id: 'skill9',
        name: 'AWS Cloud Services',
        category: 'DevOps',
        level: 'expert',
        rating: 4.8,
        reviewCount: 19,
        description: 'EC2, S3, Lambda, CloudFormation, and more'
      },
      {
        id: 'skill10',
        name: 'Node.js',
        category: 'Backend Development',
        level: 'expert',
        rating: 4.6,
        reviewCount: 16,
        description: 'Backend APIs, Express.js, and database integration'
      }
    ],
    skillsWanted: [
      {
        id: 'skill11',
        name: 'Machine Learning',
        category: 'Data Science',
        priority: 'high'
      },
      {
        id: 'skill12',
        name: 'Mobile Development',
        category: 'App Development',
        priority: 'low'
      }
    ],
    preferences: {
      sessionFormat: ['virtual'],
      timeSlots: [
        { day: 'Monday', startTime: '20:00', endTime: '22:00' },
        { day: 'Friday', startTime: '18:00', endTime: '21:00' }
      ],
      maxDistance: 50,
      communicationStyle: 'casual',
      sessionLength: 60
    },
    stats: {
      responseTime: 3.2,
      completionRate: 94,
      noShowRate: 3,
      streak: 8
    },
    socialLinks: {
      github: 'https://github.com/mikerodriguez',
      linkedin: 'https://linkedin.com/in/mikerodriguez'
    }
  },
  {
    id: 'user4',
    name: 'Emily Zhang',
    email: 'emily.zhang@email.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Data scientist with expertise in machine learning and statistical analysis. Passionate about using data to solve real-world problems and teaching others about data science.',
    location: 'Seattle, WA',
    joinDate: '2023-04-05',
    lastActive: '2024-01-15T16:45:00Z',
    rating: 4.9,
    totalCompletedSwaps: 29,
    badges: [
      {
        id: 'badge6',
        name: 'Data Guru',
        icon: 'BarChart',
        color: '#EF4444',
        earnedDate: '2023-09-15'
      }
    ],
    skillsOffered: [
      {
        id: 'skill13',
        name: 'Python for Data Science',
        category: 'Data Science',
        level: 'expert',
        rating: 4.9,
        reviewCount: 15,
        description: 'Pandas, NumPy, Scikit-learn, and data visualization'
      },
      {
        id: 'skill14',
        name: 'Machine Learning',
        category: 'Data Science',
        level: 'expert',
        rating: 4.8,
        reviewCount: 12,
        description: 'Supervised and unsupervised learning algorithms'
      }
    ],
    skillsWanted: [
      {
        id: 'skill15',
        name: 'Deep Learning',
        category: 'AI',
        priority: 'high'
      },
      {
        id: 'skill16',
        name: 'Cloud Architecture',
        category: 'DevOps',
        priority: 'medium'
      }
    ],
    preferences: {
      sessionFormat: ['virtual', 'hybrid'],
      timeSlots: [
        { day: 'Wednesday', startTime: '17:00', endTime: '20:00' },
        { day: 'Saturday', startTime: '09:00', endTime: '12:00' }
      ],
      maxDistance: 20,
      communicationStyle: 'structured',
      sessionLength: 90
    },
    stats: {
      responseTime: 1.5,
      completionRate: 97,
      noShowRate: 1,
      streak: 12
    },
    socialLinks: {
      linkedin: 'https://linkedin.com/in/emilyzhang',
      github: 'https://github.com/emilyzhang'
    }
  },
  {
    id: 'user5',
    name: 'David Park',
    email: 'david.park@email.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    bio: 'Mobile app developer specializing in iOS and Flutter. Love creating smooth user experiences and helping others get started with mobile development.',
    location: 'Los Angeles, CA',
    joinDate: '2023-05-12',
    lastActive: '2024-01-15T12:20:00Z',
    rating: 4.6,
    totalCompletedSwaps: 35,
    badges: [
      {
        id: 'badge7',
        name: 'Mobile Mentor',
        icon: 'Smartphone',
        color: '#10B981',
        earnedDate: '2023-10-01'
      }
    ],
    skillsOffered: [
      {
        id: 'skill17',
        name: 'iOS Development',
        category: 'Mobile Development',
        level: 'expert',
        rating: 4.7,
        reviewCount: 20,
        description: 'Swift, UIKit, SwiftUI, and App Store deployment'
      },
      {
        id: 'skill18',
        name: 'Flutter',
        category: 'Mobile Development',
        level: 'intermediate',
        rating: 4.5,
        reviewCount: 14,
        description: 'Cross-platform mobile app development with Dart'
      }
    ],
    skillsWanted: [
      {
        id: 'skill19',
        name: 'Backend Development',
        category: 'Programming',
        priority: 'medium'
      },
      {
        id: 'skill20',
        name: 'Game Development',
        category: 'Gaming',
        priority: 'low'
      }
    ],
    preferences: {
      sessionFormat: ['in-person', 'virtual'],
      timeSlots: [
        { day: 'Tuesday', startTime: '18:30', endTime: '21:30' },
        { day: 'Sunday', startTime: '14:00', endTime: '18:00' }
      ],
      maxDistance: 40,
      communicationStyle: 'casual',
      sessionLength: 75
    },
    stats: {
      responseTime: 2.8,
      completionRate: 91,
      noShowRate: 4,
      streak: 6
    },
    socialLinks: {
      github: 'https://github.com/davidpark',
      website: 'https://davidpark.dev'
    }
  }
];

export const dummyNotifications: NotificationData[] = [
  {
    id: 'notif1',
    type: 'skill_request',
    title: 'New Skill Exchange Request',
    message: 'Sarah Williams wants to exchange UI/UX Design for your React Development skills',
    timestamp: '2024-01-15T09:30:00Z',
    read: false,
    actionUrl: '/dashboard/requests',
    metadata: {
      userId: 'user2',
      userName: 'Sarah Williams',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=150&h=150&fit=crop&crop=face',
      skillName: 'React Development',
      swapId: 'swap1'
    }
  },
  {
    id: 'notif2',
    type: 'swap_accepted',
    title: 'Skill Exchange Accepted',
    message: 'Mike Rodriguez accepted your request for AWS Cloud Services training',
    timestamp: '2024-01-15T08:15:00Z',
    read: false,
    actionUrl: '/dashboard/swaps/swap2',
    metadata: {
      userId: 'user3',
      userName: 'Mike Rodriguez',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      skillName: 'AWS Cloud Services',
      swapId: 'swap2'
    }
  },
  {
    id: 'notif3',
    type: 'achievement_earned',
    title: 'Achievement Unlocked!',
    message: 'You earned the "Quick Responder" badge for responding to requests within 2 hours',
    timestamp: '2024-01-14T20:45:00Z',
    read: true,
    actionUrl: '/profile/achievements',
    metadata: {
      badgeId: 'badge2',
      achievementType: 'response_time'
    }
  },
  {
    id: 'notif4',
    type: 'reminder',
    title: 'Upcoming Session Reminder',
    message: 'Your Python tutoring session with Emily Zhang starts in 30 minutes',
    timestamp: '2024-01-15T18:30:00Z',
    read: false,
    actionUrl: '/dashboard/sessions',
    metadata: {
      userId: 'user4',
      userName: 'Emily Zhang',
      skillName: 'Python for Data Science',
      swapId: 'swap3'
    }
  },
  {
    id: 'notif5',
    type: 'swap_completed',
    title: 'Session Completed',
    message: 'Your UI/UX Design session with Sarah Williams has been completed. Please leave a review!',
    timestamp: '2024-01-14T21:00:00Z',
    read: true,
    actionUrl: '/dashboard/swaps/swap4/review',
    metadata: {
      userId: 'user2',
      userName: 'Sarah Williams',
      skillName: 'UI/UX Design',
      swapId: 'swap4'
    }
  },
  {
    id: 'notif6',
    type: 'profile_view',
    title: 'Profile Viewed',
    message: 'David Park viewed your profile and your React Development skills',
    timestamp: '2024-01-14T16:20:00Z',
    read: true,
    actionUrl: '/profile/user5',
    metadata: {
      userId: 'user5',
      userName: 'David Park',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    }
  },
  {
    id: 'notif7',
    type: 'new_match',
    title: 'Perfect Match Found!',
    message: 'You and Emily Zhang have complementary skills. She wants to learn React and offers Python!',
    timestamp: '2024-01-14T14:10:00Z',
    read: false,
    actionUrl: '/discover/matches',
    metadata: {
      userId: 'user4',
      userName: 'Emily Zhang',
      userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      skillName: 'Python for Data Science'
    }
  },
  {
    id: 'notif8',
    type: 'system',
    title: 'Platform Update',
    message: 'New features available: Enhanced matching algorithm and improved video conferencing',
    timestamp: '2024-01-14T10:00:00Z',
    read: true,
    actionUrl: '/updates'
  },
  {
    id: 'notif9',
    type: 'reminder',
    title: 'Complete Your Profile',
    message: 'Add more skills to your profile to get better matches and more swap opportunities',
    timestamp: '2024-01-13T15:30:00Z',
    read: true,
    actionUrl: '/profile/edit'
  },
  {
    id: 'notif10',
    type: 'skill_request',
    title: 'Skill Request Received',
    message: 'Someone is interested in learning JavaScript from you. Check your requests!',
    timestamp: '2024-01-13T11:45:00Z',
    read: true,
    actionUrl: '/dashboard/requests',
    metadata: {
      skillName: 'JavaScript'
    }
  }
];

export const dummySwapRequests: SwapRequest[] = [
  {
    id: 'swap1',
    status: 'pending',
    requester: {
      id: 'user2',
      name: 'Sarah Williams',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=150&h=150&fit=crop&crop=face',
      rating: 4.9
    },
    provider: {
      id: 'user1',
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 4.8
    },
    requestedSkill: {
      id: 'skill1',
      name: 'React Development',
      category: 'Web Development'
    },
    offeredSkill: {
      id: 'skill5',
      name: 'UI/UX Design',
      category: 'Design'
    },
    sessionDetails: {
      format: 'virtual',
      duration: 120,
      proposedDate: '2024-01-20',
      proposedTime: '14:00',
      meetingLink: 'https://meet.google.com/abc-defg-hij'
    },
    message: 'Hi Alex! I\'d love to learn React from you. I can teach you UI/UX design principles and how to create beautiful interfaces. I have 8+ years of design experience and would be happy to share my knowledge!',
    createdAt: '2024-01-15T09:30:00Z',
    updatedAt: '2024-01-15T09:30:00Z'
  },
  {
    id: 'swap2',
    status: 'accepted',
    requester: {
      id: 'user1',
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 4.8
    },
    provider: {
      id: 'user3',
      name: 'Mike Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 4.7
    },
    requestedSkill: {
      id: 'skill9',
      name: 'AWS Cloud Services',
      category: 'DevOps'
    },
    offeredSkill: {
      id: 'skill1',
      name: 'React Development',
      category: 'Web Development'
    },
    sessionDetails: {
      format: 'virtual',
      duration: 90,
      proposedDate: '2024-01-18',
      proposedTime: '19:00',
      meetingLink: 'https://zoom.us/j/123456789'
    },
    message: 'Hey Mike! I\'m really interested in learning AWS cloud services for deploying my React applications. Would love to exchange some React knowledge for AWS training!',
    createdAt: '2024-01-14T10:20:00Z',
    updatedAt: '2024-01-15T08:15:00Z',
    scheduledDate: '2024-01-18T19:00:00Z'
  },
  {
    id: 'swap3',
    status: 'in_progress',
    requester: {
      id: 'user1',
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 4.8
    },
    provider: {
      id: 'user4',
      name: 'Emily Zhang',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      rating: 4.9
    },
    requestedSkill: {
      id: 'skill13',
      name: 'Python for Data Science',
      category: 'Data Science'
    },
    offeredSkill: {
      id: 'skill2',
      name: 'JavaScript',
      category: 'Programming'
    },
    sessionDetails: {
      format: 'virtual',
      duration: 90,
      proposedDate: '2024-01-16',
      proposedTime: '18:00',
      meetingLink: 'https://meet.google.com/xyz-uvwx-rst'
    },
    message: 'Hi Emily! I\'m looking to get into data science and would love to learn Python from an expert like you. I can teach you advanced JavaScript concepts in return.',
    createdAt: '2024-01-13T14:30:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
    scheduledDate: '2024-01-16T18:00:00Z'
  },
  {
    id: 'swap4',
    status: 'completed',
    requester: {
      id: 'user1',
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 4.8
    },
    provider: {
      id: 'user2',
      name: 'Sarah Williams',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=150&h=150&fit=crop&crop=face',
      rating: 4.9
    },
    requestedSkill: {
      id: 'skill5',
      name: 'UI/UX Design',
      category: 'Design'
    },
    offeredSkill: {
      id: 'skill1',
      name: 'React Development',
      category: 'Web Development'
    },
    sessionDetails: {
      format: 'virtual',
      duration: 120,
      proposedDate: '2024-01-14',
      proposedTime: '19:00',
      meetingLink: 'https://meet.google.com/completed-session'
    },
    message: 'Sarah, I\'d love to learn about UI/UX design principles to improve my development skills. Happy to teach React in exchange!',
    createdAt: '2024-01-10T16:45:00Z',
    updatedAt: '2024-01-14T21:00:00Z',
    scheduledDate: '2024-01-14T19:00:00Z',
    completedDate: '2024-01-14T21:00:00Z',
    rating: {
      given: 5,
      received: 5
    },
    feedback: {
      givenFeedback: 'Sarah was an excellent teacher! She explained design principles clearly and provided practical examples. Highly recommended!',
      receivedFeedback: 'Alex was great to work with. Very knowledgeable about React and explained concepts in an easy-to-understand way.'
    }
  },
  {
    id: 'swap5',
    status: 'declined',
    requester: {
      id: 'user5',
      name: 'David Park',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      rating: 4.6
    },
    provider: {
      id: 'user1',
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 4.8
    },
    requestedSkill: {
      id: 'skill1',
      name: 'React Development',
      category: 'Web Development'
    },
    offeredSkill: {
      id: 'skill17',
      name: 'iOS Development',
      category: 'Mobile Development'
    },
    sessionDetails: {
      format: 'in-person',
      duration: 180,
      proposedDate: '2024-01-25',
      proposedTime: '13:00',
      location: 'Coffee Shop Downtown'
    },
    message: 'Hey Alex! I\'m interested in learning React for web development. I can teach you iOS development with Swift in return.',
    createdAt: '2024-01-12T11:20:00Z',
    updatedAt: '2024-01-13T09:30:00Z'
  },
  {
    id: 'swap6',
    status: 'completed',
    requester: {
      id: 'user3',
      name: 'Mike Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 4.7
    },
    provider: {
      id: 'user4',
      name: 'Emily Zhang',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      rating: 4.9
    },
    requestedSkill: {
      id: 'skill14',
      name: 'Machine Learning',
      category: 'Data Science'
    },
    offeredSkill: {
      id: 'skill9',
      name: 'AWS Cloud Services',
      category: 'DevOps'
    },
    sessionDetails: {
      format: 'virtual',
      duration: 90,
      proposedDate: '2024-01-12',
      proposedTime: '20:00'
    },
    message: 'Emily, I\'m really interested in getting started with machine learning. Would love to learn from you and can teach AWS in exchange!',
    createdAt: '2024-01-08T15:10:00Z',
    updatedAt: '2024-01-12T22:00:00Z',
    scheduledDate: '2024-01-12T20:00:00Z',
    completedDate: '2024-01-12T21:30:00Z',
    rating: {
      given: 5,
      received: 4
    },
    feedback: {
      givenFeedback: 'Emily is fantastic at explaining complex ML concepts in simple terms. Really enjoyed our session!',
      receivedFeedback: 'Mike knows AWS inside and out. Great practical examples and very helpful session.'
    }
  }
];

export const dummySettings: Settings = {
  profile: {
    visibility: 'public',
    showEmail: false,
    showLocation: true,
    showSocialLinks: true
  },
  notifications: {
    email: {
      skillRequests: true,
      swapUpdates: true,
      achievements: false,
      reminders: true,
      marketing: false
    },
    push: {
      skillRequests: true,
      swapUpdates: true,
      achievements: true,
      reminders: true
    },
    inApp: {
      skillRequests: true,
      swapUpdates: true,
      achievements: true,
      reminders: true,
      profileViews: false
    }
  },
  privacy: {
    profileSearchable: true,
    showOnlineStatus: true,
    allowDirectMessages: true,
    requireApprovalForRequests: false,
    showCompletedSwaps: true
  },
  preferences: {
    theme: 'light',
    language: 'en',
    timezone: 'America/Los_Angeles',
    currency: 'USD',
    distanceUnit: 'miles',
    autoAcceptSimilarSkills: false,
    reminderFrequency: 'daily'
  },
  account: {
    twoFactorEnabled: false,
    lastPasswordChange: '2023-12-01',
    linkedAccounts: [
      {
        provider: 'Google',
        connected: true,
        email: 'alex.chen@gmail.com'
      },
      {
        provider: 'LinkedIn',
        connected: true
      },
      {
        provider: 'GitHub',
        connected: false
      }
    ]
  }
};

// Helper functions to get current user data (using user1 as the current user)
export const getCurrentUser = (): UserProfile => {
  return dummyUsers.find(user => user.id === 'user1') || dummyUsers[0];
};

export const getCurrentUserNotifications = (): NotificationData[] => {
  return dummyNotifications;
};

export const getCurrentUserSwapRequests = (): SwapRequest[] => {
  return dummySwapRequests.filter(swap => 
    swap.requester.id === 'user1' || swap.provider.id === 'user1'
  );
};

export const getCurrentUserSettings = (): Settings => {
  return dummySettings;
};

// Additional helper functions for filtering data
export const getPendingRequests = (): SwapRequest[] => {
  return dummySwapRequests.filter(swap => swap.status === 'pending');
};

export const getUnreadNotifications = (): NotificationData[] => {
  return dummyNotifications.filter(notification => !notification.read);
};

export const getCompletedSwaps = (): SwapRequest[] => {
  return dummySwapRequests.filter(swap => swap.status === 'completed');
};