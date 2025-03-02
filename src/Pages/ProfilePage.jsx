import React, { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";

const ProfilePage = () => {
  const { user } = useContext(AuthContext); 
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    department: user?.department || "",
    contact: user?.phoneNumber || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 px-16 overflow-y-auto">
        <Header user={user} />

        {/* Profile Card */}
        <div className="max-w-full mx-auto rounded-lg p-8 mt-4">
          {/* Avatar, Name, and Email */}
          <div className="flex items-center gap-6 mb-6">
            <div className="w-16 h-16 bg-blue-700 text-white text-xl font-semibold rounded-full flex items-center justify-center">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{user?.firstName} {user?.lastName}</h2>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-600 block mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-96 px-4 py-2 border-2 border-gray-400 rounded-md bg-gray-100 text-gray-700"
              />
            </div>
            <div>
              <label className="text-gray-600 block mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-96 px-4 py-2 border-2 border-gray-400 rounded-md bg-gray-100 text-gray-700"
              />
            </div>
            <div>
              <label className="text-gray-600 block mb-2">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-96 px-4 py-2 border-2 border-gray-400 rounded-md bg-gray-100 text-gray-700"
              >
                <option value="">Select Department</option>
                <option value="IT">IT</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <div>
              <label className="text-gray-600 block mb-2">Contact</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-96 px-4 py-2 border-2 border-gray-400 rounded-md bg-gray-100 text-gray-700"
              />
            </div>
          </div>

          {/* Edit Button */}
          <div className="mt-6 flex justify-left">
            <button
              onClick={handleEdit}
              className="px-6 py-2 bg-blue-700 text-white rounded-md shadow-md hover:bg-blue-800 transition"
            >
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
