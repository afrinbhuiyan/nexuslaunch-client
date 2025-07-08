import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { user, logOut } = useAuth()

  return (
    <div className="navbar bg-base-100 px-4 sm:px-8 shadow-sm">
      {/* Logo/Brand */}
      <div className="flex-1">
        <Link to="/" className="text-xl font-bold">
          <span className="text-primary">Nexus</span>
          <span className="text-secondary">Launch</span>
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-4">
        <Link to="/products" className="btn btn-ghost btn-sm">Browse</Link>
        {user && <Link to="/dashboard" className="btn btn-ghost btn-sm">Dashboard</Link>}
      </div>

      {/* Auth Section */}
      <div className="flex-none gap-2">
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="avatar">
              <div className="w-8 rounded-full">
                <img 
                  src={user.photoURL || '/default-avatar.png'} 
                  alt={user.displayName} 
                />
              </div>
            </div>
            <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mt-4">
              <li className="menu-title">{user.displayName || 'User'}</li>
              <li><Link to="/profile">Profile</Link></li>
              <li><button onClick={logOut}>Logout</button></li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm">
            Login
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Navbar;