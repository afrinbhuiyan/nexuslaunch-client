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
      if (!name || !email || !password) {
        throw new Error("Please fill in all fields");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      let photoURL = "https://i.ibb.co/4pDNDk1/avatar.png";

      if (image) {
        try {
          photoURL = await uploadImageToImgBB(image);
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          toast.error("Profile image upload failed. Using default avatar.");
        }
      }

      const userCredential = await createUser(email, password);

      await updateUserProfile({
        displayName: name,
        photoURL: photoURL,
      });

      // ✅ Save user to DB
      const saved = await saveUser(axiosSecure, userCredential.user);
      if (!saved) {
        toast.error("User registration failed to save in DB.");
        return;
      }

      toast.success("Registration successful! Redirecting...");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);

      let errorMessage = "Registration failed. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage =
          "This email is already registered. Please login instead.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address";
      }

      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="card w-full max-w-md shadow-xl bg-white">
        <div className="card-body p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-4">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Image Upload */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Profile Image</span>
                <span className="label-text-alt text-gray-500">Optional</span>
              </label>
              <div className="flex items-center gap-4">
                <div className="avatar">
                  <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={
                        imagePreview || "https://i.ibb.co/4pDNDk1/avatar.png"
                      }
                      alt="Profile preview"
                      className="object-cover"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => fileInputRef.current.click()}
                  disabled={isLoading}
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
              <label className="label">
                <span className="label-text-alt text-gray-500">
                  Max 2MB (JPEG, PNG)
                </span>
              </label>
            </div>

            {/* Name Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {/* Email Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading}
              />
              <label className="label">
                <span className="label-text-alt text-gray-500">
                  Minimum 6 characters
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </form>

          <div className="divider">OR</div>

          <GoogleLoginButton loading={isLoading} setLoading={setIsLoading} />

          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="link link-primary hover:link-secondary"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
