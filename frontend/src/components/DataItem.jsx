export const DataItem = ({ label, value, icon }) => (
  <div className="bg-gray-700/50 hover:bg-gray-700/70 p-4 rounded-lg transition-colors border-l-4 border-emerald-500">
    <div className="flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-sm text-emerald-300">{label}</p>
        <p className="text-xl font-bold text-white">{value}</p>
      </div>
    </div>
  </div>
);
