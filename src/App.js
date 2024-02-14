import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import { useState } from "react";
function App() {
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const ProtectedRoute = ({ element, ...rest }) => {
    const isAuthenticated = localStorage.getItem("token");

    return isAuthenticated ? element : <Navigate to="/login" />;
  };
  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<ProtectedRoute element={<HomePage />} />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
