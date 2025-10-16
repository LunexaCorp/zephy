import { useState } from 'react';
import { Settings, Save, RotateCcw, MapPin, AlertCircle, Thermometer, Droplet, Wind } from 'lucide-react';

// Componentes reutilizables
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

const WeightSlider = ({ label, value, onChange, color = "emerald", icon: Icon }) => (
  <div>
    <div className="flex justify-between mb-2">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </label>
      <span className={`text-sm font-semibold ${
        color === 'emerald' ? 'text-emerald-600' :
          color === 'blue' ? 'text-blue-600' :
            'text-purple-600'
      }`}>
        {value}%
      </span>
    </div>
    <input
      type="range"
      min="0"
      max="100"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${
        color === 'emerald' ? 'accent-emerald-600' :
          color === 'blue' ? 'accent-blue-600' :
            'accent-purple-600'
      }`}
    />
  </div>
);

export default function EnvironmentalConfig() {
  const [activeTab, setActiveTab] = useState('ranges');
  const [selectedLocality, setSelectedLocality] = useState('puerto-maldonado');
  const [hasChanges, setHasChanges] = useState(false);

  const localities = [
    { id: 'puerto-maldonado', name: 'Puerto Maldonado', region: 'Selva' },
  ];

  const [config, setConfig] = useState({
    temperature: {
      optimalMin: 24,
      optimalMax: 28,
      toleranceLow: 8,
      toleranceHigh: 10
    },
    humidity: {
      optimalMin: 60,
      optimalMax: 85,
      toleranceLow: 20,
      toleranceHigh: 15
    },
    airQuality: {
      excellent: 500,
      good: 1000,
      moderate: 2500,
      poor: 5000,
      hazardous: 8000
    },
    weights: {
      temperature: 25,
      humidity: 25,
      airQuality: 50
    }
  });

  const handleSave = () => {
    console.log('Guardando configuración:', config);
    setHasChanges(false);
  };

  const handleReset = () => {
    setHasChanges(false);
  };

  const updateConfig = (section, field, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: parseFloat(value) || 0
      }
    }));
    setHasChanges(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-emerald-600" />
              <h1 className="text-2xl font-bold text-gray-900">Configuración Ambiental</h1>
            </div>

            <div className="flex items-center gap-3">
              {hasChanges && (
                <span className="text-sm text-amber-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Cambios sin guardar
                </span>
              )}
              <button
                onClick={handleReset}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Resetear
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Selector de Ubicación */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Ubicación</h2>
          </div>
          <select
            value={selectedLocality}
            onChange={(e) => setSelectedLocality(e.target.value)}
            className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            {localities.map(loc => (
              <option key={loc.id} value={loc.id}>
                {loc.name} ({loc.region})
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-2">
            Los cambios se aplicarán solo a la ubicación seleccionada
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('ranges')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'ranges'
                    ? 'border-b-2 border-emerald-600 text-emerald-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Rangos Óptimos
              </button>
              <button
                onClick={() => setActiveTab('weights')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === 'weights'
                    ? 'border-b-2 border-emerald-600 text-emerald-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Ponderación
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Tab: Rangos Óptimos */}
            {activeTab === 'ranges' && (
              <div className="space-y-8">
                {/* Temperatura */}
                <ConfigSection
                  title="Temperatura (°C)"
                  icon={Thermometer}
                  rangeInfo={`${config.temperature.optimalMin - config.temperature.toleranceLow}°C a ${config.temperature.optimalMax + config.temperature.toleranceHigh}°C`}
                >
                  <ConfigField
                    label="Rango Óptimo Mínimo"
                    value={config.temperature.optimalMin}
                    onChange={(val) => updateConfig('temperature', 'optimalMin', val)}
                  />
                  <ConfigField
                    label="Rango Óptimo Máximo"
                    value={config.temperature.optimalMax}
                    onChange={(val) => updateConfig('temperature', 'optimalMax', val)}
                  />
                  <ConfigField
                    label="Tolerancia hacia Frío"
                    value={config.temperature.toleranceLow}
                    onChange={(val) => updateConfig('temperature', 'toleranceLow', val)}
                  />
                  <ConfigField
                    label="Tolerancia hacia Calor"
                    value={config.temperature.toleranceHigh}
                    onChange={(val) => updateConfig('temperature', 'toleranceHigh', val)}
                  />
                </ConfigSection>

                {/* Humedad */}
                <ConfigSection
                  title="Humedad Relativa (%)"
                  icon={Droplet}
                  rangeInfo={`${config.humidity.optimalMin - config.humidity.toleranceLow}% a ${config.humidity.optimalMax + config.humidity.toleranceHigh}%`}
                >
                  <ConfigField
                    label="Rango Óptimo Mínimo"
                    value={config.humidity.optimalMin}
                    onChange={(val) => updateConfig('humidity', 'optimalMin', val)}
                  />
                  <ConfigField
                    label="Rango Óptimo Máximo"
                    value={config.humidity.optimalMax}
                    onChange={(val) => updateConfig('humidity', 'optimalMax', val)}
                  />
                  <ConfigField
                    label="Tolerancia hacia Seco"
                    value={config.humidity.toleranceLow}
                    onChange={(val) => updateConfig('humidity', 'toleranceLow', val)}
                  />
                  <ConfigField
                    label="Tolerancia hacia Húmedo"
                    value={config.humidity.toleranceHigh}
                    onChange={(val) => updateConfig('humidity', 'toleranceHigh', val)}
                  />
                </ConfigSection>

                {/* Calidad del Aire */}
                <ConfigSection
                  title="Calidad del Aire (MQ135)"
                  icon={Wind}
                >
                  <ConfigField
                    label="Excelente (≤)"
                    value={config.airQuality.excellent}
                    onChange={(val) => updateConfig('airQuality', 'excellent', val)}
                  />
                  <ConfigField
                    label="Bueno (≤)"
                    value={config.airQuality.good}
                    onChange={(val) => updateConfig('airQuality', 'good', val)}
                  />
                  <ConfigField
                    label="Moderado (≤)"
                    value={config.airQuality.moderate}
                    onChange={(val) => updateConfig('airQuality', 'moderate', val)}
                  />
                  <ConfigField
                    label="Pobre (≤)"
                    value={config.airQuality.poor}
                    onChange={(val) => updateConfig('airQuality', 'poor', val)}
                  />
                  <div className="md:col-span-2">
                    <ConfigField
                      label="Peligroso (≤)"
                      value={config.airQuality.hazardous}
                      onChange={(val) => updateConfig('airQuality', 'hazardous', val)}
                    />
                  </div>
                </ConfigSection>
              </div>
            )}

            {/* Tab: Ponderación */}
            {activeTab === 'weights' && (
              <div className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-amber-800">
                    <strong>Nota:</strong> Los pesos deben sumar 100%. Se ajustarán automáticamente.
                  </p>
                </div>

                <div className="space-y-6">
                  <WeightSlider
                    label="Temperatura"
                    icon={Thermometer}
                    value={config.weights.temperature}
                    onChange={(val) => updateConfig('weights', 'temperature', val)}
                    color="emerald"
                  />

                  <WeightSlider
                    label="Humedad"
                    icon={Droplet}
                    value={config.weights.humidity}
                    onChange={(val) => updateConfig('weights', 'humidity', val)}
                    color="blue"
                  />

                  <WeightSlider
                    label="Calidad del Aire"
                    icon={Wind}
                    value={config.weights.airQuality}
                    onChange={(val) => updateConfig('weights', 'airQuality', val)}
                    color="purple"
                  />
                </div>

                {/* Resumen Total */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className={`text-lg font-bold ${
                      config.weights.temperature + config.weights.humidity + config.weights.airQuality === 100
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {config.weights.temperature + config.weights.humidity + config.weights.airQuality}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600">
            Después de ajustar los parámetros, monitorea los datos durante 2-4 semanas para validar que los rangos sean apropiados para el clima local.
          </p>
        </div>
      </main>
    </div>
  );
}
