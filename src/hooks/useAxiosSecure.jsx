import axios from "axios";
import { getAuth } from "firebase/auth";

// Create a single instance outside the hook
const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Attach interceptor once
axiosSecure.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const useAxiosSecure = () => {
  return axiosSecure;
};

export default useAxiosSecure;
