import { useEffect, useState } from "react";
import { getSingleDashboardData, getLocations } from "../services/axios.js";

export const useMeasurerData = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(localStorage.getItem("lastLocation") || null);

  useEffect(() => {
    const init = async () => {
      try {
        const locs = await getLocations();
        setLocations(locs);

        let initial = currentLocation || (locs.length > 0 ? locs[0]._id : null);
        if (initial) {
          setCurrentLocation(initial);
          const data = await getSingleDashboardData(initial);
          setDashboardData(data);
        }
      } catch (err) {
        setError("Error al cargar los datos iniciales");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (!currentLocation) return;
    const fetchData = async () => {
      try {
        const data = await getSingleDashboardData(currentLocation);
        setDashboardData(data);
      } catch {
        setError("Error al actualizar datos del medidor.");
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    localStorage.setItem("lastLocation", currentLocation);
    return () => clearInterval(interval);
  }, [currentLocation]);

  return { dashboardData, locations, loading, error, currentLocation, setCurrentLocation };
};
