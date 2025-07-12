"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, User, Github, Linkedin, AlertCircle } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
  onLogin: (data: {email: string, password: string, rememberMe: boolean}) => void;
  onSignup: (data: {name: string, email: string, password: string, confirmPassword: string, acceptTerms: boolean}) => void;
  onSocialAuth: (provider: 'google' | 'linkedin' | 'github') => void;
  isLoading?: boolean;
}

interface FormError {
  email?: string;
  password?: string;
  name?: string;
  confirmPassword?: string;
  acceptTerms?: string;
}

export const AuthModal = ({
  isOpen,
  onClose,
  mode,
  onModeChange,
  onLogin,
  onSignup,
  onSocialAuth,
  isLoading = false
}: AuthModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
    acceptTerms: false
  });
  const [errors, setErrors] = useState<FormError>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score < 3) return { strength: 'weak', color: 'bg-destructive' };
    if (score < 4) return { strength: 'medium', color: 'bg-warning' };
    return { strength: 'strong', color: 'bg-success' };
  };

  const validateForm = () => {
    const newErrors: FormError = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (mode === 'signup' && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'signup') {
      // Name validation
      if (!formData.name.trim()) {
        newErrors.name = 'Full name is required';
      }

      // Confirm password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      // Terms validation
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = 'You must accept the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (mode === 'login') {
      onLogin({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });
    } else {
      onSignup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        acceptTerms: formData.acceptTerms
      });
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormError]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleModeSwitch = (newMode: 'login' | 'signup') => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      rememberMe: false,
      acceptTerms: false
    });
    setErrors({});
    onModeChange(newMode);
  };

  const passwordStrength = mode === 'signup' ? getPasswordStrength(formData.password) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden bg-white">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center text-foreground">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </DialogTitle>
            <p className="text-sm text-muted-foreground text-center mt-2">
              {mode === 'login' 
                ? 'Enter your credentials to access your account'
                : 'Join our skill-swapping community today'
              }
            </p>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            {/* Social Login Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSocialAuth('google')}
                disabled={isLoading}
                className="h-10"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSocialAuth('linkedin')}
                disabled={isLoading}
                className="h-10"
              >
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSocialAuth('github')}
                disabled={isLoading}
                className="h-10"
              >
                <Github className="w-4 h-4" />
              </Button>
            </div>

            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-white px-2 text-xs text-muted-foreground">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange('name')}
                      className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.name && (
                    <div className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </div>
                )}
                {mode === 'signup' && formData.password && passwordStrength && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">Strength:</span>
                      <span className={`font-medium ${
                        passwordStrength.strength === 'weak' ? 'text-destructive' :
                        passwordStrength.strength === 'medium' ? 'text-warning' : 'text-success'
                      }`}>
                        {passwordStrength.strength.charAt(0).toUpperCase() + passwordStrength.strength.slice(1)}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ 
                          width: passwordStrength.strength === 'weak' ? '33%' : 
                                 passwordStrength.strength === 'medium' ? '66%' : '100%' 
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange('confirmPassword')}
                      className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="w-3 h-3" />
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>
              )}

              {mode === 'login' ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                      }
                      disabled={isLoading}
                    />
                    <Label
                      htmlFor="rememberMe"
                      className="text-sm font-normal cursor-pointer"
                    >
                      Remember me
                    </Label>
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="px-0 h-auto text-sm text-primary hover:text-primary/80"
                    disabled={isLoading}
                  >
                    Forgot password?
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))
                      }
                      disabled={isLoading}
                    />
                    <Label
                      htmlFor="acceptTerms"
                      className="text-xs leading-relaxed cursor-pointer"
                    >
                      I agree to the{' '}
                      <Button variant="link" size="sm" className="p-0 h-auto text-xs text-primary">
                        Terms of Service
                      </Button>{' '}
                      and{' '}
                      <Button variant="link" size="sm" className="p-0 h-auto text-xs text-primary">
                        Privacy Policy
                      </Button>
                    </Label>
                  </div>
                  {errors.acceptTerms && (
                    <div className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="w-3 h-3" />
                      {errors.acceptTerms}
                    </div>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : (
                  mode === 'login' ? 'Sign In' : 'Create Account'
                )}
              </Button>
            </form>

            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              </span>
              <Button
                type="button"
                variant="link"
                size="sm"
                onClick={() => handleModeSwitch(mode === 'login' ? 'signup' : 'login')}
                className="p-0 h-auto text-sm text-primary hover:text-primary/80"
                disabled={isLoading}
              >
                {mode === 'login' ? 'Sign up' : 'Log in'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};