import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { User } from "../../interfaces";
import "./UserProfile.scss";

const UserProfile = () => {
	const [selectedUser, setSelectedUser] = useState<string | null>(null);
	const [userCommunity, setUserCommunity] = useState<string | null>(null);

	const { data: users, isLoading: usersLoading } = useQuery({
		queryKey: ["users"],
		queryFn: () =>
			axios.get("http://localhost:8080/user").then((res) => res.data),
	});

	const {
		data: user,
		isLoading: userLoading,
		refetch,
		isFetching: userFetching,
	} = useQuery({
		queryKey: ["user"],
		queryFn: () => {
			if (selectedUser) {
				return axios
					.get(`http://localhost:8080/user/${selectedUser}`)
					.then((res) => res.data);
			}
			return null;
		},
		enabled: false,
	});

	const { data: community, isLoading: communityLoading } = useQuery({
		queryKey: ["userCommunity"],
		queryFn: () => {
			if (userCommunity) {
				return axios
					.get(`http://localhost:8080/community/${userCommunity}`)
					.then((res) => res.data);
			}
			return null;
		},
		enabled: !!userCommunity,
	});

	const handleGetProfile = () => {
		if (selectedUser) {
			refetch();
		}
	};

	useEffect(() => {
		if (user && user.community && user.community.length > 0) {
			const newCommunityId = user.community[0].communityId;
			if (userCommunity !== newCommunityId) {
				setUserCommunity(newCommunityId);
			}
		}
	}, [user, userCommunity]);

	if (usersLoading) return "Loading...";

	if (userLoading || userFetching) return "Loading...";

	return (
		<section className="user-profile container bg-text-white rounded pb-4 pt-2">
			<h2 className="h3 my-4">User Profile</h2>

			<div className="input-group mb-2 d-flex">
				<span className="input-group-text">User: &nbsp;</span>
				<select onChange={(e) => setSelectedUser(e.target.value)}>
					<option value="">Select User</option>
					{users.map((user: User) => (
						<option key={user._id} value={user._id}>
							{user.email}
						</option>
					))}
				</select>
				<button className="btn btn-pastel-lilac" onClick={handleGetProfile}>
					See User Information
				</button>
			</div>
			{user ? (
				<div className="user-profile__card card mt-4">
					<img
						className="card-img-top"
						src={user.profilePicture}
						height={100}
						width={100}
					></img>
					<div className="card-body">
						<h5 className="fs-5 card-title text-center mb-2">{user.email}</h5>
						<span className="card-text ">
							{user.community && user.community.length > 0
								? `Community: ${
										communityLoading ? "loading" : community?.name || "Unknown"
								  } `
								: "User is not part of any community yet."}
						</span>
					</div>
				</div>
			) : null}
		</section>
	);
};
export { UserProfile };
