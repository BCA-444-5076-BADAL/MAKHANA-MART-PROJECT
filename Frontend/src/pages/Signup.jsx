// SignupPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/users"; // ✅ backend ka correct port

export default function SignupPage() {
  const navigate = useNavigate(); // ✅ small 'n'

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "Name is required";
    if (!form.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/))
      e.email = "Enter a valid email";
    if (form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ apiError: data.error || "Signup failed" });
        setSuccess("");
        return;
      }

      // ✅ success case
      setSuccess("Signup successful! Redirecting...");
      setForm({ username: "", email: "", password: "", confirm: "" });
      setErrors({});

      setTimeout(() => navigate("/login"), 1500); // 1.5 sec delay then redirect
    } catch (err) {
      console.error(err);
      setErrors({ apiError: "Server error. Try again later." });
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-green-100 to-green-50 p-6">
      <div className="w-full max-w-md backdrop-blur-lg bg-white/70 rounded-3xl shadow-2xl p-8 border border-green-300">
        <h2 className="text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
          Create Your Account
        </h2>

        {errors.apiError && (
          <p className="text-red-600 text-sm mb-2 text-center">{errors.apiError}</p>
        )}
        {success && (
          <p className="text-green-700 text-sm mb-2 text-center">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Full Name"
              className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-400 transition duration-300 ${
                errors.username
                  ? "border-red-400"
                  : "border-green-200 hover:border-green-400"
              }`}
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="Email"
              className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-400 transition duration-300 ${
                errors.email
                  ? "border-red-400"
                  : "border-green-200 hover:border-green-400"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-400 transition duration-300 ${
                errors.password
                  ? "border-red-400"
                  : "border-green-200 hover:border-green-400"
              }`}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-green-600 font-medium hover:underline"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              type="password"
              placeholder="Confirm Password"
              className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-green-400 transition duration-300 ${
                errors.confirm
                  ? "border-red-400"
                  : "border-green-200 hover:border-green-400"
              }`}
            />
            {errors.confirm && (
              <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="rounded border-green-300 accent-green-500"
              required
            />
            <span>
              I agree to the{" "}
              <a className="text-green-600 underline hover:text-green-700">
                Terms
              </a>
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
          >
            Sign Up
          </button>

          <p className="text-center text-sm text-green-700 mt-2">
            Already have an account?{" "}
            <a
              href="/login"
              className="underline font-medium hover:text-green-800"
            >
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
