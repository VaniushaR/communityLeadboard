import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Community } from "../../interfaces";

const LeadershipBoard = () => {
	const { data: filteredLeaderboard, isLoading: boardLoading } = useQuery({
		queryKey: ["filteredLeadboard"],
		queryFn: () =>
			axios.get("http://localhost:8080/leaderboard").then((res) => res.data),
	});
	if (boardLoading) return "Board Loading...";

	//add ranking top number to a copy of the original array
	const rankedTopTenCommunities =
		filteredLeaderboard && filteredLeaderboard.length > 0
			? filteredLeaderboard.map((community: any, i: number) => {
					return { ...community, rank: i + 1 };
			  })
			: [];
	//slice array of the top 10 to render 2 cols in case of available space
	const topFiveCommunities = rankedTopTenCommunities.slice(0, 5);
	const nextTopFiveCommunities = rankedTopTenCommunities.slice(5, 9);

	const leadBoardHeaderRank = () => (
		<li className="d-flex align-items-center p-2 border border-light-subtle">
			<span className="fs-6 text-primary me-4">Rank </span>
			<span className="fs-6 text-primary me-4">Community </span>
			<span className="fs-6 text-primary me-4 ms-auto">Members </span>
			<span className="fs-6 text-primary ms-4 me-2">Exp </span>
		</li>
	);

	const communityPlacement = (community: any, i: number) => (
		<li
			key={i}
			className={`p-2 rounded-1 d-flex align-items-center border border-light-subtle ${
				community.rank % 2 === 0 ? "bg-pastel-plum" : "bg-text-white"
			}`}
		>
			<span className="fs-5 me-4 ms-2">{community.rank}</span>
			<img
				className="rounded-3 me-4 ms-4"
				src={community.logo}
				height={60}
				width={60}
			></img>
			<span className="fs-5 me-2 m2-lg-4">{community.name}</span>
			<span className="fs-5 me-2 m2-lg-4 ms-auto ">
				<i className="bi bi-people-fill me-1"></i>
				{community.totalMembers}
			</span>
			<span className="text-white badge text-bg-primary rounded-pill ms-4">
				{community.totalExpPoints}
			</span>
		</li>
	);

	return (
		<div className="container">
			<h2 className="h3 mt-4">Top Community Leaderboard</h2>

			<div className="row row-cols-1 row-cols-lg-2 mt-4">
				{topFiveCommunities && topFiveCommunities.length > 0 ? (
					<div className="col">
						{leadBoardHeaderRank()}
						{topFiveCommunities.map((community: Community, i: number) =>
							communityPlacement(community, i)
						)}
					</div>
				) : null}

				{nextTopFiveCommunities && nextTopFiveCommunities.length > 0 ? (
					<div className="col">
						<div className="d-none d-md-block"> {leadBoardHeaderRank()}</div>
						{nextTopFiveCommunities.map((community: Community, i: number) =>
							communityPlacement(community, i)
						)}
					</div>
				) : null}
			</div>
			<hr />
		</div>
	);
};

export default LeadershipBoard;
