import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user");
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Edit user (name, email, phone)
  const editUser = async (id) => {
    const newName = prompt("Enter new name:");
    const newEmail = prompt("Enter new email:");
    const newPhone = prompt("Enter new phone:");

    if (!newName || !newEmail || !newPhone) return;

    try {
      const res = await fetch(`http://localhost:5000/api/user/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, email: newEmail, phone: newPhone }),
      });

      const data = await res.json();
      if (data.success) {
        alert("User updated successfully!");
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Block/unblock user
  const toggleBlockUser = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/${id}/block`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  // Search filter
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#fef6e4] p-6 md:p-12">
      <Navbar />
      <h1 className="text-3xl font-bold text-amber-600 mb-6">User Management</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or phone"
          className="p-3 border rounded-lg flex-1 focus:ring focus:ring-blue-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead className="bg-amber-600 text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Reservations</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.phone}</td>
                  <td className="p-3 text-center">{user.reservations || 0}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-white ${
                        user.status === "blocked" ? "bg-red-500" : "bg-green-500"
                      }`}
                    >
                      {user.status === "blocked" ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2 flex-wrap">
                    <button
                      onClick={() => editUser(user._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleBlockUser(user._id)}
                      className={`${
                        user.status === "blocked"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      } text-white px-3 py-1 rounded transition`}
                    >
                      {user.status === "blocked" ? "Unblock" : "Block"}
                    </button>
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

export default UserManagement;
