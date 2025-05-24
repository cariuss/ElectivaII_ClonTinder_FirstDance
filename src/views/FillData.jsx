import { useState } from "react";
import { updateProfile } from "../api/usersservice";

const FillData = ({ userData, onSubmit }) => {
    // Ensure initial data is always valid
    const initialFormData = userData || JSON.parse(sessionStorage.getItem("profile")) || {
        name: "",
        age: "",
        gender: "",
        bio: "",
        preferences: "",
        location: "",
        profilePhoto: ""
    };

    const [formData, setFormData] = useState({
        name: initialFormData.name || "",
        age: initialFormData.age || "",
        gender: initialFormData.gender || "",
        bio: initialFormData.bio || "",
        preferences: initialFormData.preferences || "",
        location: initialFormData.location || "",
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
            await updateProfile(
                formData.name,
                Number(formData.age),
                formData.gender,
                formData.bio,
                formData.preferences,
                formData.location,
                formData.profilePhoto
            );

            sessionStorage.setItem("profile", JSON.stringify(formData)); // Update local storage
            onSubmit(); // Close modal after successful submission
        } catch (err) {
            console.error("Update failed:", err);
            setError("Failed to update profile. Please check your inputs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 rounded-lg text-white">
            <h2 className="text-2xl font-bold text-center mb-4">Update Profile</h2>
            {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500" />
                <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500" />
                <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                <textarea name="bio" placeholder="Bio" value={formData.bio} onChange={handleChange} required className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500" />

                <input type="text" name="preferences" placeholder="Preferences" value={formData.preferences} onChange={handleChange} required className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500" />
                <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500" />
                <input type="text" name="profilePhoto" placeholder="Profile Photo URL" value={formData.profilePhoto} onChange={handleChange} required className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500" />

                <button type="submit" className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-bold w-full">
                    {loading ? "Saving..." : "Save & Continue"}
                </button>
            </form>
        </div>
    );
};

export default FillData;
