import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import { Routes, Route, Navigate } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Remove trailing slash from backend URL to prevent double slashes
export const backendUrl = (import.meta.env.VITE_BACKEND_URL || "http://localhost:4000").replace(/\/$/, '');
export const currency = "$";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  // If not logged in, show Login page
  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      <Navbar setToken={setToken} />
      <hr />

      <div className="flex w-full">
        <SideBar />

        <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
          <Routes>
            {/* Redirect root to list */}
            <Route path="/" element={<Navigate to="/list" replace />} />

            <Route path="/add" element={<Add token={token} />} />
            <Route path="/list" element={<List token={token} />} />

            <Route path="/order" element={<Orders token={token} />} />

            {/* Optional 404 */}
            <Route path="*" element={<Navigate to="/list" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;