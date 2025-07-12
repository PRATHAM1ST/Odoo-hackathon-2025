"use client"

import { useState } from "react"
import { Search, MessageSquare, CheckCircle, XCircle, Clock, Calendar, Filter, UserPlus, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SkillSwapRequest {
  id: string
  type: "sent" | "received"
  user: {
    id: string
    name: string
    avatar: string
    initials: string
  }
  skillOffered: string
  skillRequested: string
  status: "pending" | "accepted" | "declined" | "completed"
  createdAt: string
  message?: string
}

const mockRequests: SkillSwapRequest[] = [
  {
    id: "1",
    type: "sent",
    user: {
      id: "u1",
      name: "Sarah Chen",
      avatar: "/avatars/sarah.jpg",
      initials: "SC"
    },
    skillOffered: "React Development",
    skillRequested: "UI/UX Design",
    status: "pending",
    createdAt: "2024-01-15",
    message: "Hi! I'd love to learn design in exchange for React tutoring."
  },
  {
    id: "2",
    type: "sent",
    user: {
      id: "u2",
      name: "Michael Torres",
      avatar: "/avatars/michael.jpg",
      initials: "MT"
    },
    skillOffered: "Python Programming",
    skillRequested: "Data Science",
    status: "accepted",
    createdAt: "2024-01-12",
    message: "Looking forward to our skill exchange!"
  },
  {
    id: "3",
    type: "received",
    user: {
      id: "u3",
      name: "Emily Rodriguez",
      avatar: "/avatars/emily.jpg",
      initials: "ER"
    },
    skillOffered: "Digital Marketing",
    skillRequested: "Web Development",
    status: "pending",
    createdAt: "2024-01-14",
    message: "I have 5+ years in marketing and would love to learn web dev!"
  },
  {
    id: "4",
    type: "received",
    user: {
      id: "u4",
      name: "David Kim",
      avatar: "/avatars/david.jpg",
      initials: "DK"
    },
    skillOffered: "Machine Learning",
    skillRequested: "Frontend Development",
    status: "completed",
    createdAt: "2024-01-08",
    message: "Great collaboration! Would love to work together again."
  },
  {
    id: "5",
    type: "sent",
    user: {
      id: "u5",
      name: "Lisa Wang",
      avatar: "/avatars/lisa.jpg",
      initials: "LW"
    },
    skillOffered: "Graphic Design",
    skillRequested: "Photography",
    status: "declined",
    createdAt: "2024-01-10",
    message: "Unfortunately I'm too busy right now, but maybe in the future!"
  }
]

function getStatusConfig(status: SkillSwapRequest["status"]) {
  switch (status) {
    case "pending":
      return {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
        label: "Pending"
      }
    case "accepted":
      return {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: CheckCircle,
        label: "Accepted"
      }
    case "declined":
      return {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        label: "Declined"
      }
    case "completed":
      return {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        label: "Completed"
      }
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function RequestCard({ request }: { request: SkillSwapRequest }) {
  const statusConfig = getStatusConfig(request.status)
  const StatusIcon = statusConfig.icon

  const renderActions = () => {
    if (request.type === "received" && request.status === "pending") {
      return (
        <div className="flex gap-2">
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="w-4 h-4 mr-1" />
            Accept
          </Button>
          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
            <XCircle className="w-4 h-4 mr-1" />
            Decline
          </Button>
        </div>
      )
    }

    if (request.status === "accepted") {
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <MessageSquare className="w-4 h-4 mr-1" />
            Message
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            Mark Complete
          </Button>
        </div>
      )
    }

    if (request.status === "completed") {
      return (
        <Button size="sm" variant="outline">
          <MessageSquare className="w-4 h-4 mr-1" />
          Message
        </Button>
      )
    }

    return (
      <Button size="sm" variant="outline">
        <MessageSquare className="w-4 h-4 mr-1" />
        Message
      </Button>
    )
  }

  return (
    <Card className="bg-card hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* User Info */}
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="w-12 h-12">
              <AvatarImage src={request.user.avatar} alt={request.user.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {request.user.initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-text-primary">{request.user.name}</h3>
                <Badge className={`${statusConfig.color} border px-2 py-1 text-xs font-medium`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusConfig.label}
                </Badge>
              </div>
              
              {/* Skills Exchange */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-text-secondary">Offering:</span>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                    {request.skillOffered}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-text-secondary">Requesting:</span>
                  <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                    {request.skillRequested}
                  </Badge>
                </div>
              </div>

              {/* Date and Message */}
              <div className="flex items-center gap-4 text-sm text-text-secondary mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(request.createdAt)}
                </div>
              </div>

              {request.message && (
                <p className="text-sm text-text-secondary bg-muted p-3 rounded-lg mb-3">
                  "{request.message}"
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col justify-between gap-3 sm:items-end">
            {renderActions()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ type }: { type: "sent" | "received" }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
        {type === "sent" ? (
          <UserPlus className="w-8 h-8 text-text-secondary" />
        ) : (
          <BookOpen className="w-8 h-8 text-text-secondary" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {type === "sent" ? "No sent requests" : "No received requests"}
      </h3>
      <p className="text-text-secondary mb-6 max-w-sm mx-auto">
        {type === "sent" 
          ? "You haven't sent any skill swap requests yet. Start exploring skills and connect with other learners!"
          : "You haven't received any skill swap requests yet. Make sure your profile is complete to attract potential skill partners."
        }
      </p>
      <Button className="bg-primary hover:bg-primary/90">
        {type === "sent" ? "Browse Skills" : "Complete Profile"}
      </Button>
    </div>
  )
}

export default function RequestDashboard() {
  const [activeTab, setActiveTab] = useState("sent")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const sentRequests = mockRequests.filter(request => request.type === "sent")
  const receivedRequests = mockRequests.filter(request => request.type === "received")

  const filterRequests = (requests: SkillSwapRequest[]) => {
    return requests.filter(request => {
      const matchesSearch = request.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           request.skillOffered.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           request.skillRequested.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || request.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }

  const filteredSentRequests = filterRequests(sentRequests)
  const filteredReceivedRequests = filterRequests(receivedRequests)

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Skill Swap Requests</h1>
          <p className="text-text-secondary">Manage your skill exchange requests and connections</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
            <Input
              placeholder="Search by name or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-card border-border">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="sent" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Sent Requests ({sentRequests.length})
            </TabsTrigger>
            <TabsTrigger value="received" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Received Requests ({receivedRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sent">
            {filteredSentRequests.length === 0 ? (
              searchQuery || statusFilter !== "all" ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">No results found</h3>
                  <p className="text-text-secondary">Try adjusting your search or filter criteria.</p>
                </div>
              ) : (
                <EmptyState type="sent" />
              )
            ) : (
              <div className="space-y-4">
                {filteredSentRequests.map(request => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="received">
            {filteredReceivedRequests.length === 0 ? (
              searchQuery || statusFilter !== "all" ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">No results found</h3>
                  <p className="text-text-secondary">Try adjusting your search or filter criteria.</p>
                </div>
              ) : (
                <EmptyState type="received" />
              )
            ) : (
              <div className="space-y-4">
                {filteredReceivedRequests.map(request => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}