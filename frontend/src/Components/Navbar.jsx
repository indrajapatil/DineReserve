import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleAuthClick = () => {
    navigate('/auth'); // Navigate to AuthForm page
  };

  return (
    <div>
      <nav className="flex justify-between items-center p-[2rem] bg-black text-white">
        {/* Brand Name */}
        <div>
          <h2 className="font-bold text-2xl tracking-wide">INDRAJA BISTRO</h2>
        </div>

        {/* Navigation Links */}
        <div>
          <ul className="flex gap-8 items-center">
            <Link
              to="/home"
              className="font-bold text-lg cursor-pointer hover:text-amber-400 transition"
            >
              HOME
            </Link>
            <Link
              to="/reservation"
              className="font-bold text-lg cursor-pointer hover:text-amber-400 transition"
            >
              RESERVATION
            </Link>
            <Link
              to="/menu"
              className="font-bold text-lg cursor-pointer hover:text-amber-400 transition"
            >
              MENU
            </Link>
            <Link
              to="/contact"
              className="font-bold text-lg cursor-pointer hover:text-amber-400 transition"
            >
              CONTACT
            </Link>

            <button
              onClick={handleAuthClick}
              className="font-bold text-lg cursor-pointer hover:text-amber-400 transition"
            >
              Login / Register
            </button>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
