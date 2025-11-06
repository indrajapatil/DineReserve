import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    const url = isLogin
      ? "http://localhost:5000/api/user/login"
      : "http://localhost:5000/api/user/register";

    try {
      // Build payload without confirmPassword
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, phone: formData.phone, password: formData.password };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        alert(isLogin ? "Login Successful!" : "Registration Successful!");

        // persist full user object and email so other parts (reservation form, history)
        // can pick up logged-in user info
        const userObj = data?.data || { email: formData.email };
        try {
          localStorage.setItem('user', JSON.stringify(userObj));
        } catch (err) {
          console.warn('Failed to store user object in localStorage', err);
        }
        const savedEmail = userObj?.email || formData.email;
        if (savedEmail) localStorage.setItem('userEmail', savedEmail);

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
        alert(data.error || "Something went wrong!");
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
