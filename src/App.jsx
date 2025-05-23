import { useEffect } from "react"
import { login } from "./api/authservice"


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
    <>

    </>
  )
}

export default App
