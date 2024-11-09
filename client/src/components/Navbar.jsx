import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const name = localStorage.getItem("userName");
    setUser(name);
    if (!name) {
      navigate('/');
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("userName");
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-gray-800 shadow-lg p-2">
      <div className="container mx-auto flex items-center justify-between px-5">
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <NavLink to="/" className="text-white text-xl font-bold">
            MyApp
          </NavLink>

          {/* Links */}
          {user && (
            <>
              <NavLink
                to="/desboard"
                className={({ isActive }) =>
                  `text-gray-300 hover:text-white transition ${
                    isActive ? 'border-b-2 border-white' : ''
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/employeeList"
                className={({ isActive }) =>
                  `text-gray-300 hover:text-white transition ${
                    isActive ? 'border-b-2 border-white' : ''
                  }`
                }
              >
                Employee List
              </NavLink>
            </>
          )}
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <h3 className="text-gray-300">Hello, {user}</h3>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded transition"
            >
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
