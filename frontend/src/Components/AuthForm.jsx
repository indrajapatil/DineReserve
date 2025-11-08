import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser, saveUserToStorage } from "../utils/client";

const AuthForm = () => {
  const navigate = useNavigate(); // ✅ must be inside the component

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      let result;

      if (isLogin) {
        // Login
        result = await loginUser({
          email: formData.email,
          password: formData.password
        });
      } else {
        // Register
        result = await registerUser({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        });
      }

      if (result.success) {
        alert(isLogin ? "Login Successful!" : "Registration Successful!");

        // persist full user object and email
        const userObj = result.data || { email: formData.email };
        saveUserToStorage(userObj);

        // clear form
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: ""
        });

        // ✅ Redirect to Hero page (which is your homepage)
        navigate("/home");
      } else {
        alert(result.error || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ffe2b7] p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-amber-600 mb-4 text-center uppercase">
          {isLogin ? "Login" : "Register"}
        </h2>

        {!isLogin && (
          <>
            {/* Full Name */}
            <div className="mb-4">
              <label className="font-bold">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
                className="w-full p-3 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="font-bold">Phone</label>
              <input
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
                className="w-full p-3 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>
          </>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="font-bold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
            className="w-full p-3 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="font-bold">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
            className="w-full p-3 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Confirm Password */}
        {!isLogin && (
          <div className="mb-4">
            <label className="font-bold">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
              className="w-full p-3 mt-1 border rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-amber-600 text-white p-3 rounded-lg hover:bg-amber-500 transition"
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <p className="text-center mt-4 text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-amber-600 font-bold cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
