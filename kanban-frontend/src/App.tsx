import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Home from "./pages/home";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SignUp from "./pages/SignUp";


function App() {


  return (
      <Routes>
        <Route path="/signin" element={<SignIn/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>} />
      </Routes>
  )
}

export default App
