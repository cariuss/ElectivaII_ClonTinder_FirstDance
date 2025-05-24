import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { register } from "../api/authservice"; // Adjust path if necessary
import logo from "../assets/logo.svg"

const RegisterForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize navigate function

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state
    setLoading(true);

    try {
      const response = await register(formData.email, formData.password);
      console.log("Registration successful!", response);

      // **Navigate to login only if registration is successful**
      if (response.success === true) { 
        navigate("/login");
      }
    } catch (err) {
      setError("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-sm w-full bg-black p-6 rounded-xl shadow-lg">
        <img
            src={logo} // Replace with your actual path
            alt="Tinder Logo"
            className="w-16 h-16 mx-auto mb-4"
          />
        <h2 className="text-center text-3xl font-bold text-white mb-4">
          Create Account
        </h2>

        {error && (
          <div className="text-red-500 text-sm text-center mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500"
            required
          />

          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-lg font-bold transition ${
              loading ? "bg-gray-600 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 text-white"
            }`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-4 text-sm">
          Forgot password? <a href="#" className="text-red-500">Reset</a>
        </p>
        <p className="text-gray-400 text-center mt-2 text-sm">
  Have an account?{" "}
  <a href="/login" className="text-red-500">Login</a>
</p>
      </div>
    </div>
  );
};

export default RegisterForm;
