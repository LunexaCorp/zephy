import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Measurer from "./pages/MeasurerPage";
import Ranking from "./pages/RankingPage";
import NavBar from "./components/NavBar";
import MapPage from "./pages/Map";

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Measurer />} />
        <Route path="/home" element={<Home />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/mapa" element={<MapPage />} />
      </Routes>
    </Router>
  );
};

export default App;
