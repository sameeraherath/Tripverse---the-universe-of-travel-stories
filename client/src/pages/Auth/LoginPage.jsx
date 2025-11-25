import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "../../features/auth/authSlice";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before submitting
    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(loginUser({ email, password }));

      if (loginUser.fulfilled.match(result)) {
        toast.success("🎉 Login successful! Redirecting...", {
          autoClose: 2000,
        });

        // Redirect based on user role
        setTimeout(() => {
          if (
            result.payload.role === "admin" ||
            result.payload.role === "superadmin"
          ) {
            navigate("/admin");
          } else {
            navigate("/home");
          }
        }, 2000);
      } else if (loginUser.rejected.match(result)) {
        // Show specific error message from server
        const errorMessage =
          result.payload?.message || "Invalid email or password";
        toast.error(errorMessage, {
          autoClose: 4000,
        });
        // Stay on login page - no navigation
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.", {
        autoClose: 4000,
      });
      // Stay on login page - no navigation
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
            Share Your Travel Adventures, Inspire Others
          </motion.h1>
          <motion.p
            className="mt-8 text-2xl text-center px-8 text-[#444]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            🌍 Join Fellow Travelers. Document Your Journey, Discover New
            Places!
          </motion.p>

          <motion.div
            className="mt-12 flex justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-center p-4 bg-white border border-gray-200 rounded-lg">
              <h3 className="text-2xl font-bold text-[#111]">10K+</h3>
              <p className="text-[#555]">Travel Bloggers</p>
            </div>
            <div className="text-center p-4 bg-white border border-gray-200 rounded-lg">
              <h3 className="text-2xl font-bold text-[#111]">50K+</h3>
              <p className="text-[#555]">Travel Stories</p>
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
            Welcome Back
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
                  placeholder="Enter your password"
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
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#FF7A1A] to-[#FFB347] hover:from-[#FF6600] hover:to-[#FFA533] text-white py-4 px-8 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center mt-6 text-[#555]">
            Don&#39;t have an account?{" "}
            <Link
              to="/signup"
              className="text-[#FF7A1A] font-semibold hover:underline"
            >
              Sign Up
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

export default LoginPage;
