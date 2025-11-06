import React, { useEffect, useState } from 'react';
// navigation handled by shared Navbar
import Navbar from './Navbar'

const BACKEND = 'http://localhost:5000';
const Dashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND}/api/reservation`, {
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': localStorage.getItem('adminAuth') || '' }
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to fetch reservations');
        setReservations([]);
      } else {
        // map backend fields to local format
        const mapped = data.data.map((r) => ({
          id: r._id,
          date: r.date ? r.date.split('T')[0] : '',
          time: r.time,
          guests: r.seats,
          status: r.status
        }));
        setReservations(mapped);
      }
    } catch (err) {
      console.error('Fetch error', err);
      setError('Network error');
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    const interval = setInterval(fetchReservations, 10000);
    return () => clearInterval(interval);
  }, []);

  // Derived stats
  const totalReservations = reservations.length;
  const pendingReservations = reservations.filter((r) => r.status === 'Pending').length;
  const confirmedReservations = reservations.filter((r) => r.status === 'Confirmed').length;
  const cancelledReservations = reservations.filter((r) => r.status === 'Cancelled').length;
  const totalGuests = reservations.reduce((sum, r) => sum + (Number(r.guests) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar />

      <div className="p-6 md:p-12 flex justify-center items-start">
        <div className="max-w-5xl w-full">
          <h2 className="text-3xl font-bold text-amber-600 uppercase tracking-wider mb-6 text-center">
            Admin Dashboard
          </h2>

          <div className="flex flex-wrap justify-between gap-4 mb-8">
            {[
              { title: "Total Reservations", value: totalReservations, color: "text-amber-600" },
              { title: "Confirmed", value: confirmedReservations, color: "text-green-600" },
              { title: "Cancelled", value: cancelledReservations, color: "text-red-600" },
              { title: "Pending", value: pendingReservations, color: "text-orange-500" },
              { title: "Total Guests", value: totalGuests, color: "text-blue-600" },
            ].map((card, index) => (
              <div
                key={index}
                className="flex-1 min-w-[150px] bg-white p-6 rounded-lg shadow-md flex flex-col items-center"
              >
                <h3 className="text-lg font-semibold text-gray-700">{card.title}</h3>
                <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Reservations</h3>
            {loading ? (
              <p>Loading reservations...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-amber-100">
                      <th className="p-3 border-b text-left">Date</th>
                      <th className="p-3 border-b text-left">Time</th>
                      <th className="p-3 border-b text-left">Guests</th>
                      <th className="p-3 border-b text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.slice(0, 10).map((res) => (
                      <tr key={res.id} className="hover:bg-amber-50">
                        <td className="p-3 border-b">{res.date}</td>
                        <td className="p-3 border-b">{res.time}</td>
                        <td className="p-3 border-b">{res.guests}</td>
                        <td
                          className={`p-3 border-b font-semibold ${
                            res.status === 'Confirmed'
                              ? 'text-green-600'
                              : res.status === 'Cancelled'
                              ? 'text-red-600'
                              : 'text-orange-500'
                          }`}
                        >
                          {res.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
