// Core Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio: string;
  title: string;
  rating: number;
  reviewCount: number;
  joinedDate: string;
  completedSwaps: number;
  responseTime: string;
  availability: AvailabilityStatus;
  lastSeen: string;
  skills: string[];
  location?: string;
  verified: boolean;
}

export interface Skill {
  id: string;
  name: string;
  proficiency?: number;
  category: SkillCategoryType;
  verified: boolean;
  level: SkillLevel;
}

export interface UserProfile extends Omit<User, 'availability'> {
  coverImage?: string;
  skillsOffered: Skill[];
  skillsSeeking: Skill[];
  portfolio: PortfolioItem[];
  reviews: Review[];
  totalSwaps: number;
  availability: AvailabilitySchedule;
  availabilityStatus: AvailabilityStatus;
  socialLinks?: SocialLinks;
  preferences?: UserPreferences;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: string;
  tags: string[];
  url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  reviewer: {
    id: string;
    name: string;
    avatar?: string;
    title: string;
  };
  rating: number;
  comment: string;
  date: string;
  skillExchanged: string;
  helpful?: number;
}

export interface AvailabilitySchedule {
  [key: string]: boolean; // '0' for Sunday, '1' for Monday, etc.
}

export interface SwapRequest {
  id: string;
  fromUser: User;
  toUser: User;
  skillOffered: string;
  skillWanted: string;
  message: string;
  schedule: string;
  status: SwapStatus;
  createdAt: string;
  updatedAt: string;
  duration?: string;
  location?: string;
  priority?: Priority;
}

export interface SwapRequestData {
  skillWanted: string;
  skillOffered: string;
  schedule: string;
  message?: string;
  duration?: string;
  location?: string;
  priority?: Priority;
}

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  avatar?: string;
  actionData?: {
    userId?: string;
    skillOffered?: string;
    skillWanted?: string;
    achievementId?: string;
    requestId?: string;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  agreeToTerms: boolean;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User;
}

export interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  profileVisibility: 'public' | 'private' | 'limited';
  showEmail: boolean;
  showLastSeen: boolean;
  autoAcceptRequests: boolean;
  preferredLanguage: string;
  timezone: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Component Props Types
export interface UserProfileCardProps {
  id: string;
  name: string;
  avatar?: string;
  bio: string;
  rating: number;
  reviewCount: number;
  offeringSkills: Skill[];
  seekingSkills: Skill[];
  onConnect: (userId: string) => void;
  onViewProfile?: (userId: string) => void;
}

export interface SwapRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: User;
  onSubmit: (requestData: SwapRequestData) => Promise<void>;
}

export interface HeaderNavigationProps {
  onHome?: () => void;
  onProfile?: () => void;
  onSwaps?: () => void;
  onSettings?: () => void;
  onSignOut?: () => void;
  currentPage?: 'home' | 'profile' | 'swaps' | 'settings' | null;
  userAvatar?: string;
  userName?: string;
  showNotifications?: boolean;
  notificationCount?: number;
  onNotificationClick?: () => void;
}

export interface MobileBottomNavigationProps {
  activeTab: 'home' | 'profile' | 'swaps' | 'settings';
  onTabChange: (tab: 'home' | 'profile' | 'swaps' | 'settings') => void;
}

// Auth Types
export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Search and Filter Types
export interface SearchFilters {
  query: string;
  category: SkillCategoryType;
  skillLevel: SkillLevel;
  availability: AvailabilityStatus;
  rating: number;
  location?: string;
  verified?: boolean;
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  skillCount: number;
  subcategories?: string[];
}

// Page Props Types
export interface PageProps {
  params: Record<string, string>;
  searchParams: Record<string, string | string[]>;
}

export interface LayoutProps {
  children: React.ReactNode;
  params?: Record<string, string>;
}

// Form Types
export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: (value: any) => string | null;
}

// Enum Types
export type AvailabilityStatus = 'available' | 'busy' | 'away' | 'offline' | 'part-time' | 'weekends' | 'evenings' | 'flexible';

export type SkillCategoryType = 'technology' | 'design' | 'business' | 'language' | 'creative' | 'health' | 'education' | 'other';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type SwapStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled' | 'in-progress';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type NotificationType = 'skill_request_incoming' | 'skill_request_outgoing' | 'system' | 'achievement' | 'reminder' | 'message';

// Additional Interface Types
export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
  portfolio?: string;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  darkMode: boolean;
  publicProfile: boolean;
}
