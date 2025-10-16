// Componente de sección completa
const ConfigSection = ({ title, icon: Icon, children, rangeInfo }) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
      <Icon className="w-5 h-5" />
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
    {rangeInfo && (
      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Rango completo:</strong> {rangeInfo}
        </p>
      </div>
    )}
  </div>
);


export default ConfigSection;
