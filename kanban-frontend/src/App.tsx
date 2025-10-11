import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Home from "./pages/home";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import SignUp from "./pages/SignUp";
import NewTask from "./pages/NewTask";


function App() {


  return (
      <Routes>
        <Route path="/signin" element={<SignIn/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/" element={<ProtectedRoute><Home/></ProtectedRoute>} >
          <Route path="/new-task" element={ <NewTask/> } />
        </Route>
      </Routes>
  )
}

export default App
