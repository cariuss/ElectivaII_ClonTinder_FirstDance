import { useState } from "react";
import Sidebar from "./SideBar"; // Sidebar will be created later
import UserProfile from "../views/UserProfile";
import MatchesChat from "../views/MatchesChat";
import PotentialMatches from "../views/PotentialMatches";

const Dashboard = () => {
  const [selectedView, setSelectedView] = useState("Home"); // Default view

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar Component */}
      <Sidebar setSelectedView={setSelectedView} />

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <div className="mt-4">
          {selectedView === "Home" && <PotentialMatches />}
          {selectedView === "Profile" && <UserProfile />}
          {selectedView === "Matches" && <MatchesChat />}
          {selectedView === "helpme" && <MatchesChat />}

          {/* Additional views can be added later */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
