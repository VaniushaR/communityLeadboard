import express from "express";
import { CommunityModel } from "../models/Community";
import { getErrorMessage } from "../utils";
import { UserModel } from "../models/User";
const leaderboardRouter = express.Router();

/**
 * @route GET /leaderboard
 * @returns {Leaderboard} - Leadboard data
 */

leaderboardRouter.get("/", async (_, res) => {
	try {
		//1. first fetch all the communities
		const communities = await CommunityModel.find({}).lean();
		//1.2 filter communities that has not members
		if (communities) {
			const communitiesWithMembers = communities
				? communities.filter(
						(community) => community.members && community.members?.length > 0
				  )
				: [];

			//2. then fetch all the members of a community with Promise.all to return an array of promises
			if (communitiesWithMembers.length > 0) {
				const leaderboard = await Promise.all(
					communitiesWithMembers.map(async (community) => {
						//2.1 get all the ids of the registered members
						const membersIds = community.members?.map(
							(member) => member.userId
						);
						//2.1 fetch the users by id selecting the experiencePoints data on the query
						if (membersIds) {
							const users = await UserModel.find({
								_id: { $in: membersIds },
							}).select("+experiencePoints");
							let userTotalPoints = 0;
							//2.3 check if users exists, then reduce the total points for each user
							if (users) {
								const totalExpPoints = users.reduce(
									(acc: number, user: any) => {
										if (
											user.experiencePoints &&
											user.experiencePoints.length > 0
										) {
											userTotalPoints = user.experiencePoints.reduce(
												(userAcc: number, exp: any) => {
													return userAcc + exp.points;
												},
												0
											);
										}
										return acc + userTotalPoints;
									},
									0
								);
								//2.4 return the community object just with the needed fields
								return {
									name: community.name,
									logo: community.logo,
									totalExpPoints,
									totalMembers: community.members?.length,
								};
							} else
								res.status(204).send({
									message: "No users experience information available",
								});
						} else
							res
								.status(204)
								.send({ message: "No members information available" });
					})
				);

				const sortedCommunitiesByExpLead = leaderboard.sort(
					(communityA, communityB) => {
						const totalExpA = communityA?.totalExpPoints ?? 0;
						const totalExpB = communityB?.totalExpPoints ?? 0;
						return totalExpB - totalExpA;
					}
				);

				const topTen = sortedCommunitiesByExpLead.slice(0, 9);

				res.status(200).send(topTen);
			} else {
				res
					.status(204)
					.send({ message: "No Communities with members available" });
			}
		} else
			return res
				.status(204)
				.send({ message: "No available communities information" });
	} catch (error) {
		return res.status(500).send({ message: getErrorMessage(error) });
	}
});

export { leaderboardRouter };
