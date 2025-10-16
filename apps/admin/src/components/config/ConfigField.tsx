// Componente para campos numéricos
const ConfigField = ({ label, value, onChange, icon: Icon }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
    />
  </div>
);
