"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, User, MessageSquareText, Send, X, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Skill {
  id: string;
  name: string;
  proficiencyLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  category: string;
  description?: string;
}

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  title: string;
  skills: Skill[];
}

interface SwapRequestData {
  targetUserId: string;
  targetSkillId: string;
  offerSkillId: string;
  message: string;
}

interface SkillSwapRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: UserProfile;
  currentUserSkills: Skill[];
  onSubmitRequest: (data: SwapRequestData) => Promise<void>;
}

const getProficiencyColor = (level: string) => {
  switch (level) {
    case "Beginner":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Intermediate":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Advanced":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "Expert":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const SkillCard = ({
  skill,
  isSelected,
  onClick,
  disabled = false,
}: {
  skill: Skill;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) => {
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${
        isSelected
          ? "ring-2 ring-primary border-primary bg-gradient-to-br from-primary/5 to-purple-500/5"
          : "hover:border-primary/20"
      }`}
      onClick={disabled ? undefined : onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-foreground text-sm leading-tight">
            {skill.name}
          </h4>
          {isSelected && (
            <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 ml-2" />
          )}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Badge
            variant="outline"
            className={`text-xs ${getProficiencyColor(skill.proficiencyLevel)}`}
          >
            {skill.proficiencyLevel}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {skill.category}
          </Badge>
        </div>
        {skill.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {skill.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export const SkillSwapRequestModal = ({
  isOpen,
  onClose,
  targetUser,
  currentUserSkills,
  onSubmitRequest,
}: SkillSwapRequestModalProps) => {
  const [selectedTargetSkill, setSelectedTargetSkill] = useState<string>("");
  const [selectedOfferSkill, setSelectedOfferSkill] = useState<string>("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setSelectedTargetSkill("");
    setSelectedOfferSkill("");
    setMessage("");
    setError("");
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isFormValid = selectedTargetSkill && selectedOfferSkill;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    setError("");

    try {
      await onSubmitRequest({
        targetUserId: targetUser.id,
        targetSkillId: selectedTargetSkill,
        offerSkillId: selectedOfferSkill,
        message: message.trim(),
      });
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send skill swap request"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Request Sent!</h3>
            <p className="text-muted-foreground">
              Your skill swap request has been sent to {targetUser.name}.
              They'll receive a notification and can respond to your request.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">
                Request Skill Swap
              </DialogTitle>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-2">
                  <img
                    src={targetUser.avatar}
                    alt={targetUser.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-sm">{targetUser.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {targetUser.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 p-6 pt-4 overflow-hidden">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Their Skills Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Their Skills</h3>
                <Badge variant="secondary" className="text-xs">
                  {targetUser.skills.length}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Select a skill you'd like to learn from {targetUser.name}
              </p>
              <ScrollArea className="h-64">
                <div className="space-y-3 pr-4">
                  {targetUser.skills.map((skill) => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      isSelected={selectedTargetSkill === skill.id}
                      onClick={() => setSelectedTargetSkill(skill.id)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Your Skills Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-green-600" />
                <h3 className="text-lg font-semibold">Your Skills</h3>
                <Badge variant="secondary" className="text-xs">
                  {currentUserSkills.length}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Select a skill you can offer in exchange
              </p>
              <ScrollArea className="h-64">
                <div className="space-y-3 pr-4">
                  {currentUserSkills.length > 0 ? (
                    currentUserSkills.map((skill) => (
                      <SkillCard
                        key={skill.id}
                        skill={skill}
                        isSelected={selectedOfferSkill === skill.id}
                        onClick={() => setSelectedOfferSkill(skill.id)}
                      />
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">
                          You haven't added any skills yet. Add skills to your
                          profile to start skill swapping.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Message Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquareText className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">Message (Optional)</h3>
            </div>
            <Textarea
              placeholder="Add a personal message to your skill swap request..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {message.length}/500 characters
            </p>
          </div>
        </div>

        <div className="border-t bg-muted/30 p-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <div className="text-sm text-muted-foreground">
              {selectedTargetSkill && selectedOfferSkill ? (
                <span className="text-green-600 font-medium">
                  ✓ Ready to send request
                </span>
              ) : (
                "Select one skill from each section to continue"
              )}
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className="flex-1 sm:flex-none"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Request
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};