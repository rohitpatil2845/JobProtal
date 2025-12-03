import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiBriefcase, FiUser, FiLogOut, FiMenu, FiX, FiHeart, FiFileText } from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to={user ? (isAdmin ? '/admin/dashboard' : '/jobs') : '/'} 
              className="flex items-center space-x-2"
            >
              <FiBriefcase className="text-primary-600 text-2xl" />
              <span className="text-xl font-bold text-gray-900">JobPortal</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/jobs"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Browse Jobs
            </Link>

            {user ? (
              <>
                {isAdmin ? (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                    >
                      <MdDashboard />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      to="/admin/jobs"
                      className="text-gray-700 hover:text-primary-600 transition-colors"
                    >
                      Manage Jobs
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/my-applications"
                      className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                    >
                      <FiFileText />
                      <span>My Applications</span>
                    </Link>
                    <Link
                      to="/saved-jobs"
                      className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                    >
                      <FiHeart />
                      <span>Saved Jobs</span>
                    </Link>
                    <Link
                      to="/recommendations"
                      className="text-gray-700 hover:text-primary-600 transition-colors"
                    >
                      Recommendations
                    </Link>
                  </>
                )}

                <div className="flex items-center space-x-3">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
                  >
                    <FiUser />
                    <span>{user.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-3">
            <Link
              to="/jobs"
              className="block text-gray-700 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse Jobs
            </Link>

            {user ? (
              <>
                {isAdmin ? (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="block text-gray-700 hover:text-primary-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/jobs"
                      className="block text-gray-700 hover:text-primary-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Manage Jobs
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/my-applications"
                      className="block text-gray-700 hover:text-primary-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Applications
                    </Link>
                    <Link
                      to="/saved-jobs"
                      className="block text-gray-700 hover:text-primary-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Saved Jobs
                    </Link>
                    <Link
                      to="/recommendations"
                      className="block text-gray-700 hover:text-primary-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Recommendations
                    </Link>
                  </>
                )}

                <Link
                  to="/profile"
                  className="block text-gray-700 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-gray-700 hover:text-primary-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-primary-600 hover:text-primary-700 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
