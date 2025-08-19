const FilterPanel = ({ currentFilter, onChangeFilter, className }) => {
  const filters = [
    { value: "all", label: "Todos", colorClass: "bg-gray-500" },
    { value: "healthy", label: "Saludables", colorClass: "bg-emerald-500" },
    { value: "moderate", label: "Moderados", colorClass: "bg-amber-500" },
    { value: "critical", label: "Críticos", colorClass: "bg-red-500" },
  ];

  return (
    <div
      className={`bg-black/70 backdrop-blur rounded-lg p-2 flex space-x-2 ${className}`}
    >
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChangeFilter(filter.value)}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            currentFilter === filter.value
              ? `${filter.colorClass} text-white`
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterPanel;
