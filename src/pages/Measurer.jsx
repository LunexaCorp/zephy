import React from 'react'

const Measurer = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header + selector de lugares */}
            <header className="bg-lime-500 px-3 py-5 shadow-xl">
                <div className="max-w-6xl mx-auto ">
                    <h1 className="text-white font-bold text-xl mb-3 flex justify-center">EcoRoute Medidor</h1>
                    <select className="w-full p-3 rounded-lg bg-gray-50 text-gray-700 font-medium border-none focus:ring-2 focus:ring-lime-300">
                        <option>Seleccionar ubicación...</option>
                        <option>Av. Alameda</option>
                        <option>Parque Central</option>
                    </select>
                </div>
            </header>

            {/* Contenido principal */}
            <main className="max-w-6xl mx-auto p-4">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Medidor (50% en lg+) */}
                    <div className="w-full lg:w-1/2">
                        <div className="bg-lime-400 rounded-2xl p-6 h-96 shadow-lg flex items-center justify-center">
                            <h2 className="text-2xl font-bold text-white text-center">
                                Medidor Ambiental<br />
                                <span className="text-lime-100 text-lg">CO₂ - Temperatura - Calidad del aire</span>
                            </h2>
                        </div>
                    </div>

                    {/* Datos (50% en lg+) */}
                    <div className="w-full lg:w-1/2">
                        <div className="bg-white rounded-2xl p-6 shadow-lg h-full">
                            <h2 className="text-xl font-bold text-lime-700 mb-5 flex items-center">
                                <span className="inline-block w-2 h-6 bg-lime-400 mr-2"></span>
                                Datos en tiempo real
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <DataItem label="Lugar" value="Av. Alameda" />
                                <DataItem label="Temperatura" value="24°C" />
                                <DataItem label="CO₂" value="412 ppm" />
                                <DataItem label="Calidad aire" value="Buena" />
                                <DataItem label="Viento" value="12 km/h" />
                                <DataItem label="Humedad" value="65%" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

// Label reutilizable
const DataItem = ({ label, value }) => (
    <div className="bg-gray-50 p-3 rounded-lg">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-lg font-semibold text-lime-600">{value}</p>
    </div>
)


export default Measurer