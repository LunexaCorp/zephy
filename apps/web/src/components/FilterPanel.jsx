const FilterPanel = ({ currentFilter, onChangeFilter, className = "" }) => {
  const filters = [
    {
      value: "all",
      label: "Todos",
      colorClass: "bg-gray-500",
      hoverClass: "hover:bg-gray-400"
    },
    {
      value: "healthy",
      label: "Saludables (≥60%)",
      colorClass: "bg-emerald-500",
      hoverClass: "hover:bg-emerald-400"
    },
    {
      value: "moderate",
      label: "Moderados (40-59%)",
      colorClass: "bg-amber-500",
      hoverClass: "hover:bg-amber-400"
    },
    {
      value: "critical",
      label: "Críticos (<40%)",
      colorClass: "bg-red-500",
      hoverClass: "hover:bg-red-400"
    },
  ];

  return (
    <div
      className={`bg-black/70 backdrop-blur-md rounded-lg p-3 flex flex-wrap gap-2 ${className}`}
    >
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChangeFilter(filter.value)}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
            currentFilter === filter.value
              ? `${filter.colorClass} text-white shadow-lg scale-105`
              : `bg-gray-700 text-gray-300 hover:bg-gray-600 ${filter.hoverClass}`
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterPanel;
