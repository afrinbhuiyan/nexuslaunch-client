import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-hot-toast";
import GoogleLoginButton from "../../components/auth/GoogleLoginButton";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import saveUser from "../../utils/saveUser";

const Login = () => {
  const { signInUser, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const axiosSecure = useAxios();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signInUser(email, password);
      const loggedInUser = result.user;

      const saved = await saveUser(axiosSecure, loggedInUser);

      if (saved) {
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error("User save failed!");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card w-full max-w-md shadow-xl bg-white">
        <div className="card-body p-8">
          <h2 className="text-3xl font-bold text-center text-primary mb-4">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              />
            </div>

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
              />
            </div>

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          <GoogleLoginButton loading={loading} />

          <p className="text-center mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="link link-primary">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
