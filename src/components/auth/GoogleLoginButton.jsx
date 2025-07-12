import { FaGoogle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useAxios from '../../hooks/useAxios';
import saveUser from '../../utils/saveUser';

const GoogleLoginButton = ({ loading, setLoading }) => {
  const { googleLogin } = useAuth();
  const axiosSecure = useAxios();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
  try {
    if (setLoading) setLoading(true);

    const result = await googleLogin();
    const user = result.user;

    const success = await saveUser(axiosSecure, user);

    if (success) {
      toast.success('Google login successful!');
      navigate('/');
    } else {
      toast.error('User save failed');
    }

  } catch (error) {
    toast.error(error.message);
  } finally {
    if (setLoading) setLoading(false);
  }
};

  return (
    <>
      <div className="divider">OR</div>
      <button
        onClick={handleGoogleLogin}
        className="btn btn-outline w-full gap-2"
        disabled={loading}
      >
        <FaGoogle className="text-lg" />
        Continue with Google
      </button>
    </>
  );
};

export default GoogleLoginButton;
