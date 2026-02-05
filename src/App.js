import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SarusReport from "./pages/SarusReport";
import "./styles/app.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/report" element={<SarusReport />} />
      </Routes>
    </BrowserRouter>
  );
}
