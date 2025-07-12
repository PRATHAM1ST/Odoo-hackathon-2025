"use client"

import { Search, ArrowLeftRight, User, LogOut } from 'lucide-react'

interface MobileBottomNavigationProps {
  activeTab: 'browse' | 'swaps' | 'profile' | 'logout'
  onTabChange: (tab: 'browse' | 'swaps' | 'profile' | 'logout') => void
  isLoggedIn?: boolean
  onSignIn?: () => void
}

export default function MobileBottomNavigation({ 
  activeTab, 
  onTabChange, 
  isLoggedIn = true,
  onSignIn
}: MobileBottomNavigationProps) {
  if (!isLoggedIn) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg md:hidden">
        <div className="flex items-center justify-center h-20 pb-safe px-4">
          <button
            onClick={onSignIn}
            className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-md font-medium"
          >
            Sign In
          </button>
        </div>
      </nav>
    )
  }

  const navItems = [
    { id: 'browse' as const, icon: Search, label: 'Browse' },
    { id: 'swaps' as const, icon: ArrowLeftRight, label: 'Swaps' },
    { id: 'profile' as const, icon: User, label: 'Profile' },
    { id: 'logout' as const, icon: LogOut, label: 'Logout' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg md:hidden">
      <div className="flex items-center justify-around h-20 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          const isLogoutButton = item.id === 'logout'
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="flex flex-col items-center justify-center px-3 py-2 min-w-0 transition-all duration-200 ease-in-out"
            >
              <Icon 
                size={24} 
                className={`transition-colors duration-200 ${
                  isLogoutButton 
                    ? 'text-destructive hover:text-destructive/80'
                    : isActive 
                      ? 'text-primary' 
                      : 'text-muted-foreground hover:text-text-primary'
                }`}
              />
              <span 
                className={`text-xs font-medium mt-1 transition-colors duration-200 ${
                  isLogoutButton 
                    ? 'text-destructive'
                    : isActive 
                      ? 'text-primary' 
                      : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}