import "./App.css";
import Home from "./pages/Home.tsx";
import LocationPage from "./pages/Locations.tsx";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/common/SideBar.tsx";
import DevicesPage from "./pages/Devices.tsx";
import CreateLocationPage from "./pages/CreateLocation.tsx";
import EditLocationPage from "./pages/EditLocationPage.tsx";
import EnvironmentalConfig from "./pages/EnvironmentalConfig.tsx";

function App() {
  return (
    <Router>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="min-h-full p-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/locations" element={<LocationPage />} />
              <Route path="/devices" element={<DevicesPage />} />
              <Route path="/locations/new" element={<CreateLocationPage />} />
              <Route path="/locations/edit/:id" element={<EditLocationPage />} />
              <Route path="/environmental-config" element={<EnvironmentalConfig />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
