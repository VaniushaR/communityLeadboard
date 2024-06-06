import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Community, User } from "../../interfaces";
import { toast } from "react-hot-toast";

interface MutationData {
	userId: string;
	communityId: string;
}

const UserCommunityRelationshipManager = () => {
	const [selectedUser, setSelectedUser] = useState<string | null>(null);
	const [selectedCommunity, setSelectedCommunity] = useState<string | null>(
		null
	);

	const { data: users, isLoading: usersLoading } = useQuery({
		queryKey: ["users"],
		queryFn: () =>
			axios.get("http://localhost:8080/user").then((res) => res.data),
	});

	const { data: communities, isLoading: communitiesLoading } = useQuery({
		queryKey: ["communities"],
		queryFn: () =>
			axios.get("http://localhost:8080/community").then((res) => res.data),
	});

	const joinMutation = useMutation({
		mutationFn: (data: MutationData) =>
			axios.post(
				`http://localhost:8080/user/${data.userId}/join/${data.communityId}`
			),
		onSuccess: () => {
			toast.success("Successfully joined the community");
		},
		onError: (error: any) => {
			toast.error(`Error: ${error.response.data.message}`);
		},
	});
	const leaveMutation = useMutation({
		mutationFn: (data: MutationData) =>
			axios.delete(
				`http://localhost:8080/user/${data.userId}/leave/${data.communityId}`
			),
		onSuccess: () => {
			toast.success("Successfully left the community");
		},
		onError: (error: any) => {
			toast.error(`Error: ${error.response.data.message}`);
		},
	});

	const handleJoinClick = () => {
		if (selectedUser && selectedCommunity) {
			joinMutation.mutate({
				userId: selectedUser,
				communityId: selectedCommunity,
			});
		}
	};

	const handleLeaveClick = () => {
		if (selectedUser && selectedCommunity) {
			leaveMutation.mutate({
				userId: selectedUser,
				communityId: selectedCommunity,
			});
		}
	};

	if (usersLoading || communitiesLoading) return "Loading...";

	return (
		<section className="container bg-text-white rounded">
			<h2 className="h3 my-4 pt-3">Community Members Management</h2>
			<div className="input-group mb-2 d-flex pb-4">
				<span className="input-group-text">User: &nbsp;</span>
				<select
					className="me-4"
					onChange={(e) => setSelectedUser(e.target.value)}
				>
					<option value="">Select User</option>
					{users.map((user: User) => (
						<option key={user._id} value={user._id}>
							{user.email}
						</option>
					))}
				</select>

				<span className="input-group-text">Community: &nbsp;</span>
				<select
					className="me-4"
					onChange={(e) => setSelectedCommunity(e.target.value)}
				>
					<option value="">Select Community</option>
					{communities.map((community: Community) => (
						<option key={community._id} value={community._id}>
							{community.name}
						</option>
					))}
				</select>
				<div className="ms-auto">
					<button
						className="btn btn-primary rounded-1 me-4"
						onClick={handleJoinClick}
						disabled={!selectedUser || !selectedCommunity}
					>
						Join
					</button>

					<button
						className="btn btn-outline-secondary rounded-1"
						onClick={handleLeaveClick}
						disabled={!selectedUser || !selectedCommunity}
					>
						Leave
					</button>
				</div>
			</div>
		</section>
	);
};

export default UserCommunityRelationshipManager;
