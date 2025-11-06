import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminLogin from './components/login'
import Dashboard from './components/dashboard'
import ReservationManagement from './components/ReservationManagement'
import UserManagement from './components/UserManagement'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AdminLogin />} />
  <Route path='/dashboard' element={<Dashboard />} />
  <Route path='/ReservationManagement' element={<ReservationManagement />} />
  <Route path='/users' element={<UserManagement />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
