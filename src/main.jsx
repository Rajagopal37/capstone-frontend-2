// src/index.js

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App"; // Ensure this path is correct
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <App />
  </Router>
);
