import React, { useState } from "react";
import axios from "axios";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Use axios to make the POST request
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Add this if your backend uses cookies
        }
      );

      // Check if login is successful
      if (response.status === 200) {
        console.log("Login successful:", response.data);
        // Handle login success, e.g., save token or set user data
        setUser(response.data);
      }
    } catch (error) {
      // Handle error responses
      if (error.response) {
        console.error("Login failed:", error.response.data.message);
        setError("Login failed: " + error.response.data.message);
      } else {
        console.error("Error during login:", error);
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  // const handleLogin = async (credentials) => {
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:8000/login",
  //       credentials
  //     );
  //     const { token } = response.data; // Adjust this according to your API response

  //     localStorage.setItem("token", token); // Store token in localStorage
  //     console.log("Token set:", token); // Log the token
  //   } catch (error) {
  //     console.error("Error logging in:", error);
  //   }
  // };

  return (
    <div>
      <h2>Login</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
