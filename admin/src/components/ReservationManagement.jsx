import React, { useState, useEffect } from "react";
import Navbar from './Navbar'


// Total restaurant capacity
const TOTAL_SEATS = 50;
const TOTAL_TABLES = 15;

const ReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/reservation', {
          headers: { 'Content-Type': 'application/json', 'x-admin-secret': localStorage.getItem('adminAuth') || '' }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          // map backend fields to frontend expectations
          const mapped = data.data.map(r => ({
            id: r._id,
            name: r.name,
            phone: r.phone,
            date: r.date ? r.date.split('T')[0] : '',
            time: r.time,
            guests: r.seats,
            status: r.status
          }));
          setReservations(mapped);
        }
      } catch (err) {
        console.error('Load error', err);
      }
    };
    load();
    const interval = setInterval(load, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  // Compute dynamic dashboard values
  const confirmedReservations = reservations.filter(r => r.status === "Confirmed");
  const pendingReservations = reservations.filter(r => r.status === "Pending");
  const occupiedSeats = confirmedReservations.reduce((sum, r) => sum + r.guests, 0);
  const vacantSeats = TOTAL_SEATS - occupiedSeats;
  const confirmedTables = confirmedReservations.length;
  const vacantTables = TOTAL_TABLES - confirmedTables;
  const pendingCount = pendingReservations.length;

  // Update status (call backend). When confirming, ensure enough vacant seats.
  const updateStatus = async (id, status) => {
    try {
      const target = reservations.find(r => r.id === id);
      if (!target) return alert('Reservation not found');

      // If confirming a reservation, check vacant seats
      if (status === 'Confirmed') {
        const confirmedReservations = reservations.filter(r => r.status === 'Confirmed');
        const occupiedSeats = confirmedReservations.reduce((sum, r) => sum + r.guests, 0);
        const vacantSeats = TOTAL_SEATS - occupiedSeats;
        if (vacantSeats < target.guests) {
          return alert(`Cannot confirm. Only ${vacantSeats} seat(s) available, but reservation requires ${target.guests}.`);
        }
      }

      const res = await fetch(`http://localhost:5000/api/reservation/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': localStorage.getItem('adminAuth') || '' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReservations(reservations.map(r => (r.id === id ? { ...r, status } : r)));
      } else {
        alert('Failed to update: ' + (data.error || JSON.stringify(data)));
      }
    } catch (err) {
      console.error('Update error', err);
      alert('Update failed');
    }
  };

  // Cancel reservation (delete or mark cancelled)
  const cancelReservation = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/reservation/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': localStorage.getItem('adminAuth') || '' },
        body: JSON.stringify({ status: 'Cancelled' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReservations(reservations.map(r => (r.id === id ? { ...r, status: 'Cancelled' } : r)));
      } else {
        alert('Failed to cancel: ' + (data.error || JSON.stringify(data)));
      }
    } catch (err) {
      console.error('Cancel error', err);
      alert('Cancel failed');
    }
  };
  

  // Filter and search
  const filteredReservations = reservations.filter((r) => {
    return (
      (searchTerm === "" || r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.phone.includes(searchTerm)) &&
      (filterStatus === "" || r.status === filterStatus) &&
      (filterDate === "" || r.date === filterDate)
    );
  });

  return (
    <div className="min-h-screen bg-[#fef6e4] p-6 md:p-12">
      <Navbar />
      <h1 className="text-3xl font-bold text-amber-600 mb-6">Reservation Management</h1>

      {/* Dashboard Cards */}
      <div className="flex flex-wrap gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex-1 text-center">
          <h3 className="text-lg font-bold">Vacant Seats</h3>
          <p className="text-2xl font-bold text-green-600">{vacantSeats}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex-1 text-center">
          <h3 className="text-lg font-bold">Vacant Tables</h3>
          <p className="text-2xl font-bold text-blue-600">{vacantTables}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex-1 text-center">
          <h3 className="text-lg font-bold">Pending Reservations</h3>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or phone"
          className="p-3 border rounded-lg flex-1 focus:ring focus:ring-blue-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-3 border rounded-lg"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <input
          type="date"
          className="p-3 border rounded-lg"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      {/* Reservation Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead className="bg-amber-600 text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Guests</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No reservations found
                </td>
              </tr>
            ) : (
              filteredReservations.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{r.name}</td>
                  <td className="p-3">{r.phone}</td>
                  <td className="p-3">{r.date}</td>
                  <td className="p-3">{r.time}</td>
                  <td className="p-3">{r.guests}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-white ${
                        r.status === "Confirmed"
                          ? "bg-green-500"
                          : r.status === "Pending"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2 flex-wrap">
                    {r.status === "Pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(r.id, "Confirmed")}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateStatus(r.id, "Cancelled")}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {r.status !== "Cancelled" && (
                      <button
                        onClick={() => cancelReservation(r.id)}
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationManagement;
