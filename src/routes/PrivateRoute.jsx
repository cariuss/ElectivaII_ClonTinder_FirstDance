import { Navigate, Outlet } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext.jsx";

const PrivateRoute = () => {
  const { user, loading } = useGlobal();

  if (loading) return null; // or a spinner/loading screen

  return user?.isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
