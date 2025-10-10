const MeasurerHeader = ({ locations, currentLocation, setCurrentLocation }) => (
  <header className="bg-gradient-to-b from-gray-900 via-gray-950 to-black border-b border-emerald-400/30 shadow-lg">
    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 px-4 py-5">
      <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
        <h1 className="text-3xl font-bold text-emerald-400 tracking-wide flex items-center gap-2">
          Monitoreo Ambiental
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Observa el pulso climático de la ciudad en tiempo real
        </p>
      </div>

      <div className="w-full sm:w-64">
        <select
          value={currentLocation || ""}
          onChange={(e) => setCurrentLocation(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-emerald-400/50 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
        >
          <option value="" disabled>Selecciona una ubicación</option>
          {locations.map((loc) => (
            <option key={loc._id} value={loc._id}>{loc.name}</option>
          ))}
        </select>
      </div>
    </div>
  </header>
);

export default MeasurerHeader;
