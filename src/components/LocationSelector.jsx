export const LocationSelector = ({ onChange, currentLocation, locations }) => (
  <select
    value={currentLocation}
    onChange={(e) => onChange(e.target.value)}
    className="w-full p-3 rounded-lg bg-gray-50 text-gray-700 border-none focus:ring-3 focus:ring-emerald-300"
  >
    <option value="">Seleccionar...</option>
    {locations.map((loc) => (
      <option key={loc.id} value={loc.id}>{loc.name}</option>
    ))}
  </select>
);
