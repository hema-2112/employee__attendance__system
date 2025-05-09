import axios from 'axios';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        if (authToken) {
          const response = await axios.get('http://localhost:5000/api/auth/verify', {
            headers: {
              "Authorization": `Bearer ${authToken}`
            },
          });

          console.log("Verification response:", response.data); // Cleaner logging
          
          if (response.data.success) {
            setUser(response.data.user);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Verification error:", error.response?.data || error.message);

        // Optional: auto-logout if token is invalid or expired
        if (error.response?.status === 401) {
          logout(); 
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, [authToken]);

  const login = (userData, token) => {
    setUser(userData);
    setAuthToken(token);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem("token");
    navigate("/login"); // redirect to login
  };

  return (
    <AuthContext.Provider value={{ user, authToken, login, logout, loading }}>
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h3>Loading...</h3>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
