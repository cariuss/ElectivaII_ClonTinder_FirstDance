import { useEffect } from "react"
import { login } from "./api/authservice"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./views/Home"
import RegistrationForm from "./views/RegistrationFormm"


function App() {
  useEffect(() => {
    const doLogin = async () => {
      try {
        const result = await login("user@example.com", "securePassword123")
        const token = result.data.token;
        sessionStorage.setItem("token", token);
      } catch (error) {
        console.error("Login failed:", error)
      }
    }

    doLogin()
  }, [])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/swipes" element={<Home />} />
        <Route path="/create-user" element={<RegistrationForm />} />

      </Routes>
  </BrowserRouter>
  )
}

export default App
