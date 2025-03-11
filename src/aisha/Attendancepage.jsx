import React from "react";
import { FaSearch } from "react-icons/fa";

const employees = [
  { name: "Leasie Watson", designation: "Team Lead - Design", type: "Office", checkIn: "09:27 AM", status: "On Time", profileImage: "httpss://randomuser.me/api/portraits/women/1.jpg" },
  { name: "Darlene Robertson", designation: "Web Designer", type: "Office", checkIn: "10:15 AM", status: "Late", profileImage: "httpss://randomuser.me/api/portraits/women/2.jpg" },
  { name: "Jacob Jones", designation: "Medical Assistant", type: "Remote", checkIn: "10:24 AM", status: "Late", profileImage: "httpss://randomuser.me/api/portraits/men/1.jpg" },
  { name: "Kathryn Murphy", designation: "Marketing Coordinator", type: "Office", checkIn: "09:10 AM", status: "On Time", profileImage: "httpss://randomuser.me/api/portraits/women/3.jpg" },
  { name: "Leslie Alexander", designation: "Data Analyst", type: "Office", checkIn: "09:15 AM", status: "On Time", profileImage: "httpss://randomuser.me/api/portraits/men/2.jpg" },
  { name: "Ronald Richards", designation: "Python Developer", type: "Remote", checkIn: "09:29 AM", status: "On Time", profileImage: "httpss://randomuser.me/api/portraits/men/3.jpg" },
  { name: "Guy Hawkins", designation: "UI/UX Design", type: "Remote", checkIn: "09:29 AM", status: "On Time", profileImage: "httpss://randomuser.me/api/portraits/men/4.jpg" },
  { name: "Albert Flores", designation: "React JS", type: "Remote", checkIn: "09:29 AM", status: "On Time", profileImage: "httpss://randomuser.me/api/portraits/men/5.jpg" },
  { name: "Savannah Nguyen", designation: "IOS Developer", type: "Remote", checkIn: "10:50 AM", status: "Late", profileImage: "httpss://randomuser.me/api/portraits/women/4.jpg" },
  { name: "Marvin McKinney", designation: "HR", type: "Remote", checkIn: "09:29 AM", status: "On Time", profileImage: "httpss://randomuser.me/api/portraits/men/6.jpg" },
  { name: "Jerome Bell", designation: "Sales Manager", type: "Remote", checkIn: "09:29 AM", status: "On Time", profileImage: "httpss://randomuser.me/api/portraits/men/7.jpg" },
  { name: "Jenny Wilson", designation: "React JS Developer", type: "Remote", checkIn: "11:30 AM", status: "Late", profileImage: "httpss://randomuser.me/api/portraits/women/5.jpg" },
];

const AttendancePage = () => {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Attendance</h1>
      <p className="text-gray-500">All Employee Attendance</p>
      <div className="relative my-4">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          className="pl-10 p-2 border w-full rounded-md shadow-sm"
        />
      </div>
      <table className="w-full border-collapse shadow-md">
        <thead>
          <tr className="text-left border-b">
            <th className="p-3">Employee Name</th>
            <th className="p-3">Designation</th>
            <th className="p-3">Type</th>
            <th className="p-3">Check In Time</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="p-3 flex items-center gap-2">
                {/* Using the profile image URL dynamically */}
                <img
                  src={emp.profileImage} // Use dynamic image URL
                  alt={emp.name}
                  className="w-10 h-10 rounded-full"
                />
                {emp.name}
              </td>
              <td className="p-3">{emp.designation}</td>
              <td className="p-3">{emp.type}</td>
              <td className="p-3">{emp.checkIn}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded-md text-xs font-medium ${
                    emp.status === "On Time" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {emp.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4 text-gray-600">
        <span>Showing 1 to 10 out of 60 records</span>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              className={`px-3 py-1 border rounded-md ${num === 1 ? "bg-black text-white" : "bg-white"}`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
