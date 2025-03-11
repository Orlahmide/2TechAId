import React, { useContext, useState, useEffect } from 'react';
import AdminSidebar from '../Components/AdminSidebar';
import { AuthContext } from "../Context/AuthContext";
import Header from '../Components/Header';
import AdminHeader from '../Components/AdminHeader';

const AccessLog = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]); // State to store the list of users
    const [filteredUsers, setFilteredUsers] = useState([]); // State to store filtered users based on role
    const [selectedRole, setSelectedRole] = useState('all'); // State to store selected role for filtering

    // Fetch the list of users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://techaid-001-site1.ptempurl.com/api/Employees');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data); // Set the users data into the state
                setFilteredUsers(data); // Initially, set filtered users as all users
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchUsers();
    }, []);

    // Filter users based on selected role
    useEffect(() => {
        if (selectedRole === 'all') {
            setFilteredUsers(users); // Show all users
        } else {
            setFilteredUsers(users.filter(user => user.role === selectedRole)); // Filter based on selected role
        }
    }, [selectedRole, users]);

    return (
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar />
            <div className="flex-1 p-6 px-16 overflow-y-auto">
                <AdminHeader user={user} />

                {/* Container for Filter and Access Log on the same line */}
                <div className="flex justify-between items-center mt-6">
                    {/* Access Log Title */}
                    <h2 className="text-3xl font-semibold text-gray-800">Access Log</h2>

                    {/* Dropdown for Role Filter */}
                    <div className="flex items-center gap-4">
                        <label htmlFor="role-select" className="text-lg font-medium text-gray-700">Filter by:</label>
                        <select
                            id="role-select"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="mt-2 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-lg"
                        >
                            <option value="all">All</option>
                            <option value="BANK_STAFF">Bank Staff</option>
                            <option value="IT_PERSONNEL">IT Personnel</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                </div>

                {/* User Table Section */}
                <div className="mt-10">
                    <div className="overflow-x-auto mt-4 h-[680px]"> {/* Adjust the height as needed */}
                        <table className="min-w-full table-auto bg-white border-collapse rounded-lg shadow-lg">
                            <thead className="sticky top-0 bg-gray-200">
                                <tr className="border-b">
                                    <th className="py-4 px-6 text-left text-lg font-medium text-gray-700">Name</th>
                                    <th className="py-4 px-6 text-left text-lg font-medium text-gray-700">ID</th>
                                    <th className="py-4 px-6 text-left text-lg font-medium text-gray-700">Email</th>
                                    <th className="py-4 px-6 text-left text-lg font-medium text-gray-700">Role</th>
                                    <th className="py-4 px-6 text-left text-lg font-medium text-gray-700">Date Created</th>
                                </tr>
                            </thead>
                            <tbody className="overflow-y-auto">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user, index) => (
                                        <tr
                                            key={user.id}
                                            className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-100 transition-all duration-200`}
                                        >
                                            <td className="py-4 px-6 text-lg text-gray-800">{user.first_name} {user.last_name}</td>
                                            <td className="py-4 px-6 text-lg text-gray-800">{user.id}</td>
                                            <td className="py-4 px-6 text-lg text-gray-800">{user.email}</td>
                                            <td className="py-4 px-6 text-lg text-gray-800">{user.role}</td>
                                            <td className="py-4 px-6 text-lg text-gray-800">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-4 px-6 text-lg text-center text-gray-500">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessLog;
