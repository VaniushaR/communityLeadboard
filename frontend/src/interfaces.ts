export interface User {
	_id: string;
	email: string;
	profilePicture?: string;
	totalExperience?: number;
	experiencePoints?: { points: number; timestamp: string }[];
	community?: { communityId: string };
}

export interface Community {
	_id: string;
	name: string;
	logo?: string;
	members?: { userId: string }[];
	totalExpPoints: number;
	totalMembers?: number;
}
