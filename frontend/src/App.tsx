//import "./App.css";
import UserCommunityRelationshipManager from "./components/CommunityRelationshipManager/UserCommunityRelationshipManager";
import { Toaster } from "react-hot-toast";
import LeadershipBoard from "./components/LeadershipCommunitiesBoard/LeadershipBoard";
import { UserProfile } from "./components/UserProfile/UserProfile";
import { Footer } from "./components/Footer/Footer";

function App() {
	return (
		<>
			<Toaster position="top-center" />
			<div>
				<LeadershipBoard />
				<UserProfile />
				<UserCommunityRelationshipManager />
				<Footer />
			</div>
		</>
	);
}

export default App;
