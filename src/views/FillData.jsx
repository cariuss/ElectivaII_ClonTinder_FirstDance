import { useState } from "react";
import { updateProfile } from "../api/usersservice";

const FillData = ({ userData, onSubmit }) => {
    const storedProfile = sessionStorage.getItem("profile");
    const initialFormData = userData || (storedProfile ? JSON.parse(storedProfile) : {}) || {
        name: "",
        age: "",
        gender: "",
        bio: "",
        minAge: 0,
        maxAge: 0,
        interestedInGender: "",
        maxDistance: 0,
        city: "",
        country: "",
        profilePhoto: ""
    };

    const [formData, setFormData] = useState({
        name: initialFormData.name || "",
        age: initialFormData.age || "",
        gender: initialFormData.gender || "",
        bio: initialFormData.bio || "",
        minAge: initialFormData.minAge || "",
        maxAge: initialFormData.maxAge || "",
        interestedInGender: initialFormData.interestedInGender || "",
        maxDistance: initialFormData.maxDistance || "",
        city: initialFormData.city,
        country: initialFormData.country || "",
        profilePhoto: initialFormData.profilePhoto || ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const payload = {
                name: formData.name.trim(),
                age: Number(formData.age),
                gender: formData.gender,
                bio: formData.bio.trim(),
                preferences: {
                    minAge: Number(formData.minAge),
                    maxAge: Number(formData.maxAge),
                    interestedInGender: formData.interestedInGender,
                    maxDistance: Number(formData.maxDistance)
                },
                location: {
                    city: formData.city.trim(),
                    country: formData.country.trim()
                },
                profilePhoto: formData.profilePhoto.trim()
            };

            console.log("Payload enviado al backend:", payload); // ✅ Verifica los datos antes de enviarlos
            await updateProfile(payload);

            sessionStorage.setItem("profile", JSON.stringify(payload));
            onSubmit();
        } catch (err) {
            console.error("Update failed:", err);
            setError("Failed to update profile. Please check your inputs.");
        } finally {
            setLoading(false);
        }
    };



    return (
        <form onSubmit={handleSubmit} className="bg-black p-6 rounded-xl shadow-xl max-w-md w-full mx-auto">
            <h2 className="text-center text-3xl font-bold text-red-500 mb-6">Edit Your Profile</h2>

            {/* Información básica */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                    <label className="text-gray-400 font-semibold">Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                </div>
                <div>
                    <label className="text-gray-400 font-semibold">Age</label>
                    <input
                        type="number"
                        name="age"
                        placeholder="Your Age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                </div>
            </div>

            {/* Género y bio */}
            <div className="mt-4">
                <label className="text-gray-400 font-semibold">Gender</label>
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500"
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className="mt-4">
                <label className="text-gray-400 font-semibold">Bio</label>
                <textarea
                    name="bio"
                    placeholder="Tell us about yourself"
                    value={formData.bio}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500"
                />
            </div>

            {/* Preferencias */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                    <label className="text-gray-400 font-semibold">Interested In</label>
                    <select
                        name="interestedInGender"
                        value={formData.interestedInGender}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                        <option value="">Select Preferred Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="text-gray-400 font-semibold">Max Distance (km)</label>
                    <input
                        type="number"
                        name="maxDistance"
                        placeholder="Max Distance"
                        value={formData.maxDistance}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                </div>
            </div>

            {/* Rango de edades */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                    <label className="text-gray-400 font-semibold">Minimum Age</label>
                    <input
                        type="number"
                        name="minAge"
                        placeholder="Min Age"
                        value={formData.minAge}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                </div>

                <div>
                    <label className="text-gray-400 font-semibold">Maximum Age</label>
                    <input
                        type="number"
                        name="maxAge"
                        placeholder="Max Age"
                        value={formData.maxAge}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                </div>
            </div>

            {/* Ubicación */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                    <label className="text-gray-400 font-semibold">City</label>
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                </div>

                <div>
                    <label className="text-gray-400 font-semibold">Country</label>
                    <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                </div>
            </div>

            <button type="submit" className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-bold w-full mt-6">
                {loading ? "Saving..." : "Save Profile"}
            </button>
        </form>

    );
};

export default FillData;
