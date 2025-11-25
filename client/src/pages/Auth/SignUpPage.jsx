import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validation helper
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before submitting
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        toast.success("🎉 Account created successfully! Redirecting...", {
          autoClose: 2000,
        });
        setTimeout(() => navigate("/home"), 2000);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FFF9F3]">
      {/* Left Side - Introduction */}
      <div className="w-2/3 flex-col items-center justify-center hidden md:flex space-y-8">
        <div className="max-w-2xl mx-auto">
          <motion.h1
            className="text-6xl font-extrabold text-center leading-tight px-4 bg-gradient-to-r from-[#FF7A1A] to-[#FFB347] text-transparent bg-clip-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Start Your Writing Journey Today
          </motion.h1>
          <motion.p
            className="mt-8 text-2xl text-center px-8 text-[#444]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            ✍️ Create, Share, and Connect with Writers Worldwide
          </motion.p>

          <motion.div
            className="mt-12 flex justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-center p-4 bg-white border border-gray-200 rounded-lg">
              <h3 className="text-2xl font-bold text-[#111]">Free</h3>
              <p className="text-[#555]">Forever</p>
            </div>
            <div className="text-center p-4 bg-white border border-gray-200 rounded-lg">
              <h3 className="text-2xl font-bold text-[#111]">AI-Powered</h3>
              <p className="text-[#555]">Writing Tools</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center flex-col px-8 bg-white">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-center text-[#111] mb-8">
            Create Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label
                htmlFor="email"
                className="block font-medium text-[#444] text-lg"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                className={`w-full bg-[#FFF9F3] border px-4 py-4 text-[#111] focus:outline-none focus:ring-2 rounded-xl transition-all ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-[#F3F4F6] focus:ring-[#FF7A1A]/20"
                }`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div className="space-y-4">
              <label
                htmlFor="password"
                className="block font-medium text-[#444] text-lg"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  className={`w-full bg-[#FFF9F3] border px-4 py-4 text-[#111] focus:outline-none focus:ring-2 rounded-xl transition-all ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-[#F3F4F6] focus:ring-[#FF7A1A]/20"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password ? (
                <p className="text-red-500 text-sm">{errors.password}</p>
              ) : (
                <p className="text-sm text-gray-500">
                  Must be at least 6 characters long
                </p>
              )}
            </div>

            <div className="space-y-4">
              <label
                htmlFor="confirmPassword"
                className="block font-medium text-[#444] text-lg"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword)
                      setErrors({ ...errors, confirmPassword: "" });
                  }}
                  className={`w-full bg-[#FFF9F3] border px-4 py-4 text-[#111] focus:outline-none focus:ring-2 rounded-xl transition-all ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-[#F3F4F6] focus:ring-[#FF7A1A]/20"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#FF7A1A] to-[#FFB347] hover:from-[#FF6600] hover:to-[#FFA533] text-white py-4 px-8 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-6 text-[#555]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#FF7A1A] font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </motion.div>
      </div>
      <ToastContainer
        position="bottom-center"
        hideProgressBar={true}
        theme="light"
        transition={Slide}
      />
    </div>
  );
};

export default SignUpPage;
