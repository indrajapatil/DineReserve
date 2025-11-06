import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ReservationHistory = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch email from localStorage (saved during login)
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    if (!userEmail) {
      navigate('/auth'); // redirect to login if not logged in
      return;
    }

    fetch(`http://localhost:5000/api/reservation/user/${userEmail}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setReservations(data.data);
        } else {
          console.error('Failed to fetch reservations:', data.error);
        }
      })
      .catch(err => console.error('Error fetching reservations:', err))
      .finally(() => setLoading(false));
  }, [userEmail, navigate]);

  if (loading) return <p className="text-center mt-10">Loading your reservations...</p>;

  return (
    <div className="min-h-screen bg-[#ffe2b7] p-6 md:p-12 flex justify-center items-start">
      <div className="max-w-4xl w-full">
        <div className='flex justify-between my-2'>
          <h2 className="text-3xl font-bold text-amber-600 uppercase tracking-wider mb-6 text-center">
            Your Reservations
          </h2>
          <button
            className='p-1 text-white px-3 bg-orange-500 font-bold rounded-lg'
            onClick={() => { navigate('/reservation/book') }}
          >
            Add Reservation
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {reservations.length === 0 ? (
            <p className="text-center text-gray-600">You have no reservations yet.</p>
          ) : (
            reservations.map((res) => (
              <div
                key={res._id}
                className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center"
              >
                <div>
                  <p className="text-gray-700">Name: {res.name}</p>
                  <p className="text-gray-700">Date: {new Date(res.date).toLocaleDateString()}</p>
                  <p className="text-gray-700">Time: {res.time}</p>
                  <p className="text-gray-700">Guests: {res.seats}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full font-semibold ${
                    res.status === 'Confirmed'
                      ? 'bg-green-100 text-green-700'
                      : res.status === 'Cancelled'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {res.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationHistory;
