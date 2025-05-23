import { useState } from "react";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Replace this with your actual API call
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-sm w-full bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-bold text-white mb-4">Create Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-red-500"
          />

          <button
            type="submit"
            className="w-full bg-red-500 text-white py-3 rounded-lg text-lg font-bold hover:bg-red-600 transition"
          >
            Create
          </button>
        </form>
        
        <p className="text-gray-400 text-center mt-4 text-sm">
          Forgot password? <a href="#" className="text-red-500">Reset</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
