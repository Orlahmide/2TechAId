import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";

import Header from "../Components/Header";
import toast from "react-hot-toast";
import AdminSidebar from "../Components/AdminSidebar";
import AdminHeader from "../Components/AdminHeader";

const AdminProfile = () => {
  const { user } = useContext(AuthContext); // Assuming this gives the user info from the AuthContext
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    department: "",
    contact: "",
  });

  const [originalUser, setOriginalUser] = useState(null); // Store the original user info

  // Fetch the user information when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          toast.error("User not authenticated");
          return;
        }

        const response = await fetch("http://techaid-001-site1.ptempurl.com/api/Employees/get_employee_id", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setOriginalUser(data); // Store the original user info

        // Populate the form with the fetched data
        setFormData({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          department: data.department || "",
          contact: data.phone_number || "",
        });
      } catch (error) {
        toast.error(error.message || "Failed to load user data");
      }
    };

    fetchUserData();
  }, []); // Only run once when the component mounts

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("User not authenticated");
        return;
      }

      const { firstName, lastName, contact, department } = formData;

      const body = {
        password: "", // Assuming password is not being updated (you can add a password field if necessary)
        phone_number: contact,
        first_name: firstName,
        last_name: lastName,
      };

      // Send update request
      const response = await fetch(
        `http://techaid-001-site1.ptempurl.com/api/Employees/update?department=${department}`,
        {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user data");
      }

      const updatedData = await response.json();
      toast.success("User information updated successfully!");

      // Optionally, refresh the data or re-enable editing
      setOriginalUser(updatedData); // Update original user data with the response
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || "Failed to update user data");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 text-base">
      <AdminSidebar />
      <div className="flex-1 p-6 sm:px-8 lg:px-16 overflow-y-auto">
        <AdminHeader user={user} />

        {/* Profile Card */}
        <div className="max-w-full mx-auto h-5/6 rounded-lg p-8 mt-12 bg-white shadow-md">
          {/* Avatar, Name, and Email */}
          <div className="flex items-center gap-6 mb-6">
            <div className="w-16 h-16 bg-blue-700 text-white text-xl font-semibold rounded-full flex items-center justify-center">
              {/* Display the initials (First letter of firstName + lastName) */}
              {originalUser
                ? `${originalUser.first_name.charAt(0)}${originalUser.last_name.charAt(0)}`
                : "N/A"}
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-gray-800">
                {originalUser ? `${originalUser.first_name} ${originalUser.last_name}` : "Loading..."}
              </h2>
              {/* Display the email next to the name */}
              <p className="text-gray-500 text-lg">
                {originalUser ? originalUser.email : "Loading..."}
              </p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-1 md:grid-cols-2">
            <div>
              <label className="text-gray-600 text-lg font-medium block mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full sm:w-96 px-4 py-3 border-2 border-gray-400 rounded-md bg-gray-100 text-gray-700 transition-transform transform ${
                  isEditing ? "scale-105 ring-2 ring-white" : ""
                }`}
              />
            </div>
            <div>
              <label className="text-gray-600 text-lg font-medium block mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full sm:w-96 px-4 py-3 border-2 border-gray-400 rounded-md bg-gray-100 text-gray-700 transition-transform transform ${
                  isEditing ? "scale-105 ring-2 ring-white" : ""
                }`}
              />
            </div>
            <div>
              <label className="text-gray-600 text-lg font-medium block mb-2">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full sm:w-96 px-4 py-3 border-2 border-gray-400 rounded-md bg-gray-100 text-gray-700 transition-transform transform ${
                  isEditing ? "scale-105 ring-2 ring-white" : ""
                }`}
              >
                <option value="">Select Department</option>
                <option value="SALES">Sales</option>
                <option value="MARKETING">Marketing</option>
                <option value="CUSTOMER_SERVICE">Customer Service</option>
                <option value="OPERATIONS">Operations</option>
                <option value="TREASURY">Treasury</option>
                <option value="HUMAN_RESOURCES">Human Resources</option>
              </select>
            </div>
            <div>
              <label className="text-gray-600 text-lg font-medium block mb-2">Phone Number</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full sm:w-96 px-4 py-3 border-2 border-gray-400 rounded-md bg-gray-100 text-gray-700 transition-transform transform ${
                  isEditing ? "scale-105 ring-2 ring-white" : ""
                }`}
              />
            </div>
          </div>

          {/* Edit Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={isEditing ? handleSave : handleEdit}
              className="px-10 py-3 bg-blue-900 text-white rounded-xl shadow-md hover:bg-blue-600 transition"
            >
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
