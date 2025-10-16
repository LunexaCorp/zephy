// App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Measurer from "./pages/MeasurerPage.jsx";
import Ranking from "./pages/RankingPage.jsx";
import NavBar from "./components/common/NavBar.jsx";
import MapPage from "./pages/Map.jsx";
import NotFound from "./components/common/NotFound.jsx";

const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Measurer />} />
        <Route path="/home" element={<Home />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/mapa" element={<MapPage />} />
        {/* Cualquier ruta que no exista */}
        <Route
          path="*"
          element={
            <div className="flex justify-center items-center w-screen h-screen">
              <NotFound />
            </div>
          }
        />
      </Routes>
    </>
  );
};

export default App;
