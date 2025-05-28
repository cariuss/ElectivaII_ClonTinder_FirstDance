import { useState, useEffect } from "react";
import { getProfile, updateAdditionalProfilePhotos } from "../api/usersservice";
import Modal from "../components/Modal";
import FillData from "./FillData";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFillModalOpen, setIsFillModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");

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

  // 🖼️ Agregar nueva foto
  const handleAddPhoto = async () => {
    if (additionalPhotos.length >= 4) return; // Máximo de 4 fotos permitidas

    try {
      const filesArray = Array.from(newPhotoFiles); // ✅ Convertir archivos a array

      await updateAdditionalProfilePhotos(filesArray); // ✅ Enviar archivos al backend

      setUser((prevUser) => ({
        ...prevUser,
        additionalPhotos: [...additionalPhotos, ...filesArray.map(file => URL.createObjectURL(file))], // ✅ Vista previa en la UI
      }));

      setIsPhotoModalOpen(false);
      setNewPhotoFiles([]); // ✅ Limpiar archivos después de subirlos
    } catch (error) {
      console.error("Error uploading photo:", error);
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
              <img src={user.profilePhoto} alt="Profile" className="w-24 h-24 rounded-full mx-auto" />
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Age:</strong> {user.age}</p>
              <p><strong>Gender:</strong> {user.gender}</p>
              <p><strong>Bio:</strong> {user.bio}</p>

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
                <img src={photo} alt={`Additional ${index}`} className="w-full h-full object-cover rounded-lg" />
              </div>
            ))}

            {/* Botón "Agregar Foto" solo si hay menos de 4 fotos */}
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
      <Modal isOpen={isPhotoModalOpen} onClose={() => setIsPhotoModalOpen(false)} title="Upload Photo">
        <div className="p-4 flex flex-col items-center">
          <input
            type="text"
            placeholder="Enter photo URL"
            value={newPhotoUrl}
            onChange={(e) => setNewPhotoUrl(e.target.value)}
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
    </div>
  );
};

export default UserProfile;
