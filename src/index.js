import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./chartSetup";
import "./styles/app.css";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  } from "chart.js";
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);