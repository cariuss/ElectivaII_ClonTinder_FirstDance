import { useState, useEffect } from "react";
import { getProfile, updateAdditionalProfilePhotos, updateProfilePhoto } from "../api/usersservice"; // <-- import the new API call
import Modal from "../components/Modal";
import FillData from "./FillData";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFillModalOpen, setIsFillModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // New states for profile photo modal:
  const [isProfilePhotoModalOpen, setIsProfilePhotoModalOpen] = useState(false);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);

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

  const additionalPhotos = user?.additionalPhotos || [];

  // Upload additional photos (existing)
  const handleAddPhoto = async () => {
    if (additionalPhotos.length >= 4) return; // Max 4 photos

    try {
      if (!selectedFile || selectedFile.length === 0) {
        alert("Please select at least one photo.");
        return;
      }

      await updateAdditionalProfilePhotos(selectedFile);

      setUser((prevUser) => ({
        ...prevUser,
        additionalPhotos: [
          ...additionalPhotos,
          ...selectedFile.map((file) => URL.createObjectURL(file)),
        ],
      }));

      setIsPhotoModalOpen(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

  // New: Update profile photo handler
  const handleUpdateProfilePhoto = async () => {
    if (!profilePhotoFile) {
      alert("Please select a photo.");
      return;
    }

    try {
      await updateProfilePhoto(profilePhotoFile); // send FormData with the single file

      // Update UI preview: create URL from uploaded file (or you can re-fetch user profile for fresh data)
      setUser((prevUser) => ({
        ...prevUser,
        profilePhoto: URL.createObjectURL(profilePhotoFile),
      }));

      setIsProfilePhotoModalOpen(false);
      setProfilePhotoFile(null);
    } catch (error) {
      console.error("Error updating profile photo:", error);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white w-full flex flex-col gap-6">
      {/* Profile & Gallery Section */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Block: Profile Details */}
        <div className="md:w-1/2 p-4 bg-gray-900 rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-4">Profile</h2>
          {user && (
            <div className="space-y-3">
              <div className="relative w-24 h-24 mx-auto">
                <img
                  src={user.profilePhoto}
                  alt="Profile"
                  className="w-24 h-24 rounded-full"
                />
                {/* Button to open modal to update profile photo */}
                <button
                  onClick={() => setIsProfilePhotoModalOpen(true)}
                  className="absolute bottom-0 right-0 bg-red-500 rounded-full p-1 hover:bg-red-600 transition"
                  title=""
                >
                  ✏️
                </button>
              </div>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Age:</strong> {user.age}
              </p>
              <p>
                <strong>Gender:</strong> {user.gender}
              </p>
              <p>
                <strong>Bio:</strong> {user.bio}
              </p>

              {/* Edit Profile Button */}
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
                <img
                  src={photo}
                  alt={`Additional ${index}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}

            {additionalPhotos.length < 4 && (
              <div
                className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-600 transition"
                onClick={() => setIsPhotoModalOpen(true)}
              >
                <span className="text-white text-3xl">+</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para editar el perfil */}
      <Modal
        isOpen={isFillModalOpen}
        onClose={() => setIsFillModalOpen(false)}
        title={false}
        text={false}
        icon={false}
      >
        <FillData userData={user} onSubmit={() => setIsFillModalOpen(false)} />
      </Modal>

      {/* Modal para agregar una nueva foto */}
      <Modal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        title="Upload Photo"
      >
        <div className="p-4 flex flex-col items-center">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setSelectedFile(Array.from(e.target.files))}
            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={handleAddPhoto}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-bold mt-4"
          >
            Add Photo
          </button>
        </div>
      </Modal>

      {/* Modal para actualizar la foto de perfil */}
      <Modal
        isOpen={isProfilePhotoModalOpen}
        onClose={() => setIsProfilePhotoModalOpen(false)}
        title="Update Profile Photo"
      >
        <div className="p-4 flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePhotoFile(e.target.files[0])}
            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={handleUpdateProfilePhoto}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-bold mt-4"
          >
            Update Photo
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default UserProfile;
