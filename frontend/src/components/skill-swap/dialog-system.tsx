"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Check, 
  AlertTriangle, 
  MessageCircle, 
  Trophy, 
  UserPlus, 
  Shield, 
  Flag,
  Star,
  Clock,
  Send,
  ThumbsUp,
  ThumbsDown,
  Gift,
  Crown,
  Sparkles,
  Heart,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Base Dialog Types
interface BaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ConfirmationDialogProps extends BaseDialogProps {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void | Promise<void>;
  icon?: React.ReactNode;
}

interface SkillRequestDialogProps extends BaseDialogProps {
  type: "accept" | "reject";
  requesterName: string;
  skillName: string;
  onAction: (action: "accept" | "reject", reason?: string) => void | Promise<void>;
}

interface QuickReplyDialogProps extends BaseDialogProps {
  recipientName: string;
  context?: string;
  onSend: (message: string) => void | Promise<void>;
}

interface AchievementDialogProps extends BaseDialogProps {
  achievement: {
    title: string;
    description: string;
    icon: React.ReactNode;
    points: number;
    level?: string;
  };
  onClaim?: () => void;
}

interface ActionDialogProps extends BaseDialogProps {
  title: string;
  description?: string;
  actions: Array<{
    label: string;
    variant?: "default" | "destructive" | "secondary";
    onClick: () => void | Promise<void>;
    icon?: React.ReactNode;
  }>;
  targetUser?: string;
}

// Dialog Backdrop Component
const DialogBackdrop: React.FC<{ children: React.ReactNode; onClose: () => void }> = ({ 
  children, 
  onClose 
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    style={{ backdropFilter: "blur(8px)" }}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      onClick={(e) => e.stopPropagation()}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 300
      }}
    >
      {children}
    </motion.div>
  </motion.div>
);

// Confirmation Dialog Component
export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  onConfirm,
  icon
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Confirmation action failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultIcon = variant === "destructive" ? 
    <AlertTriangle className="w-8 h-8 text-destructive" /> : 
    <CheckCircle className="w-8 h-8 text-primary" />;

  return (
    <AnimatePresence>
      {isOpen && (
        <DialogBackdrop onClose={onClose}>
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {icon || defaultIcon}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {description}
            </p>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="px-6"
              >
                {cancelText}
              </Button>
              <Button
                variant={variant === "destructive" ? "destructive" : "default"}
                onClick={handleConfirm}
                disabled={isLoading}
                className="px-6"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                  />
                ) : (
                  confirmText
                )}
              </Button>
            </div>
          </div>
        </DialogBackdrop>
      )}
    </AnimatePresence>
  );
};

// Skill Request Dialog Component
export const SkillRequestDialog: React.FC<SkillRequestDialogProps> = ({
  isOpen,
  onClose,
  type,
  requesterName,
  skillName,
  onAction
}) => {
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    setIsLoading(true);
    try {
      await onAction(type, reason);
      onClose();
      setReason("");
    } catch (error) {
      console.error("Skill request action failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isAccept = type === "accept";
  const title = isAccept ? "Accept Skill Request" : "Decline Skill Request";
  const icon = isAccept ? 
    <ThumbsUp className="w-8 h-8 text-green-500" /> : 
    <ThumbsDown className="w-8 h-8 text-red-500" />;

  const suggestions = isAccept ? [
    "Let's set up a time to meet!",
    "I'm excited to help you learn this skill.",
    "I have some great resources to share."
  ] : [
    "Currently unavailable due to schedule",
    "Not the best match for your skill level",
    "I'm focusing on other areas right now"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <DialogBackdrop onClose={onClose}>
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {icon}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                <span className="font-medium">{requesterName}</span> wants to learn{" "}
                <span className="font-medium text-primary">{skillName}</span> from you.
              </p>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isAccept ? "Welcome message (optional):" : "Reason (optional):"}
                </label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={isAccept ? "Share your excitement or tips..." : "Let them know why..."}
                  className="resize-none"
                  rows={3}
                />
              </div>

              {/* Quick Suggestions */}
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Quick suggestions:</p>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setReason(suggestion)}
                      className="text-sm text-left w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      "{suggestion}"
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant={isAccept ? "default" : "destructive"}
                onClick={handleAction}
                disabled={isLoading}
                className="px-6"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
                  />
                ) : (
                  <>
                    {isAccept ? <Check className="w-4 h-4 mr-2" /> : <X className="w-4 h-4 mr-2" />}
                    {isAccept ? "Accept Request" : "Decline Request"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogBackdrop>
      )}
    </AnimatePresence>
  );
};

// Quick Reply Dialog Component
export const QuickReplyDialog: React.FC<QuickReplyDialogProps> = ({
  isOpen,
  onClose,
  recipientName,
  context,
  onSend
}) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    try {
      await onSend(message);
      onClose();
      setMessage("");
    } catch (error) {
      console.error("Send message failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickReplies = [
    "Sure! I'd be happy to help.",
    "Let me check my schedule and get back to you.",
    "That sounds great! When would be a good time?",
    "Thanks for reaching out!",
    "I'm interested. Tell me more.",
  ];

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <DialogBackdrop onClose={onClose}>
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Quick Reply
                  </h3>
                  <p className="text-sm text-gray-500">to {recipientName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Context */}
            {context && (
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                  "{context}"
                </p>
              </div>
            )}

            {/* Message Input */}
            <div className="space-y-3 mb-4">
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your reply..."
                className="resize-none"
                rows={4}
                autoFocus
              />
              <p className="text-xs text-gray-500">
                Press Cmd+Enter (Mac) or Ctrl+Enter (Windows) to send
              </p>
            </div>

            {/* Quick Replies */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quick replies:
              </p>
              <div className="space-y-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => setMessage(reply)}
                    className="text-sm text-left w-full p-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                disabled={isLoading || !message.trim()}
                className="px-6"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
                  />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Send Message
              </Button>
            </div>
          </div>
        </DialogBackdrop>
      )}
    </AnimatePresence>
  );
};

// Achievement Dialog Component
export const AchievementDialog: React.FC<AchievementDialogProps> = ({
  isOpen,
  onClose,
  achievement,
  onClaim
}) => {
  const [claimed, setClaimed] = useState(false);

  const handleClaim = () => {
    setClaimed(true);
    onClaim?.();
    setTimeout(() => {
      onClose();
      setClaimed(false);
    }, 1500);
  };

  useEffect(() => {
    if (isOpen) {
      // Auto close after 5 seconds if not claimed
      const timer = setTimeout(() => {
        if (!claimed) onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, claimed, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <DialogBackdrop onClose={onClose}>
          <div className="relative overflow-hidden">
            {/* Celebration Animation Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20" />
            
            {/* Floating Sparkles */}
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </motion.div>
              ))}
            </div>

            <div className="relative p-6 text-center">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Achievement Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15, stiffness: 300, delay: 0.2 }}
                className="flex justify-center mb-4"
              >
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                    {achievement.icon}
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-2 border-2 border-dashed border-yellow-400 rounded-full"
                  />
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Achievement Unlocked!
                </h3>
                <h4 className="text-xl font-semibold text-primary mb-2">
                  {achievement.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {achievement.description}
                </p>
                
                {/* Points & Level */}
                <div className="flex justify-center gap-4 mb-6">
                  <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                      +{achievement.points} points
                    </span>
                  </div>
                  {achievement.level && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                      <Crown className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                        {achievement.level}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Claim Button */}
              {onClaim && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    onClick={handleClaim}
                    disabled={claimed}
                    className="relative overflow-hidden bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold px-8 py-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    {claimed ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Claimed!
                      </>
                    ) : (
                      <>
                        <Gift className="w-5 h-5 mr-2" />
                        Claim Reward
                      </>
                    )}
                    
                    {/* Shine Effect */}
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                    />
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </DialogBackdrop>
      )}
    </AnimatePresence>
  );
};

// Action Dialog Component
export const ActionDialog: React.FC<ActionDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  actions,
  targetUser
}) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAction = async (action: typeof actions[0], index: number) => {
    setLoadingAction(action.label);
    try {
      await action.onClick();
      onClose();
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <DialogBackdrop onClose={onClose}>
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            {description && (
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {targetUser ? description.replace("{user}", targetUser) : description}
              </p>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || "default"}
                  onClick={() => handleAction(action, index)}
                  disabled={loadingAction !== null}
                  className="w-full justify-start"
                >
                  {loadingAction === action.label ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-3"
                    />
                  ) : (
                    action.icon && <span className="mr-3">{action.icon}</span>
                  )}
                  {action.label}
                </Button>
              ))}
            </div>

            {/* Cancel */}
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loadingAction !== null}
              className="w-full mt-4"
            >
              Cancel
            </Button>
          </div>
        </DialogBackdrop>
      )}
    </AnimatePresence>
  );
};

// Demo Component
export const DialogSystem: React.FC = () => {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const mockActions = {
    follow: () => Promise.resolve(console.log("Following user...")),
    block: () => Promise.resolve(console.log("Blocking user...")),
    report: () => Promise.resolve(console.log("Reporting user...")),
    delete: () => Promise.resolve(console.log("Deleting item...")),
    accept: () => Promise.resolve(console.log("Accepting request...")),
    send: () => Promise.resolve(console.log("Sending message...")),
    claim: () => console.log("Claiming achievement...")
  };

  const mockAchievement = {
    title: "Skill Master",
    description: "You've successfully taught 10 different people new skills!",
    icon: <Trophy className="w-8 h-8 text-white" />,
    points: 500,
    level: "Gold Level"
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Dialog System Demo
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Confirmation Dialog */}
          <Button
            onClick={() => setActiveDialog("confirmation")}
            variant="destructive"
            className="h-auto p-4 flex flex-col items-start"
          >
            <AlertTriangle className="w-6 h-6 mb-2" />
            <span className="font-medium">Confirmation Dialog</span>
            <span className="text-sm opacity-80">Delete account action</span>
          </Button>

          {/* Skill Request Accept */}
          <Button
            onClick={() => setActiveDialog("skill-accept")}
            variant="default"
            className="h-auto p-4 flex flex-col items-start"
          >
            <ThumbsUp className="w-6 h-6 mb-2" />
            <span className="font-medium">Accept Skill Request</span>
            <span className="text-sm opacity-80">Accept learning request</span>
          </Button>

          {/* Skill Request Reject */}
          <Button
            onClick={() => setActiveDialog("skill-reject")}
            variant="secondary"
            className="h-auto p-4 flex flex-col items-start"
          >
            <ThumbsDown className="w-6 h-6 mb-2" />
            <span className="font-medium">Reject Skill Request</span>
            <span className="text-sm opacity-80">Decline with reason</span>
          </Button>

          {/* Quick Reply */}
          <Button
            onClick={() => setActiveDialog("quick-reply")}
            variant="default"
            className="h-auto p-4 flex flex-col items-start"
          >
            <MessageCircle className="w-6 h-6 mb-2" />
            <span className="font-medium">Quick Reply</span>
            <span className="text-sm opacity-80">Fast message response</span>
          </Button>

          {/* Achievement */}
          <Button
            onClick={() => setActiveDialog("achievement")}
            variant="default"
            className="h-auto p-4 flex flex-col items-start bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600"
          >
            <Trophy className="w-6 h-6 mb-2" />
            <span className="font-medium">Achievement</span>
            <span className="text-sm opacity-80">Celebration dialog</span>
          </Button>

          {/* Profile Actions */}
          <Button
            onClick={() => setActiveDialog("profile-actions")}
            variant="outline"
            className="h-auto p-4 flex flex-col items-start"
          >
            <UserPlus className="w-6 h-6 mb-2" />
            <span className="font-medium">Profile Actions</span>
            <span className="text-sm opacity-80">Follow, block, report</span>
          </Button>
        </div>

        {/* Dialog Components */}
        <ConfirmationDialog
          isOpen={activeDialog === "confirmation"}
          onClose={() => setActiveDialog(null)}
          title="Delete Account"
          description="Are you sure you want to delete your account? This action cannot be undone and you will lose all your data, connections, and progress."
          confirmText="Delete Account"
          cancelText="Keep Account"
          variant="destructive"
          onConfirm={mockActions.delete}
          icon={<AlertTriangle className="w-8 h-8 text-red-500" />}
        />

        <SkillRequestDialog
          isOpen={activeDialog === "skill-accept"}
          onClose={() => setActiveDialog(null)}
          type="accept"
          requesterName="Alex Chen"
          skillName="React Development"
          onAction={(action, reason) => {
            console.log(`${action} request with reason:`, reason);
            return mockActions.accept();
          }}
        />

        <SkillRequestDialog
          isOpen={activeDialog === "skill-reject"}
          onClose={() => setActiveDialog(null)}
          type="reject"
          requesterName="Sarah Johnson"
          skillName="UI/UX Design"
          onAction={(action, reason) => {
            console.log(`${action} request with reason:`, reason);
            return mockActions.accept();
          }}
        />

        <QuickReplyDialog
          isOpen={activeDialog === "quick-reply"}
          onClose={() => setActiveDialog(null)}
          recipientName="Mike Rodriguez"
          context="Hey! I saw your profile and would love to learn photography from you. Are you available for a session this weekend?"
          onSend={(message) => {
            console.log("Sending message:", message);
            return mockActions.send();
          }}
        />

        <AchievementDialog
          isOpen={activeDialog === "achievement"}
          onClose={() => setActiveDialog(null)}
          achievement={mockAchievement}
          onClaim={mockActions.claim}
        />

        <ActionDialog
          isOpen={activeDialog === "profile-actions"}
          onClose={() => setActiveDialog(null)}
          title="Profile Actions"
          description="What would you like to do with {user}'s profile?"
          targetUser="Emma Wilson"
          actions={[
            {
              label: "Follow User",
              onClick: mockActions.follow,
              icon: <UserPlus className="w-4 h-4" />
            },
            {
              label: "Send Message",
              onClick: mockActions.send,
              icon: <MessageCircle className="w-4 h-4" />
            },
            {
              label: "Block User",
              variant: "destructive" as const,
              onClick: mockActions.block,
              icon: <Shield className="w-4 h-4" />
            },
            {
              label: "Report User",
              variant: "destructive" as const,
              onClick: mockActions.report,
              icon: <Flag className="w-4 h-4" />
            }
          ]}
        />
      </div>
    </div>
  );
};