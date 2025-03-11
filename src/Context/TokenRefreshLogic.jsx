import { useEffect } from 'react';

const API_URL = 'https://techaid-001-site1.ptempurl.com/api/Employees';

const useAuth = () => {
  useEffect(() => {
    const checkTokenValidity = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) return;

      const isExpired = (token) => {
        try {
          const tokenParts = token.split('.');
          if (tokenParts.length !== 3) throw new Error("Invalid token format");

          const decodedToken = JSON.parse(atob(tokenParts[1])); // Decode JWT payload
          return decodedToken.exp * 1000 < Date.now(); // Check expiration
        } catch (error) {
          console.error("Error decoding token:", error);
          return true; // Treat invalid tokens as expired
        }
      };

      if (isExpired(token)) {
        try {
          const response = await fetch(`${API_URL}/refresh-token`, {
            method: 'POST',
            credentials: 'include', // Send refresh token from cookies
          });

          if (response.ok) {
            const data = await response.json();
            if (data.token) {
              localStorage.setItem('accessToken', data.token);
            } else {
              throw new Error("Invalid refresh response");
            }
          } else {
            console.warn("Refresh token request failed, logging out...");
            localStorage.removeItem('accessToken');
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          localStorage.removeItem('accessToken');
        }
      }
    };

    checkTokenValidity();
  }, []);
};

export default useAuth;
