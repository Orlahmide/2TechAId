import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage when the app starts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse back to an object
    }
  }, []);

  const login = (email, password) => {
    // Mock login logic
    const users = [
      { email: 'it@example.com', password: 'password', role: 'it' },
      {
        email: 'staff@example.com',
        password: 'password',
        role: 'staff',
        profile: { name: 'John Doe', image: 'https://via.placeholder.com/40' },
      },
      { email: 'admin@example.com', password: 'password', role: 'admin' },
    ];

    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser)); // Save user data
      return foundUser.role;
    }
    return null;
  };

  const register = (name, email, password, role) => {
    // Mock registration logic
    const newUser = {
      email,
      role,
      profile: { name, image: 'https://via.placeholder.com/40' },
    };

    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser)); // Save user data
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Remove user from storage
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
