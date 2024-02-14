import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";

export default function Navbar({isLoggedIn,setIsLoggedIn}) {

  useEffect(() => {
    // Check if user is already logged in
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false); // Update login status
    window.location.reload();
  };

  return (
    <div className="h-14 sticky top-0 z-[50] flex justify-between items-center border-b border-gray-200 bg-white">
      <div className="cursor-pointer flex-1 ml-12">
        <p>Build With Innovation.</p>
      </div>
      <div className="flex-1 flex justify-center">
        <Link to="/">Home</Link>
      </div>
      <div className="flex-1 flex justify-end mr-12">
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
}
