import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { locations } from '../data/locations';
import { sensorData } from '../data/sensorData';
import { EnvironmentalGauge } from '../components/EnvironmentalGauge';
import { LocationSelector } from '../components/LocationSelector';
import { DataItem } from '../components/DataItem';

const MeasurerPage = () => {
  const [currentLocation, setCurrentLocation] = useState(
    localStorage.getItem('lastLocation') || locations[0].id
  );
  const [data, setData] = useState(null);
  //const [animatedValue, setAnimatedValue] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('lastLocation', currentLocation);

    setData(sensorData[currentLocation]);
  }, [currentLocation]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-emerald-500 px-4 py-5 shadow-xl">
        <div className=" max-w-6xl mx-auto flex justify-between items-center mb-2">
          <h1 className="text-white text-xl font-bold">EcoRoute</h1>
        </div>
        <div className='max-w-6xl mx-auto'>
          <LocationSelector
            onChange={setCurrentLocation}
            currentLocation={currentLocation}
            locations={locations}
          />
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4">
        {data && (
          <div className="flex flex-col lg:flex-row justify-center gap-6">
            <EnvironmentalGauge data={data} />

            <div className="bg-white rounded-2xl p-6 shadow-lg w-full lg:w-1/2">
              <h2 className="text-xl font-bold text-emerald-800 mb-5">Datos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DataItem label="Lugar" value={data.location} />
                <DataItem label="Temperatura" value={`${data.temperature}°C`} />
                <DataItem label="CO₂" value={`${data.co2} ppm`} />
                <DataItem label="Calidad Aire" value={`${data.airQuality}/100`} />
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden shadow-md mx-auto">
              <div className="w-full h-full sm:w-[400px] aspect-[4/3] overflow-hidden">
                <img
                  src={data.img}
                  alt={data.location}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default MeasurerPage;
