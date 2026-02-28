import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from "react";

import Index from './components/Login/Index'
import Verify from './components/Login/Verify';
import Login from './components/internalLogin/Login';
import PrivateRoutesScreen from './RoutesScreen/PrivateRoutes';



function TokenWatcher() {

  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem("access_token");

    if (!token) return;

    try {

      if (!token.includes(".")) return;

      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000;

      if (Date.now() > exp) {

        localStorage.removeItem("access_token");
        navigate("/internal/login");

      }

    } catch (err) {
      console.log("Token parse error", err);
    }

  }, []);

  return null;
}



function App() {

  return (
    <Router>

     
      <TokenWatcher />

      <Routes>
        <Route path='/internal/login' element={<Login />} />
        <Route path="/" element={<Index />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/*" element={<PrivateRoutesScreen />} />
      </Routes>

    </Router>
  );
}

export default App;
