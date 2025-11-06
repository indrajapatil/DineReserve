import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const handleLogout = () => navigate('/')

  return (
    <nav className="bg-black p-4 flex justify-between items-center shadow-md">
      <div className="bg-white px-4 py-2 rounded">
        <span className="text-black font-bold">Restaurant Admin</span>
      </div>

      <div className="flex gap-4 font-bold text-white">
        <button onClick={() => navigate('/dashboard')} className="hover:text-amber-400 transition">Dashboard</button>
        <button onClick={() => navigate('/ReservationManagement')} className="hover:text-amber-400 transition">Reservations</button>
        <button onClick={() => navigate('/users')} className="hover:text-amber-400 transition">Users</button>
        <button onClick={handleLogout} className="hover:text-amber-400 transition">Logout</button>
      </div>
    </nav>
  )
}

export default Navbar
