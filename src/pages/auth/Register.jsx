import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import GoogleLoginButton from "../../components/auth/GoogleLoginButton";
import { uploadImageToImgBB } from "../../utils/imageUpload";
import useAuth from "../../hooks/useAuth";
import saveUser from "../../utils/saveUser";
import useAxios from "../../hooks/useAxios";

const Register = () => {
  const { createUser, updateUserProfile } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const axiosSecure = useAxios();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        toast.error("Please select an image file (JPEG, PNG, etc.)");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (!name || !email || !password) {
        throw new Error("Please fill in all fields");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      // Image handling
      let photoURL = "https://i.ibb.co/4pDNDk1/avatar.png";
      if (image) {
        try {
          photoURL = await uploadImageToImgBB(image);
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          toast.error("Profile image upload failed. Using default avatar.");
        }
      }

      // Create Firebase user
      const userCredential = await createUser(email, password);
      const user = userCredential.user;

      // Update profile
      await updateUserProfile({
        displayName: name,
        photoURL: photoURL,
      });

      // Save user to database
      const userData = {
        name,
        email,
        image: photoURL,
        role: "user",
        isSubscribed: false,
        uid: user.uid,
      };

      const saved = await saveUser(axiosSecure, userData);
      if (!saved) {
        throw new Error("Failed to save user data");
      }

      toast.success("Registration successful! Redirecting...");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error("Registration error:", error);

      // Handle specific Firebase errors
      let errorMessage = "Registration failed. Please try again.";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email already in use. Please login instead.";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address";
          break;
        default:
          if (error.message.includes("Failed to save user data")) {
            errorMessage =
              "Account created but profile setup failed. Please update your profile later.";
          }
      }

      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-indigo-600 py-5 px-6">
            <h2 className="text-2xl font-bold text-white">
              Create Your Account
            </h2>
            <p className="text-indigo-100">Join our community today</p>
          </div>

          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Profile Image Upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Profile Image
                  </label>
                  <span className="text-xs text-gray-500">Optional</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-indigo-500">
                      <img
                        src={
                          imagePreview || "https://i.ibb.co/4pDNDk1/avatar.png"
                        }
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    disabled={isLoading}
                    className="px-3 py-1.5 text-sm rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition disabled:opacity-50"
                  >
                    {image ? "Change" : "Upload"}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-gray-500">Max 2MB (JPEG, PNG)</p>
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-70"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-70"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:opacity-70"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">Minimum 6 characters</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Registering...
                  </span>
                ) : (
                  "Register"
                )}
              </button>
            </form>

            <div className="my-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
            </div>

            <GoogleLoginButton loading={isLoading} setLoading={setIsLoading} />

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
