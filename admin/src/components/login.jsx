import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = credentials;

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    if (email === "admin@gmail.com" && password === "admin123") {
      setError("");
      alert("Login successful!");
      // Store admin secret for backend authentication
      localStorage.setItem('adminAuth', 'changeme');
      navigate("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-teal-700 mb-6 text-center">Admin Login</h1>
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="p-3 border border-gray-300 rounded-lg focus:ring focus:ring-teal-300"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="p-3 border border-gray-300 rounded-lg focus:ring focus:ring-teal-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-500 transition mt-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
