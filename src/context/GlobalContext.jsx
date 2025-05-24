import { createContext, useContext, useState, useEffect } from "react";
import request from "../api/request"; // API request module

const GlobalContext = createContext(null);

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token"); // Switch to sessionStorage
    setUser({ isAuthenticated: !!storedToken });
  }, []);

  const login = async (email, password) => {
    try {
      const response = await request("post", "auth/login", false, {}, "", { email, password });
      
      localStorage.setItem("token", response.token); // Save token directly
      setUser({ isAuthenticated: true });
      
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem("token"); // Remove token
    setUser({ isAuthenticated: false });
  };

  return (
    <GlobalContext.Provider value={{ user, login, logout }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
