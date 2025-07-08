import { FaGoogle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const GoogleLoginButton = ({ loading, setLoading }) => {
  const { googleLogin } = useAuth()
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      if (setLoading) setLoading(true);
      await googleLogin();
      toast.success('Google login successful!');
      navigate('/');
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