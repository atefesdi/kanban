import { BrowserRouter, Routes, Route } from "react-router-dom";

import './App.css'
import SignIn from "./pages/SignIn";
import Home from "./pages/home";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn/>} />
        <Route path="/" element={<Home/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
