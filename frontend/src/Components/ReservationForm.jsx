import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaReddit, FaTwitter, FaYoutube } from 'react-icons/fa';

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: "1"
  });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || 'null');
      if (!u || !u.email) {
        // require login to make reservation
        window.location.href = '/auth';
        return;
      }
      setUser(u);
    } catch (err) {
      console.error('Invalid user in localStorage', err);
      window.location.href = '/auth';
    }
  }, []);

  const handleChanges = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        alert('Please login to make reservation');
        window.location.href = '/auth';
        return;
      }

      const payload = {
        name: user.name || 'Guest',
        email: user.email,
        phone: user.phone || '',
        date: formData.date,
        time: formData.time,
        seats: Number(formData.guests)
      };

      const res = await fetch('http://localhost:5000/api/reservation/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        alert('Reservation created successfully');

        // ✅ STEP 3: Update user's reservation count (if we have user._id)
        const userData = user || JSON.parse(localStorage.getItem('user') || 'null');
        if (userData && userData._id) {
          try {
            await fetch(`http://localhost:5000/api/user/${userData._id}/increment-reservations`, {
              method: "POST",
            });
          } catch (updateErr) {
            console.error("Reservation count update failed", updateErr);
          }
        }

  // Reset form
  setFormData({ date: '', time: '', guests: '1' });

  // Redirect user to their reservations page
  navigate('/reservation');
      } else {
        alert('Failed: ' + (data.error || JSON.stringify(data)));
      }
    } catch (err) {
      console.error('Submit error', err);
      alert('An error occurred while submitting the reservation');
    }
  };

  // Time slots (9 AM - 9 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 21; hour++) {
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const period = hour < 12 ? "AM" : "PM";
      slots.push(`${displayHour}:00 ${period}`);
    }
    return slots;
  };

  return (
    <div className='min-h-screen bg-[#ffe2b7] p-6 md:p-12'>
      <div className='max-w-6xl mx-auto grid md:grid-cols-3 gap-8'>
        <form onSubmit={handleSubmit} className='md:col-span-2 bg-white p-8 rounded-lg shadow-md'>
          <h2 className='text-3xl font-bold text-amber-600 uppercase tracking-wider'>Reserve a Table</h2>
          <h1 className='text-xl font-bold mb-4'>Dine with us</h1>
          
          {/* Show user info (read-only) */}
          {user && (
            <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
              <h3 className='font-bold text-gray-700 mb-2'>Reservation for:</h3>
              <p className='text-gray-600'>Name: {user.name || 'Guest'}</p>
              <p className='text-gray-600'>Email: {user.email}</p>
              <p className='text-gray-600'>Phone: {user.phone || 'Not provided'}</p>
            </div>
          )}

          <div className='grid md:grid-cols-2 gap-4'>
            <div className='grid gap-1.5'>
              <label className='font-bold'>Reservation Date</label>
              <input type='date' name='date' value={formData.date} onChange={handleChanges} required className='w-full p-3 mb-3 border rounded-lg focus:ring focus:ring-blue-300'/>
            </div>
            <div className='grid gap-1.5'>
              <label className='font-bold'>Time of Reservation</label>
              <select name='time' value={formData.time} onChange={handleChanges} required className='w-full p-3 mb-3 border rounded-lg focus:ring focus:ring-blue-300'>
                <option value="">Select Time</option>
                {generateTimeSlots().map((slot, index) => (
                  <option key={index} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
            <div className='grid gap-1.5 md:col-span-2'>
              <label className='font-bold'>Number of Guests</label>
              <select name='guests' value={formData.guests} onChange={handleChanges} required className='w-full p-3 mb-3 border rounded-lg focus:ring focus:ring-blue-300'>
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1} Guest(s)</option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className='w-full mt-4 bg-amber-600 text-white p-3 rounded-lg hover:bg-amber-500 transition'>Book Now</button>
        </form>

        <div className='space-y-8'>
          <div className='bg-black text-gray-300 p-8 rounded-lg shadow-md'>
            <h3 className='text-lg font-bold'>Address</h3>
            <p>123, Abc street, N-axis, Sample City, State, Country</p>
          </div>
          <div className='bg-white text-gray-800 p-8 rounded-lg shadow-md'>
            <h3 className='text-lg font-bold'>Open Time</h3>
            <p>Mon - Fri: 11:00 AM - 10:00 PM</p>
            <p>Sat - Sun: 09:00 AM - 11:00 PM</p>
          </div>
          <div className='bg-white text-gray-800 p-8 rounded-lg shadow-md'>
            <h3 className='text-lg font-bold'>Stay Connected</h3>
            <div className='flex gap-4'>
              <FaFacebook className='text-3xl hover:text-blue-600 transition'/>
              <FaTwitter className='text-3xl hover:text-sky-500 transition'/>
              <FaInstagram className='text-3xl hover:text-pink-500 transition'/>
              <FaReddit className='text-3xl hover:text-orange-600 transition'/>
              <FaYoutube className='text-3xl hover:text-red-600 transition'/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;
