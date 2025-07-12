"use client";

import React, { useState } from "react";
import {
	Star,
	MapPin,
	MessageCircle,
	Repeat,
	Calendar,
	Award,
	User,
	ChevronDown,
	ChevronUp,
	X,
	Send,
	Clock,
	CheckCircle,
	Image as ImageIcon,
	Zap,
	Target,
	Globe,
	Users,
	TrendingUp,
	Heart,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { SkillSwapRequestModal } from "./skill-swap-request-modal";

interface Skill {
	id: string;
	name: string;
	proficiency: number;
	category: string;
	verified: boolean;
}

interface Review {
	id: string;
	reviewer: {
		name: string;
		avatar: string;
		title: string;
	};
	rating: number;
	comment: string;
	date: string;
	skillExchanged: string;
}

interface PortfolioItem {
	id: string;
	title: string;
	description: string;
	image: string;
	category: string;
	tags: string[];
}

interface UserProfile {
	id: string;
	name: string;
	title: string;
	location: string;
	avatar: string;
	coverImage: string;
	lastSeen: string;
	rating: number;
	reviewCount: number;
	bio: string;
	skillsOffered: Skill[];
	skillsSeeking: Skill[];
	portfolio: PortfolioItem[];
	reviews: Review[];
	joinedDate: string;
	totalSwaps: number;
	responseTime: string;
	availability: {
		[key: string]: boolean;
	};
	socialLinks?: {
		website?: string;
		linkedin?: string;
		twitter?: string;
	};
}

interface UserProfileViewProps {
	user: UserProfile;
	currentUserSkills?: Skill[];
	onMessage?: (userId: string) => void;
	onRequestSwap?: (userId: string, message: string) => void;
	onFollow?: (userId: string) => void;
	onClose?: () => void;
	isOpen?: boolean;
}

export const UserProfileView = ({
	user,
	currentUserSkills = [],
	onMessage,
	onRequestSwap,
	onFollow,
	onClose,
	isOpen = true,
}: UserProfileViewProps) => {
	const [expandedSections, setExpandedSections] = useState<
		Record<string, boolean>
	>({
		bio: false,
		skills: true,
		portfolio: false,
		reviews: false,
	});
	const [skillSwapModalOpen, setSkillSwapModalOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(0);
	const itemsPerPage = 3;
	const [isFollowing, setIsFollowing] = useState(false);

	const toggleSection = (section: string) => {
		setExpandedSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}));
	};

	const getSkillMatch = (skill: Skill) => {
		return currentUserSkills.some(
			(userSkill) =>
				userSkill.name.toLowerCase() === skill.name.toLowerCase()
		);
	};

	const getProficiencyLabel = (level: number) => {
		if (level >= 90) return "Expert";
		if (level >= 70) return "Advanced";
		if (level >= 50) return "Intermediate";
		return "Beginner";
	};

	const handleRequestSwap = () => {
		setSkillSwapModalOpen(true);
	};

	const handleSubmitSwapRequest = async (data: any) => {
		console.log("Skill swap request submitted from profile view:", data);
		if (onRequestSwap) {
			onRequestSwap(user.id, data.message || "");
		}
		setSkillSwapModalOpen(false);
		return Promise.resolve();
	};

	const handleFollow = () => {
		setIsFollowing(!isFollowing);
		onFollow?.(user.id);
	};

	const formatSkillsForModal = (skills: Skill[]) => {
		return skills.map((skill) => ({
			id: skill.id,
			name: skill.name,
			proficiencyLevel: getProficiencyLabel(skill.proficiency) as
				| "Beginner"
				| "Intermediate"
				| "Advanced"
				| "Expert",
			category: skill.category,
			description: "",
		}));
	};

	const userProfileForModal = {
		id: user.id,
		name: user.name,
		avatar: user.avatar,
		title: user.title,
		skills: formatSkillsForModal(user.skillsOffered),
	};

	const renderStars = (rating: number) => {
		return Array.from({ length: 5 }, (_, i) => (
			<Star
				key={i}
				className={`w-4 h-4 ${
					i < Math.floor(rating)
						? "text-amber-400 fill-amber-400"
						: i < rating
						? "text-amber-400 fill-amber-400/50"
						: "text-slate-300"
				}`}
			/>
		));
	};

	const currentReviews = user.reviews.slice(
		currentPage * itemsPerPage,
		(currentPage + 1) * itemsPerPage
	);

	const totalPages = Math.ceil(user.reviews.length / itemsPerPage);

	return (
		<>
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden p-0 bg-white border-0 shadow-2xl">
					<div className="flex flex-col h-full">
						{/* Enhanced Profile Header */}
						<div className="relative bg-gradient-to-br from-slate-50 to-slate-100">
							{/* Cover with gradient overlay */}
							<div className="h-40 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 relative overflow-hidden">
								<div className="absolute inset-0 bg-black/20"></div>
								<Button
									onClick={onClose}
									variant="ghost"
									size="sm"
									className="absolute top-4 right-4 text-white hover:bg-white/20 z-10 backdrop-blur-sm"
								>
									<X className="w-5 h-5" />
								</Button>
							</div>

							<div className="px-8 pb-8">
								<div className="flex flex-col lg:flex-row items-start lg:items-end gap-6 -mt-20 relative z-10">
									{/* Avatar and basic info */}
									<div className="flex flex-col items-center lg:items-start">
										<Avatar className="w-36 h-36 border-6 border-white shadow-2xl mb-4">
											<AvatarImage
												src={user.avatar}
												alt={user.name}
												className="object-cover"
											/>
											<AvatarFallback className="text-3xl bg-slate-200 text-slate-700">
												{user.name
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>

										{/* Rating Badge */}
										<div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-lg">
											<Star className="w-4 h-4 text-amber-400 fill-amber-400" />
											<span className="font-medium text-slate-900">
												{user.rating.toFixed(1)}
											</span>
											<span className="text-sm text-slate-500">
												({user.reviewCount})
											</span>
										</div>
									</div>

									{/* User Details */}
									<div className="flex-1 text-center lg:text-left lg:ml-6">
										<h1 className="text-4xl font-bold text-slate-900 mb-2">
											{user.name}
										</h1>
										<p className="text-xl text-slate-600 mb-3">
											{user.title}
										</p>

										<div className="flex items-center justify-center lg:justify-start gap-2 text-slate-500 mb-4">
											<MapPin className="w-5 h-5" />
											<span className="text-lg">
												{user.location}
											</span>
										</div>

										{/* Quick Stats */}
										<div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-600">
											<div className="flex items-center gap-2">
												<Users className="w-4 h-4" />
												<span className="font-medium">
													{user.totalSwaps}
												</span>
												<span>swaps</span>
											</div>
											<div className="flex items-center gap-2">
												<Clock className="w-4 h-4" />
												<span>
													Responds in{" "}
													{user.responseTime}
												</span>
											</div>
											<div className="flex items-center gap-2">
												<Target className="w-4 h-4" />
												<span className="text-green-600 font-medium">
													87% match
												</span>
											</div>
										</div>
									</div>

									{/* Primary Action Buttons - Make Swap Priority */}
									<div className="flex flex-col gap-3 lg:min-w-[200px]">
										{/* PRIORITY: Request Swap Button */}
										<Button
											onClick={handleRequestSwap}
											size="lg"
											className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg px-8 py-4 rounded-xl font-semibold"
										>
											<Repeat className="w-6 h-6 mr-3" />
											Request Skill Swap
										</Button>

										{/* Secondary Actions */}
										<div className="flex gap-2">
											<Button
												onClick={() =>
													onMessage?.(user.id)
												}
												variant="outline"
												className="flex-1 border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg"
											>
												<MessageCircle className="w-4 h-4 mr-2" />
												Message
											</Button>
											<Button
												onClick={handleFollow}
												variant="outline"
												className={`border-slate-300 hover:bg-slate-50 rounded-lg px-4 ${
													isFollowing
														? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
														: "text-slate-700"
												}`}
											>
												<Heart
													className={`w-4 h-4 ${
														isFollowing
															? "fill-current"
															: ""
													}`}
												/>
											</Button>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Enhanced Content Area */}
						<div className="flex-1 overflow-y-auto">
							<div className="grid grid-cols-1 xl:grid-cols-4 gap-8 p-8">
								{/* Main Content - 3 columns */}
								<div className="xl:col-span-3 space-y-8">
									{/* Skills Section - Always Expanded and Prominent */}
									<Card className="border-slate-200 shadow-lg">
										<CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
											<h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
												<Zap className="w-6 h-6 text-blue-500" />
												Skills & Expertise
											</h3>
										</CardHeader>
										<CardContent className="p-6 space-y-8">
											{/* Skills Offered - More Prominent */}
											<div>
												<div className="flex items-center justify-between mb-4">
													<h4 className="text-lg font-semibold text-green-700 flex items-center gap-2">
														<Zap className="w-5 h-5" />
														Available to Teach (
														{
															user.skillsOffered
																.length
														}
														)
													</h4>
													<Badge
														variant="secondary"
														className="bg-green-100 text-green-700 px-3 py-1"
													>
														Ready to Share
													</Badge>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													{user.skillsOffered.map(
														(skill) => (
															<div
																key={skill.id}
																className={`p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-lg ${
																	getSkillMatch(
																		skill
																	)
																		? "border-green-300 bg-gradient-to-br from-green-50 to-green-100 shadow-md"
																		: "border-slate-200 bg-white hover:border-slate-300"
																}`}
															>
																<div className="flex items-center justify-between mb-3">
																	<span className="font-semibold text-lg text-slate-900">
																		{
																			skill.name
																		}
																	</span>
																	<div className="flex items-center gap-2">
																		{getSkillMatch(
																			skill
																		) && (
																			<Badge className="bg-green-500 text-white text-xs px-2 py-1">
																				Perfect
																				Match!
																			</Badge>
																		)}
																		{skill.verified && (
																			<Award className="w-5 h-5 text-blue-500" />
																		)}
																	</div>
																</div>
																<div className="space-y-2">
																	<div className="flex items-center justify-between text-sm">
																		<span className="text-slate-600">
																			Proficiency
																		</span>
																		<span className="font-medium text-slate-900">
																			{getProficiencyLabel(
																				skill.proficiency
																			)}
																		</span>
																	</div>
																	<Progress
																		value={
																			skill.proficiency
																		}
																		className="h-3"
																	/>
																</div>
															</div>
														)
													)}
												</div>
											</div>

											<Separator className="my-6" />

											{/* Skills Seeking - Compact */}
											<div>
												<h4 className="text-lg font-semibold text-orange-700 mb-4 flex items-center gap-2">
													<Target className="w-5 h-5" />
													Looking to Learn (
													{user.skillsSeeking.length})
												</h4>
												<div className="flex flex-wrap gap-3">
													{user.skillsSeeking.map(
														(skill) => (
															<Badge
																key={skill.id}
																variant="secondary"
																className={`px-4 py-2 text-sm rounded-full transition-all hover:scale-105 ${
																	getSkillMatch(
																		skill
																	)
																		? "bg-orange-100 text-orange-700 border-2 border-orange-300 shadow-md"
																		: "bg-slate-100 text-slate-700 hover:bg-slate-200"
																}`}
															>
																{skill.name}
																{getSkillMatch(
																	skill
																) && (
																	<CheckCircle className="w-3 h-3 ml-2" />
																)}
															</Badge>
														)
													)}
												</div>
											</div>
										</CardContent>
									</Card>

									{/* About Section - Collapsible */}
									<Card className="border-slate-200 shadow-sm">
										<CardHeader
											className="cursor-pointer hover:bg-slate-50 transition-colors"
											onClick={() => toggleSection("bio")}
										>
											<div className="flex items-center justify-between">
												<h3 className="text-lg font-semibold text-slate-900">
													About {user.name}
												</h3>
												{expandedSections.bio ? (
													<ChevronUp className="w-5 h-5" />
												) : (
													<ChevronDown className="w-5 h-5" />
												)}
											</div>
										</CardHeader>
										{expandedSections.bio && (
											<CardContent className="pt-0">
												<p className="text-slate-700 leading-relaxed text-lg">
													{user.bio}
												</p>
												{user.socialLinks && (
													<div className="flex gap-3 mt-6">
														{user.socialLinks
															.website && (
															<Button
																variant="outline"
																size="sm"
																className="rounded-full"
															>
																<Globe className="w-4 h-4 mr-2" />
																Website
															</Button>
														)}
														{user.socialLinks
															.linkedin && (
															<Button
																variant="outline"
																size="sm"
																className="rounded-full"
															>
																LinkedIn
															</Button>
														)}
														{user.socialLinks
															.twitter && (
															<Button
																variant="outline"
																size="sm"
																className="rounded-full"
															>
																Twitter
															</Button>
														)}
													</div>
												)}
											</CardContent>
										)}
									</Card>

									{/* ... keep existing portfolio and reviews sections ... */}
								</div>

								{/* Enhanced Sidebar - 1 column */}
								<div className="space-y-6">
									{/* ... keep existing sidebar content ... */}
								</div>
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Enhanced Skill Swap Request Modal */}
			<SkillSwapRequestModal
				isOpen={skillSwapModalOpen}
				onClose={() => setSkillSwapModalOpen(false)}
				targetUser={userProfileForModal}
				currentUserSkills={currentUserSkills.map((skill) => ({
					id: skill.id,
					name: skill.name,
					proficiencyLevel: getProficiencyLabel(skill.proficiency) as
						| "Beginner"
						| "Intermediate"
						| "Advanced"
						| "Expert",
					category: skill.category,
					description: "",
				}))}
				onSubmitRequest={handleSubmitSwapRequest}
			/>
		</>
	);
};
