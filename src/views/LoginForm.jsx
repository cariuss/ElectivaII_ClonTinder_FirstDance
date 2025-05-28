import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg"
import { useGlobal } from "../context/GlobalContext"; // Adjust path as needed


const LoginForm = () => {
  const { login } = useGlobal(); // grab the login function from context

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(formData.email, formData.password); // using context login now
      console.log(response, "response")
      if (response.success && response.data.token) {
        navigate("/dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-sm w-full bg-black p-6 rounded-xl shadow-lg">
        <img
          src={logo} // Replace with your actual path
          alt="Tinder Logo"
          className="w-16 h-16 mx-auto mb-4"
        />

        <h2 className="text-center text-3xl font-bold text-white mb-4">Login</h2>

        {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}

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
            className={`w-full py-3 rounded-lg text-lg font-bold transition ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="text-gray-400 text-center mt-4 text-sm">
            Don't have an account?{" "}
            <a href="/create/user" className="text-red-500">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
