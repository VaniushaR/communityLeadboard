import express from "express";
import { UserModel } from "../models/User";
import { getErrorMessage } from "../utils";
import { CommunityModel } from "../models/Community";

const userRouter = express.Router();

/**
 * @route GET /user/:id
 * @param {string} id - User ID
 * @returns {User} - User object with experiencePoints field
 */
userRouter.get("/:id", async (req, res) => {
	const user = await UserModel.findById(req.params.id).select(
		"+experiencePoints"
	);
	if (!user) {
		return res.status(404).send({ message: "User not found" });
	}
	res.send(user);
});

/**
 * @route GET /user
 * @returns {Array} - Array of User objects
 * @note Adds the virtual field of totalExperience to the user.
 * @hint You might want to use a similar aggregate in your leaderboard code.
 */
userRouter.get("/", async (_, res) => {
	const users = await UserModel.aggregate([
		{
			$unwind: "$experiencePoints",
		},
		{
			$group: {
				_id: "$_id",
				email: { $first: "$email" },
				profilePicture: { $first: "$profilePicture" },
				totalExperience: { $sum: "$experiencePoints.points" },
			},
		},
	]);
	res.send(users);
});

/**
 * @route POST /user/:userId/join/:communityId
 * @param {string} userId - User ID
 * @param {string} communityId - Community ID
 * @description Joins a community
 */
userRouter.post("/:userId/join/:communityId", async (req, res) => {
	const { userId, communityId } = req.params;
	// TODO: Implement the functionality to join a community
	try {
		//1. validate if user and community exists

		const user = await UserModel.findById(userId);
		const community = await CommunityModel.findById(communityId);

		if (!user) {
			return res.status(404).send({ message: "User not found" });
		}

		if (!community) {
			return res.status(404).send({ message: "Community not found" });
		}

		//1.1 validate if the user already has a community value to prevent leaving it without knowing
		if (user.community && user.community.length > 0) {
			return res.status(400).send({
				message: `User is already member of one community `,
			});
		}

		//2. If user does not have a community added or proceeding, overwritte or add the value of community in user
		user.community?.push({ communityId: communityId });
		await user.save();

		//2.2 add the new member to the community members array:

		community.members?.push({ userId: userId });
		await community.save();

		//3. send success
		res.status(200).send({ message: "Joined to the community successfully" });
	} catch (error: unknown) {
		return res.status(500).send({ message: getErrorMessage(error) });
	}
});

/**
 * @route DELETE /user/:userId/leave/:communityId
 * @param {string} userId - User ID
 * @param {string} communityId - Community ID
 * @description leaves a community
 */
userRouter.delete("/:userId/leave/:communityId", async (req, res) => {
	const { userId, communityId } = req.params;
	// TODO: Implement the functionality to leave a community

	try {
		const user = await UserModel.findById(userId);
		const community = await CommunityModel.findById(communityId);
		//1. validate if user and community exists

		if (!user) {
			return res.status(404).send({ message: "User not found" });
		}

		if (!community) {
			return res.status(404).send({ message: "Community not found" });
		}

		//2. validate that the user has a community and that community corresponds to the communityId
		const isMember =
			user.community &&
			user.community.some((community) => community.communityId === communityId);

		//3. send error in case the user is not member of the community that tries to leave
		if (!isMember) {
			return res.status(400).send({
				message: `User is not a member of this community`,
			});
		}

		//4. in case the user has this community, delete it from user community array and from community members
		if (isMember) {
			await UserModel.findByIdAndUpdate(userId, {
				$pull: { community: { communityId: communityId } },
			});

			await CommunityModel.findByIdAndUpdate(communityId, {
				$pull: { members: { userId: userId } },
			});
			//5. Send leaving success
			res
				.status(200)
				.send({ message: `User left community ${communityId} successfully` });
		}
	} catch (error: unknown) {
		return res.status(500).send({ message: getErrorMessage(error) });
	}
});

export { userRouter };
