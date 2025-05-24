import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GlobalProvider } from "./context/GlobalContext";
import RegisterForm from "./views/RegisterForm";
import LoginForm from "./views/LoginForm";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./components/Dashboard";
import Home from "./views/Home";
import MatchesChat from "./views/MatchesChat";

function App() {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/create/user" element={<RegisterForm />} />
          {/* <Route path="/swipes" element={<Home />} /> */}
          <Route path="/login" element={<LoginForm />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
