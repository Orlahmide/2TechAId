import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Context/AuthContext";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    department: "",
    contact: "",
  });

  const [originalUser, setOriginalUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          toast.error("User not authenticated");
          return;
        }

        const response = await fetch("http://localhost:5215/api/Employees/get_employee_id", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setOriginalUser(data);

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
  }, []);

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
        password: "",
        phone_number: contact,
        first_name: firstName,
        last_name: lastName,
      };

      const response = await fetch(
        `http://localhost:5215/api/Employees/update?department=${department}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
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
      setOriginalUser(updatedData);
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || "Failed to update user data");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 text-base">
      <Sidebar />
      <div className="flex-1 p-6 px-16 overflow-y-auto">
        <Header user={user} />

        <div className="max-w-full mx-auto h-5/6 rounded-lg p-8 mt-12 bg-white shadow-md">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-blue-700 text-white text-2xl font-semibold rounded-full flex items-center justify-center">
              {originalUser
                ? `${originalUser.first_name.charAt(0)}${originalUser.last_name.charAt(0)}`
                : "N/A"}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-semibold text-gray-800">
                {originalUser ? `${originalUser.first_name} ${originalUser.last_name}` : "Loading..."}
              </h2>
              <p className="text-gray-600 text-lg">
                {originalUser ? originalUser.email : "Loading..."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="text-gray-600 block mb-2 text-lg">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-6 py-3 border border-gray-400 rounded-md bg-gray-100 text-gray-700 ${
                  isEditing ? "ring-2 ring-blue-500" : ""
                }`}
              />
            </div>
            <div>
              <label className="text-gray-600 block mb-2 text-lg">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-6 py-3 border border-gray-400 rounded-md bg-gray-100 text-gray-700 ${
                  isEditing ? "ring-2 ring-blue-500" : ""
                }`}
              />
            </div>
            <div>
              <label className="text-gray-600 block mb-2 text-lg">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-6 py-3 border border-gray-400 rounded-md bg-gray-100 text-gray-700 ${
                  isEditing ? "ring-2 ring-blue-500" : ""
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
              <label className="text-gray-600 block mb-2 text-lg">Phone Number</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-6 py-3 border border-gray-400 rounded-md bg-gray-100 text-gray-700 ${
                  isEditing ? "ring-2 ring-blue-500" : ""
                }`}
              />
            </div>
          </div>

          <div className="mt-12 flex justify-center md:justify-end">
            <button
              onClick={isEditing ? handleSave : handleEdit}
              className="px-12 py-4 text-lg bg-blue-900 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
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
