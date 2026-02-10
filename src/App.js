import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SarusReport from "./pages/SarusReport";
import TransportPage from "./pages/TransportPage";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/report" element={<SarusReport />} />
        <Route path="/transport" element={<TransportPage />} />
      </Routes>
    </BrowserRouter>
  );
}
