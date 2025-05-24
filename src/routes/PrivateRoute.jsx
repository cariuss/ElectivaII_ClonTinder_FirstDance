import { Navigate, Outlet } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext.jsx";

const PrivateRoute = () => {
  const { user } = useGlobal();
  return user?.isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
