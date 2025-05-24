import { useState, useEffect } from "react";
import { getProfile } from "../api/usersservice";
import Modal from "../components/Modal";
import FillData from "./FillData"
const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFillModalOpen, setIsFillModalOpen] = useState(false); // Manage modal state

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        setUser(profileData.data);
      } catch (err) {
        setError("Failed to load profile.");
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="text-white text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  const additionalPhotos = user?.additionalPhotos || ["+", "+", "+", "+"];

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white w-full flex flex-col gap-6">
      {/* Profile & Gallery Section */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Block: Profile Details */}
        <div className="md:w-1/2 p-4 bg-gray-900 rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-4">Profile</h2>
          {user && (
            <div className="space-y-3">
              <img src={user.profilePhoto} alt="Profile" className="w-24 h-24 rounded-full mx-auto" />
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Age:</strong> {user.age}</p>
              <p><strong>Gender:</strong> {user.gender}</p>
              <p><strong>Bio:</strong> {user.bio}</p>

              {/* Edit Profile Button (Opens Modal) */}
              <button
                onClick={() => setIsFillModalOpen(true)}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-bold transition"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Right Block: Additional Photos */}
        <div className="md:w-1/2 p-4 bg-gray-900 rounded-lg flex flex-col items-center">
          <h2 className="text-2xl font-bold text-center mb-4">Gallery</h2>
          <div className="grid grid-cols-2 gap-4 place-items-center">
            {additionalPhotos.map((photo, index) => (
              <div
                key={index}
                className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-600 transition"
              >
                {photo === "+" ? (
                  <span className="text-white text-3xl">+</span>
                ) : (
                  <img src={photo} alt={`Additional ${index}`} className="w-full h-full object-cover rounded-lg" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Component (Renders `FillUserData`) */}
      <Modal
        isOpen={isFillModalOpen}
        onClose={() => setIsFillModalOpen(false)}
        title={false}
        text={false}
        icon={false}
        children={<FillData userData={user} onSubmit={() => setIsFillModalOpen(false)} />}
      />

    </div>
  );
};

export default UserProfile;
