const Sidebar = ({ setSelectedView }) => {
    return (
      <div className="w-64 bg-gray-800 h-screen flex flex-col p-6">
        <h2 className="text-white text-2xl font-bold mb-6">Menu</h2>
  
        <button
          onClick={() => setSelectedView("Home")}
          className="w-full text-left text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition"
        >
          🏠 Home
        </button>
  
        <button
          onClick={() => setSelectedView("Profile")}
          className="w-full text-left text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition mt-2"
        >
          👤 Profile
        </button>
  
        <button
          onClick={() => setSelectedView("Matches")}
          className="w-full text-left text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition mt-2"
        >
          💕 Matches
        </button>
  
        {/* More Features Can Be Added Later */}
      </div>
    );
  };
  
  export default Sidebar;
  