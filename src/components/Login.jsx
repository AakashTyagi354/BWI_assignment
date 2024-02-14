import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify"; // Import toast notifications
import { z } from "zod"; // Import Zod for validation

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
    }
  }, []);

  // Define validation schema using Zod
  const loginSchema = z.object({
    username: z.string().nonempty("Username is required"),
    password: z.string().nonempty("Password is required"),
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate form data
      loginSchema.parse({ username, password });

      // Perform login logic
      setLoading(true);
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setUsername("");
        setPassword("");
        setIsLoggedIn(true);
        toast.success("Login successful!"); // Display success toast
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      // Display validation errors or login errors as toast notifications
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        console.error("Error logging in:", error);
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    // Redirect to homepage if user is already logged in
    return <Navigate to="/" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <ToastContainer /> {/* Render toast notifications */}
      <div className="flex flex-col min-h-[350px] w-[400px] border border-gray-200">
        <p className=" mt-4 text-center text-4xl underline font-bold">Login</p>
        <form onSubmit={onSubmit} className="flex p-6 flex-col gap-6 mt-6">
          <input
            type="text"
            name="email"
            value={username}
            className="focus:outline-none"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="abc@gmail.com"
            disabled={loading} // Disable input field while loading
          />
          <input
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="focus:outline-none"
            placeholder="********"
            disabled={loading} // Disable input field while loading
          />
          <p className="text-sm text-gray-500">
            New to BWI webite{" "}
            <span className="text-gray-900 underline cursor-pointer">register</span> here{" "}
          </p>
          <button
            disabled={loading}
            className="h-12 mt-6 w-full bg-black text-white font-bold flex items-center justify-center"
            type="submit"
          >
            {loading ? (
              <FaSpinner className="animate-spin mr-2" /> // Display spinner icon while loading
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
