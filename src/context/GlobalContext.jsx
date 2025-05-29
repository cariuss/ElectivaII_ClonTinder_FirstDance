import { createContext, useContext, useState, useEffect } from "react";
import { loginService } from "../api/authservice"; // Cambia el nombre aquí
import request from "../api/request"; // API request module

const GlobalContext = createContext(null);

export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setUser({ isAuthenticated: !!token });
    setLoading(false); // once token check is done
  }, []);

  const login = async (email, password) => {
    try {
      const response = await loginService(email, password);
      if (response.success && response.data.token) {
        localStorage.setItem("token", response.data.token);
        setUser({ isAuthenticated: true });
        return response;
      }
      return { success: false, error: "Credenciales incorrectas. Inténtalo de nuevo." };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Error de autenticación. Inténtalo nuevamente." };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser({ isAuthenticated: false });
  };

  return (
    <GlobalContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);