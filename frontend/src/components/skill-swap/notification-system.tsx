"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  X, 
  Check, 
  ChevronDown,
  Filter,
  Users,
  Settings,
  Award,
  Clock,
  CheckCheck,
  Trash2,
  UserPlus,
  UserMinus,
  Target,
  Eye,
  Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { NotificationData } from '@/lib/data';
import { 
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  fetchNotificationStats
} from '@/lib/api';

interface NotificationToastProps {
  notification: NotificationData;
  onClose: () => void;
  onAction?: (action: string, notificationId: string) => void;
}

interface NotificationCenterProps {
  notifications: NotificationData[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onAction: (action: string, notificationId: string) => void;
  isLoading: boolean;
}

interface NotificationBellProps {
  unreadCount: number;
  onClick: () => void;
}

// Notification Toast Component
export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  onAction
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (notification.type) {
      case 'skill_request':
        return <UserPlus className="w-5 h-5" />;
      case 'swap_accepted':
      case 'swap_completed':
        return <Users className="w-5 h-5" />;
      case 'achievement_earned':
        return <Award className="w-5 h-5" />;
      case 'reminder':
        return <Clock className="w-5 h-5" />;
      case 'system':
        return <Settings className="w-5 h-5" />;
      case 'profile_view':
        return <Eye className="w-5 h-5" />;
      case 'new_match':
        return <Target className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getColorScheme = () => {
    switch (notification.type) {
      case 'skill_request':
        return 'bg-blue-500';
      case 'swap_accepted':
        return 'bg-green-500';
      case 'swap_completed':
        return 'bg-purple-500';
      case 'achievement_earned':
        return 'bg-yellow-500';
      case 'reminder':
        return 'bg-orange-500';
      case 'system':
        return 'bg-gray-500';
      case 'profile_view':
        return 'bg-indigo-500';
      case 'new_match':
        return 'bg-pink-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed top-20 right-4 z-[100] w-96 max-w-sm"
    >
      <Card className="p-4 shadow-lg border-l-4 border-l-primary bg-white">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${getColorScheme()} text-white flex-shrink-0`}>
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-gray-900">
                  {notification.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {notification.message}
                </p>
                <span className="text-xs text-gray-400 mt-1 block">
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>

            {notification.type === 'skill_request' && onAction && (
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  onClick={() => onAction('accept', notification.id)}
                  className="h-7 px-3 text-xs"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAction('reject', notification.id)}
                  className="h-7 px-3 text-xs"
                >
                  <X className="w-3 h-3 mr-1" />
                  Decline
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Notification Bell Component
export const NotificationBell: React.FC<NotificationBellProps> = ({ 
  unreadCount, 
  onClick 
}) => {
  return (
    <motion.div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={onClick}
        className="relative p-2 hover:bg-gray-100 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1"
          >
            <Badge 
              variant="destructive" 
              className="h-5 min-w-5 text-xs px-1 flex items-center justify-center"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          </motion.div>
        )}
      </Button>
    </motion.div>
  );
};

// Individual Notification Item Component
const NotificationItem: React.FC<{
  notification: NotificationData;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onAction: (action: string, notificationId: string) => void;
}> = ({ notification, onMarkAsRead, onDelete, onAction }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'skill_request':
        return <UserPlus className="w-4 h-4" />;
      case 'swap_accepted':
        return <UserMinus className="w-4 h-4" />;
      case 'swap_completed':
        return <Trophy className="w-4 h-4" />;
      case 'achievement_earned':
        return <Award className="w-4 h-4" />;
      case 'reminder':
        return <Clock className="w-4 h-4" />;
      case 'system':
        return <Settings className="w-4 h-4" />;
      case 'profile_view':
        return <Eye className="w-4 h-4" />;
      case 'new_match':
        return <Target className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diff = now.getTime() - notificationTime.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
        !notification.read ? 'bg-blue-50/50' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {notification.metadata?.userAvatar ? (
          <img
            src={notification.metadata.userAvatar}
            alt=""
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            {getIcon()}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h4 className={`text-sm font-medium ${
                !notification.read ? 'text-gray-900' : 'text-gray-700'
              }`}>
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
              <span className="text-xs text-gray-400 mt-1 block">
                {formatTimestamp(notification.timestamp)}
              </span>
            </div>
            
            {!notification.read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-3 text-xs">
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkAsRead(notification.id)}
                className="h-6 px-2 text-xs hover:bg-blue-100"
              >
                <Check className="w-3 h-3 mr-1" />
                Mark as read
              </Button>
            )}
            
            {notification.type === 'skill_request' && (
              <>
                <Button
                  size="sm"
                  onClick={() => onAction('accept', notification.id)}
                  className="h-6 px-2 text-xs"
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAction('reject', notification.id)}
                  className="h-6 px-2 text-xs"
                >
                  Decline
                </Button>
              </>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(notification.id)}
              className="h-6 px-2 text-xs hover:bg-red-100 hover:text-red-600"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Notification Center Component
export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onAction,
  isLoading
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'skill_requests'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;
    
    switch (filter) {
      case 'unread':
        filtered = notifications.filter(n => !n.read);
        break;
      case 'skill_requests':
        filtered = notifications.filter(n => 
          n.type === 'skill_request' || 
          n.type === 'swap_accepted' || 
          n.type === 'swap_completed'
        );
        break;
      default:
        filtered = notifications;
    }
    
    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [notifications, filter]);

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 z-[60]"
        onClick={onClose}
      />
      
      {/* Notification Panel */}
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-[70] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="h-8 px-3 text-xs"
              >
                <Filter className="w-3 h-3 mr-1" />
                Filter
                <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${
                  showFilters ? 'rotate-180' : ''
                }`} />
              </Button>
            </div>
            
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                className="h-8 px-3 text-xs hover:bg-blue-100"
              >
                <CheckCheck className="w-3 h-3 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
          
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-1"
            >
              {[
                { key: 'all', label: 'All notifications' },
                { key: 'unread', label: 'Unread only' },
                { key: 'skill_requests', label: 'Skill exchanges' }
              ].map((option) => (
                <Button
                  key={option.key}
                  variant={filter === option.key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter(option.key as any)}
                  className="w-full justify-start h-8 text-xs"
                >
                  {option.label}
                </Button>
              ))}
            </motion.div>
          )}
        </div>
        
        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="text-gray-500 text-sm mt-2">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No notifications found</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                  onDelete={onDeleteNotification}
                  onAction={onAction}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </>
  );
};

// Main Notification System Component
export const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [showToast, setShowToast] = useState<NotificationData | null>(null);
  const [showCenter, setShowCenter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchNotifications({ limit: 50 });
      if (response.success) {
        setNotifications(response.data);
      } else {
        console.error('Failed to fetch notifications:', response.message);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = useCallback(async (id: string) => {
    try {
      const response = await markNotificationAsRead(id);
      if (response.success) {
        setNotifications(prev =>
          prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
      } else {
        console.error('Failed to mark notification as read:', response.message);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      const response = await markAllNotificationsAsRead();
      if (response.success) {
        setNotifications(prev =>
          prev.map(n => ({ ...n, read: true }))
        );
      } else {
        console.error('Failed to mark all notifications as read:', response.message);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, []);

  const handleDeleteNotification = useCallback(async (id: string) => {
    try {
      const response = await deleteNotification(id);
      if (response.success) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      } else {
        console.error('Failed to delete notification:', response.message);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, []);

  const handleAction = useCallback((action: string, notificationId: string) => {
    console.log(`Action: ${action} on notification: ${notificationId}`);
    
    if (action === 'accept' || action === 'reject') {
      handleMarkAsRead(notificationId);
    }
  }, [handleMarkAsRead]);

  const handleCloseToast = useCallback(() => {
    setShowToast(null);
  }, []);

  return (
    <div className="relative">
      {/* Notification Bell */}
      <NotificationBell
        unreadCount={unreadCount}
        onClick={() => setShowCenter(!showCenter)}
      />
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <NotificationToast
            notification={showToast}
            onClose={handleCloseToast}
            onAction={handleAction}
          />
        )}
      </AnimatePresence>
      
      {/* Notification Center */}
      <AnimatePresence>
        {showCenter && (
          <NotificationCenter
            notifications={notifications}
            isOpen={showCenter}
            onClose={() => setShowCenter(false)}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDeleteNotification={handleDeleteNotification}
            onAction={handleAction}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSystem;