import { Routes, Route } from "react-router-dom";
import './App.css';
import Register from "./pages/Register";
import Login from "./pages/Login";
import Manufacturer from "./pages/Manufacturer";
import Transporter from "./pages/Transporter";


function App() {
  return (
    <>
      <Routes>
        
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/transporter" element={<Transporter />} />
        <Route path="/manufacturer" element={<Manufacturer/>} />
      </Routes>
    </>
  );
}

export default App;
